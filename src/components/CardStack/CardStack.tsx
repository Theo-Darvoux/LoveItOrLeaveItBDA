import { AnimatePresence } from 'framer-motion';
import { SwipeCard } from '../SwipeCard/SwipeCard';
import { Movie, SwipeDirection } from '../../types';
import './CardStack.css';

interface CardStackProps {
  currentMovie: Movie | null;
  nextMovie: Movie | null;
  onSwipe: (direction: SwipeDirection) => void;
}

export function CardStack({ currentMovie, nextMovie, onSwipe }: CardStackProps) {
  return (
    <div className="card-stack">
      <AnimatePresence initial={false}>
        {nextMovie && (
          <SwipeCard
            key={nextMovie.id}
            movie={nextMovie}
            onSwipe={() => {}}
            isTop={false}
          />
        )}
        {currentMovie && (
          <SwipeCard
            key={currentMovie.id}
            movie={currentMovie}
            onSwipe={onSwipe}
            isTop={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
