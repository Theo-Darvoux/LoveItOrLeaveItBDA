import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { flushSync } from 'react-dom';
import {
  motion,
  useMotionValue,
  useTransform,
  usePresence,
  type PanInfo,
  MotionValue,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Movie, SwipeDirection } from '../../types';
import {
  SWIPE_THRESHOLD_X,
  SWIPE_THRESHOLD_Y,
  VELOCITY_THRESHOLD,
  MAX_ROTATION,
  EXIT_DISTANCE,
} from '../../utils/constants';
import { SwipeCardElement } from '../../utils/swipeUtils';
import './SwipeCard.css';

interface SwipeCardProps {
  movie: Movie;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

const TopCardDecorations = memo(({ 
  x, 
  y, 
  t 
}: { 
  x: MotionValue<number>, 
  y: MotionValue<number>, 
  t: TFunction 
}) => {
  const glintX = useTransform(x, [-300, 0, 300], ["-150%", "50%", "250%"]);
  const glintOpacity = useTransform(x, [-100, 0, 100], [0.3, 0.05, 0.3]);

  const loveOpacity = useTransform(x, [15, SWIPE_THRESHOLD_X], [0, 1]);
  const leaveOpacity = useTransform(x, [-SWIPE_THRESHOLD_X, -15], [1, 0]);
  const unknownOpacity = useTransform(y, [-SWIPE_THRESHOLD_Y, -15], [1, 0]);

  return (
    <>
      <motion.div
        className="swipe-card__glint"
        style={{
          x: glintX,
          opacity: glintOpacity
        }}
      />
      <motion.div
        className="swipe-overlay swipe-overlay--love"
        style={{ opacity: loveOpacity }}
      >
        <span className="swipe-overlay__stamp">{t('swipe.love')}</span>
      </motion.div>
      <motion.div
        className="swipe-overlay swipe-overlay--leave"
        style={{ opacity: leaveOpacity }}
      >
        <span className="swipe-overlay__stamp">{t('swipe.leave')}</span>
      </motion.div>
      <motion.div
        className="swipe-overlay swipe-overlay--unknown"
        style={{ opacity: unknownOpacity }}
      >
        <span className="swipe-overlay__stamp">?</span>
      </motion.div>
    </>
  );
});

TopCardDecorations.displayName = 'TopCardDecorations';

const CardContent = memo(({ movie, t, isExiting }: { movie: Movie, t: TFunction, isExiting: boolean }) => {
  return (
    <div
      className="swipe-card__poster"
      style={{ 
        background: movie.posterUrl ? `url(${movie.posterUrl}) center/cover no-repeat` : movie.posterGradient 
      }}
    >
      {!isExiting && (
        <>
          <div className="swipe-card__grain" />

          <div className="swipe-card__genres">
            {movie.genres.map((genre: string) => (
              <span key={genre} className="swipe-card__genre-badge">
                {t(`genres.${genre}`)}
              </span>
            ))}
          </div>

          <div className="swipe-card__info">
            <h2 className="swipe-card__title">{t(movie.titleKey)}</h2>
            <span className="swipe-card__year">{movie.year}</span>
          </div>
        </>
      )}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export const SwipeCard = memo(({ movie, onSwipe, isTop }: SwipeCardProps) => {
  const { t } = useTranslation();
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPresent] = usePresence();
  const isExiting = !isPresent;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-MAX_ROTATION, 0, MAX_ROTATION]);

  function determineDirection(info: PanInfo): SwipeDirection | null {
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    const velX = Math.abs(info.velocity.x);
    const velY = Math.abs(info.velocity.y);

    if (
      (info.offset.y < -SWIPE_THRESHOLD_Y || velY > VELOCITY_THRESHOLD) &&
      info.offset.y < 0 &&
      absY > absX * 0.7
    ) {
      return 'up';
    }

    if (absX > SWIPE_THRESHOLD_X || velX > VELOCITY_THRESHOLD) {
      return info.offset.x > 0 ? 'right' : 'left';
    }

    return null;
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (!isTop || isExiting) return;
    const direction = determineDirection(info);
    if (direction) {
      setExitDirection(direction);
      if (navigator.vibrate) navigator.vibrate(50);

      requestAnimationFrame(() => {
        onSwipe(direction);
      });
    }
  }

  useEffect(() => {
    const currentRef = cardRef.current as SwipeCardElement | null;
    if (isTop && currentRef && !isExiting) {
      currentRef.__triggerSwipe = (dir: SwipeDirection) => {
        if (currentRef) delete currentRef.__triggerSwipe;
        flushSync(() => {
          setExitDirection(dir);
        });
        onSwipe(dir);
      };
    }
    return () => {
      if (currentRef) {
        delete currentRef.__triggerSwipe;
      }
    };
  }, [isTop, onSwipe, isExiting]);

  const cardVariants = useMemo(() => ({
    behind: { 
      scale: 0.95, 
      y: 10, 
      opacity: 1, 
      zIndex: 1,
      transition: { duration: 0.15 }
    },
    top: { 
      scale: 1, 
      y: 0, 
      opacity: 1, 
      zIndex: 2,
      transition: { type: 'spring' as const, stiffness: 300, damping: 35 }
    },
    exit: (direction: SwipeDirection | null) => {
      const transition = { duration: 0.25, ease: "easeOut" as const };
      if (!direction) return { opacity: 0, scale: 0.8, zIndex: 5, transition };
      switch (direction) {
        case 'right': return { x: EXIT_DISTANCE, rotate: 15, opacity: 0, zIndex: 5, transition };
        case 'left': return { x: -EXIT_DISTANCE, rotate: -15, opacity: 0, zIndex: 5, transition };
        case 'up': return { y: -EXIT_DISTANCE, opacity: 0, scale: 0.9, zIndex: 5, transition };
        default: return { opacity: 0, scale: 0.8, zIndex: 5, transition };
      }
    }
  }), []);

  return (
    <motion.div
      ref={cardRef}
      className={`swipe-card ${isTop ? 'swipe-card--top' : 'swipe-card--behind'} ${isExiting ? 'swipe-card--exiting' : ''}`}
      style={{ x, y, rotate }}
      drag={isTop && !isExiting}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial={false}
      animate={isTop ? "top" : "behind"}
      exit="exit"
      custom={exitDirection}
      data-movie-id={movie.id}
      whileTap={isTop && !isExiting ? { scale: 1.01 } : undefined}
    >
      <CardContent movie={movie} t={t} isExiting={isExiting} />

      {isTop && (
        <TopCardDecorations x={x} y={y} t={t} />
      )}
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';

