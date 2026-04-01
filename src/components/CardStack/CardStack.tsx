import { forwardRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SwipeCard, SwipeCardRef } from '../SwipeCard/SwipeCard';
import { Movie, SwipeDirection } from '../../types';
import './CardStack.css';

interface CardStackProps {
  currentMovie: Movie | null;
  nextMovie: Movie | null;
  onSwipe: (direction: SwipeDirection) => void;
}

export const CardStack = forwardRef<SwipeCardRef, CardStackProps>(({ currentMovie, nextMovie, onSwipe }, ref) => {
  return (
    <div className="card-stack">
      <AnimatePresence>
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
            ref={ref}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

CardStack.displayName = 'CardStack';
