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

  let bestProfile = profiles[0];
  let bestScore = -Infinity;

  for (const profile of profiles) {
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
