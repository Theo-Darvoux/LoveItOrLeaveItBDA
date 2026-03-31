import { Choice, CinemaProfile, GameStats, Genre, Movie } from '../types';
import { profiles } from '../data/profiles';

export function calculateProfile(
  choices: Choice[],
  movies: Movie[]
): { profile: CinemaProfile; stats: GameStats } {
  const genreScores: Partial<Record<Genre, number>> = {};

  const totalLoved = choices.filter((c) => c.direction === 'right').length;
  const totalLeft = choices.filter((c) => c.direction === 'left').length;
  const totalUnknown = choices.filter((c) => c.direction === 'up').length;
  const totalMovies = choices.length;

  const lovedRatio = totalMovies > 0 ? totalLoved / totalMovies : 0;
  const leftRatio = totalMovies > 0 ? totalLeft / totalMovies : 0;
  const unknownRatio = totalMovies > 0 ? totalUnknown / totalMovies : 0;

  const movieMap = new Map(movies.map((m) => [m.id, m]));

  for (const choice of choices) {
    const movie = movieMap.get(choice.movieId);
    if (!movie) continue;

    for (const genre of movie.genres) {
      if (!genreScores[genre]) genreScores[genre] = 0;
      if (choice.direction === 'right') {
        genreScores[genre]! += 2;
      } else if (choice.direction === 'left') {
        genreScores[genre]! -= 1;
      }
    }
  }

  const maxScore = Math.max(...Object.values(genreScores).map((v) => v ?? 0), 1);
  const normalizedScores: Partial<Record<Genre, number>> = {};
  for (const [genre, score] of Object.entries(genreScores)) {
    normalizedScores[genre as Genre] = Math.max(0, (score ?? 0) / maxScore);
  }

  // Check for special profiles first
  let bestProfile = null;
  if (lovedRatio >= 0.9) {
    bestProfile = profiles.find(p => p.id === 'movie-buff');
  } else if (leftRatio >= 0.9) {
    bestProfile = profiles.find(p => p.id === 'hard-to-please');
  } else if (unknownRatio >= 0.9) {
    bestProfile = profiles.find(p => p.id === 'cinema-newbie');
  }

  let bestScore = -Infinity;

  if (!bestProfile) {
    for (const profile of profiles) {
      // Skip special profiles during normal genre matching
      if (['movie-buff', 'hard-to-please', 'cinema-newbie'].includes(profile.id)) continue;

      let score = 0;
      let totalWeight = 0;
      
      for (const [genre, weight] of Object.entries(profile.genreAffinities)) {
        const g = genre as Genre;
        const w = weight ?? 0;
        score += (normalizedScores[g] ?? 0) * w;
        totalWeight += w;
      }

      const normalizedProfileScore = totalWeight > 0 ? score / totalWeight : 0;

      if (normalizedProfileScore > bestScore) {
        bestScore = normalizedProfileScore;
        bestProfile = profile;
      }
    }
  } else {
    // For special profiles, we set a high match score
    bestScore = 1.0;
  }

  if (!bestProfile) bestProfile = profiles[0];

  const sortedGenres = Object.entries(normalizedScores)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 3)
    .map(([g]) => g as Genre);

  const matchPercentage = Math.round(bestScore * 100);

  return {
    profile: bestProfile,
    stats: {
      totalLoved,
      totalLeft,
      totalUnknown,
      topGenres: sortedGenres,
      matchPercentage: Math.min(100, Math.max(0, matchPercentage)),
    },
  };
}
