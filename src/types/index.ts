export type Genre = 'action' | 'comedy' | 'horror' | 'sci-fi' | 'romance' | 'drama' | 'animation' | 'thriller';

export type SwipeDirection = 'right' | 'left' | 'up';

export interface Movie {
  id: string;
  titleKey: string;
  year: number;
  genres: Genre[];
  posterGradient: string;
  posterUrl?: string;
}

export interface Choice {
  movieId: string;
  direction: SwipeDirection;
}

export interface CinemaProfile {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  icon: string;
  color: string;
  genreAffinities: Partial<Record<Genre, number>>;
}

export interface GenreScore {
  genre: Genre;
  score: number; // 0 to 1
}

export interface GameStats {
  totalLoved: number;
  totalLeft: number;
  totalUnknown: number;
  topGenres: GenreScore[];
  matchPercentage: number;
}

export type Screen = 'welcome' | 'game' | 'result';

export interface GameState {
  screen: Screen;
  currentIndex: number;
  choices: Choice[];
  profile: CinemaProfile | null;
  stats: GameStats | null;
  soundEnabled: boolean;
}
