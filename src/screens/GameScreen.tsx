import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CardStack } from '../components/CardStack/CardStack';
import { ActionButtons } from '../components/ActionButtons/ActionButtons';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { SoundToggleButton } from '../components/SoundToggleButton/SoundToggleButton';
import { Movie, SwipeDirection } from '../types';
import { SwipeCardRef } from '../components/SwipeCard/SwipeCard';
import './screens.css';

interface GameScreenProps {
  currentMovie: Movie | null;
  nextMovie: Movie | null;
  currentIndex: number;
  isFinished: boolean;
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
  isFinished,
  onSwipe,
  onFinish,
  soundEnabled,
  onToggleSound,
  playSound,
}: GameScreenProps) {
  const { t, i18n } = useTranslation();
  const lastSwipeTime = useRef<number>(0);
  const cardStackRef = useRef<SwipeCardRef>(null);

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        onFinish();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, onFinish]);

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

    if (cardStackRef.current) {
      cardStackRef.current.triggerSwipe(direction);
    } else if (currentMovie) {
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

        <SoundToggleButton 
          soundEnabled={soundEnabled} 
          onToggleSound={onToggleSound} 
          className="control-btn--small game-screen__top-left" 
        />
        <button className="control-btn control-btn--small lang-toggle game-screen__top-right" onClick={toggleLanguage}>
          {i18n.language === 'fr' ? 'EN' : 'FR'}
          <div className="control-btn-shine" />
        </button>
      </motion.div>

      <motion.div className="game-screen__cards" variants={cardVariants}>
        <CardStack
          ref={cardStackRef}
          currentMovie={currentMovie}
          nextMovie={nextMovie}
          onSwipe={handleSwipe}
        />
      </motion.div>

      <motion.div className="game-screen__actions" variants={actionsVariants}>
        <ActionButtons
          onAction={handleButtonAction}
          labels={{ left: t('swipe.leave'), up: '?', right: t('swipe.love') }}
          disabled={!currentMovie || isFinished}
        />
      </motion.div>
    </motion.div>
  );
}
