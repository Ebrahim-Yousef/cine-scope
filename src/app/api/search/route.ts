import { NextRequest, NextResponse } from 'next/server';
import { searchMulti, TMDBError, formatYear } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

    // Validation
    if (!query) {
      return NextResponse.json(
        { error: 'استعلام البحث مطلوب', results: [], total_pages: 0, total_results: 0 },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'يرجى إدخال حرفين على الأقل للبحث', results: [], total_pages: 0, total_results: 0 },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'استعلام البحث طويل جداً (الحد الأقصى 100 حرف)', results: [], total_pages: 0, total_results: 0 },
        { status: 400 }
      );
    }

    const data = await searchMulti(query, page);

    // Filter out 'person' and keep only 'movie' and 'tv'
    const filteredResults = data.results
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => {
        if (item.media_type === 'movie') {
          return {
            id: item.id,
            mediaType: 'movie' as const,
            title: item.title,
            originalTitle: item.original_title,
            overview: item.overview,
            posterPath: item.poster_path,
            backdropPath: item.backdrop_path,
            year: formatYear(item.release_date),
            rating: item.vote_average,
            url: `/movie/${item.id}`,
          };
        } else {
          return {
            id: item.id,
            mediaType: 'tv' as const,
            title: item.name,
            originalTitle: item.original_name,
            overview: item.overview,
            posterPath: item.poster_path,
            backdropPath: item.backdrop_path,
            year: formatYear(item.first_air_date),
            rating: item.vote_average,
            url: `/tv/${item.id}`,
          };
        }
      });

    return NextResponse.json(
      {
        page: data.page,
        results: filteredResults,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    if (error instanceof TMDBError) {
      return NextResponse.json(
        {
          error: 'حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل.',
          results: [],
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل.', results: [] },
      { status: 500 }
    );
  }
}
