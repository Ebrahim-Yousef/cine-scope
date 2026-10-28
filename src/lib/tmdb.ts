import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBSearchItem,
  TMDBPaginatedResponse,
} from "@/types/tmdb";

const TMDB_DEFAULT_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export class TMDBError extends Error {
  statusCode?: number;
  isConfigError: boolean;

  constructor(message: string, statusCode?: number, isConfigError = false) {
    super(message);
    this.name = "TMDBError";
    this.statusCode = statusCode;
    this.isConfigError = isConfigError;
  }
}

function getBaseUrl(): string {
  return process.env.TMDB_BASE_URL || TMDB_DEFAULT_BASE_URL;
}

function getAccessToken(): string | null {
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  return token || null;
}

export function isTMDBConfigured(): boolean {
  return !!getAccessToken();
}

/**
 * Server-only fetch wrapper for TMDB API
 */
async function tmdbFetch<T>(
  endpoint: string,
  options: {
    params?: Record<string, string | number | undefined>;
    revalidate?: number | false;
  } = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[TMDB Server]: TMDB API token is not configured.");
    }
    throw new TMDBError(
      "تعذّر تحميل المحتوى في الوقت الحالي.",
      500,
      true,
    );
  }

  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  if (options.revalidate === false || options.revalidate === 0) {
    fetchOptions.cache = "no-store";
  } else if (typeof options.revalidate === "number") {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), fetchOptions);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[TMDB Network Error]:", error instanceof Error ? error.message : "Unknown");
    }
    throw new TMDBError(
      "حصلت مشكلة في الاتصال بالشبكة. حاول تاني بعد قليل.",
      503,
    );
  }

  if (res.status === 404) {
    throw new TMDBError("العنصر المطلوب غير موجود", 404);
  }

  if (!res.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[TMDB Upstream Error]: HTTP status", res.status);
    }
    throw new TMDBError(
      "تعذّر تحميل البيانات من الخادم في الوقت الحالي.",
      res.status,
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new TMDBError("فشل تحليل استجابة TMDB كبيانات JSON", 502);
  }
}

/**
 * Image URL builder with TMDB standard sizes
 */
export type PosterSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";

export function getTMDBImageUrl(
  path: string | null | undefined,
  size: PosterSize | BackdropSize = "w500",
): string | null {
  if (!path) return null;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE_URL}/${size}${cleanPath}`;
}

export function formatRating(rating: number | undefined | null): string {
  if (rating === undefined || rating === null || rating <= 0) return "—";
  return rating.toFixed(1);
}

export function formatYear(dateString?: string | null): string {
  if (!dateString) return "";
  const year = dateString.split("-")[0];
  return /^\d{4}$/.test(year) ? year : "";
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining} دقيقة`;
  if (remaining === 0) return `${hours} ساعة`;
  return `${hours} س ${remaining} د`;
}

// API methods
export async function getPopularMovies(
  page = 1,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const safePage = Math.min(Math.max(1, page), 500);
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/popular", {
    params: { page: safePage, language: "en-US" },
    revalidate: 600, // 10 minutes
  });
}

export async function getPopularTVShows(
  page = 1,
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const safePage = Math.min(Math.max(1, page), 500);
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/popular", {
    params: { page: safePage, language: "en-US" },
    revalidate: 600,
  });
}

export async function getTopRatedMovies(
  page = 1,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const safePage = Math.min(Math.max(1, page), 500);
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/top_rated", {
    params: { page: safePage, language: "en-US" },
    revalidate: 900, // 15 minutes
  });
}

export async function getMovieDetails(
  id: string | number,
): Promise<TMDBMovieDetails | null> {
  try {
    return await tmdbFetch<TMDBMovieDetails>(
      `/movie/${encodeURIComponent(id)}`,
      {
        params: { language: "en-US" },
        revalidate: 1800, // 30 minutes
      },
    );
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function getTVDetails(
  id: string | number,
): Promise<TMDBTVDetails | null> {
  try {
    return await tmdbFetch<TMDBTVDetails>(`/tv/${encodeURIComponent(id)}`, {
      params: { language: "en-US" },
      revalidate: 1800,
    });
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function searchMulti(
  query: string,
  page = 1,
): Promise<TMDBPaginatedResponse<TMDBSearchItem>> {
  const safePage = Math.min(Math.max(1, page), 500);
  return tmdbFetch<TMDBPaginatedResponse<TMDBSearchItem>>("/search/multi", {
    params: {
      query: query.trim(),
      page: safePage,
      include_adult: "false",
      language: "en-US",
    },
    revalidate: false,
  });
}
