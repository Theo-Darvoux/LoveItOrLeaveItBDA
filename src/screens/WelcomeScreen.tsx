import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GlTitle } from '../components/GlTitle';
import { TOTAL_MOVIES } from '../utils/constants';
import './screens.css';

interface WelcomeScreenProps {
  onStart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playSound: (name: string) => void;
}

export function WelcomeScreen({ onStart, soundEnabled, onToggleSound, playSound }: WelcomeScreenProps) {
  const { t, i18n } = useTranslation();
  const [showTutorial, setShowTutorial] = useState(false);
  const [direction, setDirection] = useState(1);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  const handleShowTutorial = () => {
    playSound('clap');
    setDirection(1);
    setShowTutorial(true);
  };

  const handleBack = () => {
    playSound('clap');
    setDirection(-1);
    setShowTutorial(false);
  };

  const variants = {
    initial: (direction: number) => ({
      opacity: 0,
      y: direction > 0 ? 40 : -40,
      scale: direction > 0 ? 1.05 : 0.95,
    }),
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: direction > 0 ? -40 : 40,
      scale: direction > 0 ? 0.95 : 1.05,
    }),
  };

  return (
    <motion.div
      className="screen welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.5,
        filter: 'blur(20px)',
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Top controls */}
      <div className="welcome-screen__controls">
        <button className="control-btn" onClick={onToggleSound} aria-label={soundEnabled ? t('app.soundOn') : t('app.soundOff')}>
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
          <div className="control-btn-shine" />
        </button>
        <button className="control-btn lang-toggle" onClick={toggleLanguage}>
          {i18n.language === 'fr' ? 'EN' : 'FR'}
          <div className="control-btn-shine" />
        </button>
      </div>

      {/* Main content */}
      <div className="welcome-screen__content">
        <AnimatePresence mode="wait" custom={direction}>
          {!showTutorial ? (
            <motion.div
              key="main"
              className="welcome-screen__main-view"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="welcome-screen__decor-line" />

              <div className="welcome-screen__title-container">
                <GlTitle />
              </div>

              <div className="subtitle-container">
                <div className="subtitle-line" />
                <p className="welcome-screen__subtitle">{t('app.subtitle')}</p>
                <div className="subtitle-line" />
              </div>

              <div className="welcome-screen__info-group">
                <div className="welcome-screen__separator" />
                <p className="welcome-screen__count">{t('app.tutorial.count', { count: TOTAL_MOVIES })}</p>
              </div>

              <motion.button
                className="welcome-screen__start-btn"
                onClick={handleShowTutorial}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <span className="ticket-decoration ticket-decoration--left">№ 081524</span>
                <span className="btn-text">{t('app.start')}</span>
                <span className="ticket-decoration ticket-decoration--right">ADMIT ONE</span>
                <div className="btn-shine" />
              </motion.button>

              <motion.p 
                className="welcome-screen__credit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                {t('app.credit', { name: 'THÉO DARVOUX' }).split('THÉO DARVOUX')[0]}
                <span>Théo DARVOUX</span>
                {t('app.credit', { name: 'THÉO DARVOUX' }).split('THÉO DARVOUX')[1]}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="tutorial"
              className="tutorial"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="tutorial__header">
                <motion.div 
                  className="welcome-screen__decor-line"
                  initial={{ width: 0 }}
                  animate={{ width: 180 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
                <h2 className="tutorial__title">{t('app.tutorial.title') || 'HOW TO PLAY'}</h2>
              </div>

              <div className="tutorial__body">
                <div className="tutorial__instructions">
                  <div className="tutorial__item tutorial__item--leave">
                    <div className="tutorial__arrow-container">
                      <svg className="tutorial__arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="arrow-leave" x1="20" y1="12" x2="4" y2="12" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#ff4d6d"/>
                          </linearGradient>
                          <filter id="glow-leave" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="url(#arrow-leave)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-leave)"/>
                      </svg>
                    </div>
                    <div className="tutorial__text-group">
                      <span className="tutorial__label">{t('app.tutorial.labelLeave')}</span>
                      <div className="tutorial__text">{t('app.tutorial.swipeLeft')}</div>
                    </div>
                  </div>

                  <div className="tutorial__item tutorial__item--unknown">
                    <div className="tutorial__arrow-container">
                      <svg className="tutorial__arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="arrow-unknown" x1="12" y1="19" x2="12" y2="5" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#4da6ff" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#4da6ff"/>
                          </linearGradient>
                          <filter id="glow-unknown" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="url(#arrow-unknown)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-unknown)"/>
                      </svg>
                    </div>
                    <div className="tutorial__text-group">
                      <span className="tutorial__label">{t('app.tutorial.labelUnknown')}</span>
                      <div className="tutorial__text">{t('app.tutorial.swipeUp')}</div>
                    </div>
                  </div>

                  <div className="tutorial__item tutorial__item--love">
                    <div className="tutorial__arrow-container">
                      <svg className="tutorial__arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="arrow-love" x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#FFD700"/>
                          </linearGradient>
                          <filter id="glow-love" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="url(#arrow-love)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-love)"/>
                      </svg>
                    </div>
                    <div className="tutorial__text-group">
                      <span className="tutorial__label">{t('app.tutorial.labelLove')}</span>
                      <div className="tutorial__text">{t('app.tutorial.swipeRight')}</div>
                    </div>
                  </div>
                </div>

                <div className="tutorial__footer">
                  <p className="tutorial__or">{t('app.tutorial.or')}</p>

                  <motion.button
                    className="welcome-screen__start-btn"
                    onClick={onStart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="ticket-decoration ticket-decoration--left">№ 081524</span>
                    <span className="btn-text">{t('app.tutorial.ready')}</span>
                    <span className="ticket-decoration ticket-decoration--right">ADMIT ONE</span>
                    <div className="btn-shine" />
                  </motion.button>

                  <button 
                    className="tutorial__back-btn" 
                    onClick={handleBack}
                  >
                    {t('app.tutorial.back')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
