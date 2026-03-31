import { useReducer, useCallback, useEffect } from 'react';
import { GameState, SwipeDirection, Movie } from '../types';
import { movies } from '../data/movies';
import { calculateProfile } from '../utils/calculateProfile';
import { TOTAL_MOVIES } from '../utils/constants';

type GameAction =
  | { type: 'START_GAME'; payload: { shuffledMovies: Movie[] } }
  | { type: 'SWIPE'; payload: { movieId: string; direction: SwipeDirection } }
  | { type: 'FINISH' }
  | { type: 'RESTART'; payload: { shuffledMovies: Movie[] } }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_SOUND'; payload: boolean };

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const initialState: GameState = {
  screen: 'welcome',
  currentIndex: 0,
  choices: [],
  profile: null,
  stats: null,
  soundEnabled: true,
  shuffledMovies: movies,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        screen: 'game',
        currentIndex: 0,
        choices: [],
        profile: null,
        stats: null,
        shuffledMovies: action.payload.shuffledMovies,
      };

    case 'SWIPE': {
      const newChoices = [
        ...state.choices,
        { movieId: action.payload.movieId, direction: action.payload.direction },
      ];
      const newIndex = state.currentIndex + 1;

      if (newIndex >= TOTAL_MOVIES) {
        const { profile, stats } = calculateProfile(newChoices, state.shuffledMovies);
        return {
          ...state,
          currentIndex: newIndex,
          choices: newChoices,
          profile,
          stats,
        };
      }

      return {
        ...state,
        currentIndex: newIndex,
        choices: newChoices,
      };
    }

    case 'FINISH':
      return {
        ...state,
        screen: 'result',
      };

    case 'RESTART':
      return {
        ...state,
        screen: 'welcome',
        currentIndex: 0,
        choices: [],
        profile: null,
        stats: null,
        shuffledMovies: action.payload.shuffledMovies,
      };

    case 'TOGGLE_SOUND': {
      const newSoundEnabled = !state.soundEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem('soundEnabled', String(newSoundEnabled));
      }
      return { ...state, soundEnabled: newSoundEnabled };
    }

    case 'SET_SOUND':
      return { ...state, soundEnabled: action.payload };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundEnabled');
      if (saved !== null) {
        dispatch({ type: 'SET_SOUND', payload: saved !== 'false' });
      }
    }
  }, []);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(movies);
    dispatch({ type: 'START_GAME', payload: { shuffledMovies: shuffled } });
  }, []);

  const swipe = useCallback((movieId: string, direction: SwipeDirection) => {
    dispatch({ type: 'SWIPE', payload: { movieId, direction } });
  }, []);

  const finish = useCallback(() => {
    dispatch({ type: 'FINISH' });
  }, []);

  const restart = useCallback(() => {
    const shuffled = shuffleArray(movies);
    dispatch({ type: 'RESTART', payload: { shuffledMovies: shuffled } });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const currentMovie = state.currentIndex < TOTAL_MOVIES ? state.shuffledMovies[state.currentIndex] : null;
  const nextMovie = state.currentIndex + 1 < TOTAL_MOVIES ? state.shuffledMovies[state.currentIndex + 1] : null;

  return {
    state,
    currentMovie,
    nextMovie,
    startGame,
    swipe,
    finish,
    restart,
    toggleSound,
  };
}
