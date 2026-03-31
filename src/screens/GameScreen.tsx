import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CardStack } from '../components/CardStack/CardStack';
import { ActionButtons } from '../components/ActionButtons/ActionButtons';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { Movie, SwipeDirection } from '../types';
import { triggerCardSwipe } from '../utils/swipeUtils';
import './screens.css';

interface GameScreenProps {
  currentMovie: Movie | null;
  nextMovie: Movie | null;
  currentIndex: number;
  onSwipe: (movieId: string, direction: SwipeDirection) => void;
  onFinish: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playSound: (name: string) => void;
}

export function GameScreen({
  currentMovie,
  nextMovie,
  currentIndex,
  onSwipe,
  onFinish,
  soundEnabled,
  onToggleSound,
  playSound,
}: GameScreenProps) {
  const { t, i18n } = useTranslation();
  const lastSwipeTime = useRef<number>(0);
  useEffect(() => {
    if (!currentMovie && !nextMovie) {
      const timer = setTimeout(() => {
        onFinish();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentMovie, nextMovie, onFinish]);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!currentMovie) return;
    const soundMap: Record<SwipeDirection, string> = {
      right: 'love',
      left: 'leave',
      up: 'unknown',
    };
    playSound(soundMap[direction]);
    onSwipe(currentMovie.id, direction);
  }, [currentMovie, onSwipe, playSound]);

  const handleButtonAction = useCallback((direction: SwipeDirection) => {
    const now = Date.now();
    if (now - lastSwipeTime.current < 100) return;
    lastSwipeTime.current = now;

    const swiped = triggerCardSwipe(direction);
    if (!swiped && currentMovie) {
      handleSwipe(direction);
    }
  }, [currentMovie, handleSwipe]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
      } else {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          handleButtonAction('left');
          break;
        case 'ArrowRight':
          handleButtonAction('right');
          break;
        case 'ArrowUp':
          handleButtonAction('up');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonAction]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  const containerVariants = {
    initial: { 
      opacity: 0, 
      scale: 1.1,
      filter: 'blur(20px)',
      backgroundColor: 'rgba(0,0,0,1)' 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      backgroundColor: 'rgba(0,0,0,0)', 
      transition: { 
        duration: 1.5, 
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.3,
        delayChildren: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.1,
      filter: 'blur(20px)',
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }
    }
  } as const;

  const topBarVariants = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  } as const;

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  } as const;

  const actionsVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  } as const;

  return (
    <motion.div
      className="screen game-screen"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="game-screen__top" variants={topBarVariants}>
        <ProgressBar current={currentIndex} />

        <button className="control-btn control-btn--small game-screen__top-left" onClick={onToggleSound} aria-label={soundEnabled ? t('app.soundOn') : t('app.soundOff')}>
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
          <div className="control-btn-shine" />
        </button>
        <button className="control-btn control-btn--small lang-toggle game-screen__top-right" onClick={toggleLanguage}>
          {i18n.language === 'fr' ? 'EN' : 'FR'}
          <div className="control-btn-shine" />
        </button>
      </motion.div>

      <motion.div className="game-screen__cards" variants={cardVariants}>
        <CardStack
          currentMovie={currentMovie}
          nextMovie={nextMovie}
          onSwipe={handleSwipe}
        />
      </motion.div>

      <motion.div className="game-screen__actions" variants={actionsVariants}>
        <ActionButtons
          onAction={handleButtonAction}
          labels={{ left: t('swipe.leave'), up: '?', right: t('swipe.love') }}
          disabled={!currentMovie}
        />
      </motion.div>
    </motion.div>
  );
}
