export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  original_language?: string;
  media_type?: 'movie';
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  original_language?: string;
  media_type?: 'tv';
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: TMDBGenre[];
  tagline?: string | null;
  status?: string;
  original_language?: string;
  budget?: number;
  revenue?: number;
  homepage?: string | null;
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: TMDBGenre[];
  tagline?: string | null;
  status?: string;
  original_language?: string;
  homepage?: string | null;
}

export type TMDBSearchItem =
  | (TMDBMovie & { media_type: 'movie' })
  | (TMDBTVShow & { media_type: 'tv' })
  | {
      id: number;
      media_type: 'person';
      name: string;
      profile_path: string | null;
    };

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaItem = {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate?: string;
  rating: number;
  type: 'movie' | 'tv';
};
