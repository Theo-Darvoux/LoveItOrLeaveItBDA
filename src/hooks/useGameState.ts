import { useReducer, useCallback } from 'react';
import { GameState, SwipeDirection } from '../types';
import { movies } from '../data/movies';
import { calculateProfile } from '../utils/calculateProfile';
import { TOTAL_MOVIES } from '../utils/constants';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SWIPE'; payload: { movieId: string; direction: SwipeDirection } }
  | { type: 'FINISH' }
  | { type: 'RESTART' }
  | { type: 'TOGGLE_SOUND' };

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
  soundEnabled: typeof window !== 'undefined' ? localStorage.getItem('soundEnabled') !== 'false' : true,
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
      };

    case 'SWIPE': {
      const newChoices = [
        ...state.choices,
        { movieId: action.payload.movieId, direction: action.payload.direction },
      ];
      const newIndex = state.currentIndex + 1;

      if (newIndex >= TOTAL_MOVIES) {
        const { profile, stats } = calculateProfile(newChoices, shuffledMovies);
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
      shuffledMovies = shuffleArray(movies);
      return {
        ...state,
        screen: 'welcome',
        currentIndex: 0,
        choices: [],
        profile: null,
        stats: null,
      };

    case 'TOGGLE_SOUND': {
      const newSoundEnabled = !state.soundEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem('soundEnabled', String(newSoundEnabled));
      }
      return { ...state, soundEnabled: newSoundEnabled };
    }

    default:
      return state;
  }
}

let shuffledMovies = shuffleArray(movies);

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    shuffledMovies = shuffleArray(movies);
    dispatch({ type: 'START_GAME' });
  }, []);

  const swipe = useCallback((movieId: string, direction: SwipeDirection) => {
    dispatch({ type: 'SWIPE', payload: { movieId, direction } });
  }, []);

  const finish = useCallback(() => {
    dispatch({ type: 'FINISH' });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const currentMovie = state.currentIndex < TOTAL_MOVIES ? shuffledMovies[state.currentIndex] : null;
  const nextMovie = state.currentIndex + 1 < TOTAL_MOVIES ? shuffledMovies[state.currentIndex + 1] : null;

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
