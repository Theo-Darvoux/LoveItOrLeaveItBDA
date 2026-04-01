import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GlTitle } from '../components/GlTitle';
import { SoundToggleButton } from '../components/SoundToggleButton/SoundToggleButton';
import { IconArrowLeft, IconArrowUp, IconArrowRight } from '../components/Icons/Icons';
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
      <div className="welcome-screen__controls">
        <div className="org-logo">
          <img src="/static/bda.webp" alt="BDA Logo" />
        </div>
        <SoundToggleButton soundEnabled={soundEnabled} onToggleSound={onToggleSound} />
        <button className="control-btn lang-toggle" onClick={toggleLanguage}>
          {i18n.language === 'fr' ? 'EN' : 'FR'}
          <div className="control-btn-shine" />
        </button>
      </div>

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
                      <IconArrowLeft className="tutorial__arrow-svg" />
                    </div>
                    <div className="tutorial__text-group">
                      <span className="tutorial__label">{t('app.tutorial.labelLeave')}</span>
                      <div className="tutorial__text">{t('app.tutorial.swipeLeft')}</div>
                    </div>
                  </div>

                  <div className="tutorial__item tutorial__item--unknown">
                    <div className="tutorial__arrow-container">
                      <IconArrowUp className="tutorial__arrow-svg" />
                    </div>
                    <div className="tutorial__text-group">
                      <span className="tutorial__label">{t('app.tutorial.labelUnknown')}</span>
                      <div className="tutorial__text">{t('app.tutorial.swipeUp')}</div>
                    </div>
                  </div>

                  <div className="tutorial__item tutorial__item--love">
                    <div className="tutorial__arrow-container">
                      <IconArrowRight className="tutorial__arrow-svg" />
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
