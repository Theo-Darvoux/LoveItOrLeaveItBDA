import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CinemaProfile, GameStats } from '../../types';
import {
  IconHeart,
  IconBrokenHeart,
  IconQuestion,
  IconAction,
  IconSmile,
  IconSkull,
  IconRomanceHeart,
  IconMovie,
  IconStar,
  IconLightning,
  IconCompass,
} from '../Icons/Icons';
import './ProfileResult.css';

interface ProfileResultProps {
  profile: CinemaProfile;
  stats: GameStats;
  onRestart: () => void;
}

const ProfileIcons: Record<string, React.ReactNode> = {
  'action-hero': <IconAction />,
  'comedy-legend': <IconSmile />,
  'horror-master': <IconSkull />,
  'romance-dreamer': <IconRomanceHeart />,
  'drama-critic': <IconMovie />,
  'animation-fan': <IconStar />,
  'thriller-addict': <IconLightning />,
  'sci-fi-pioneer': <IconCompass />,
  'epic-adventurer': <IconAction />,
  'dark-philosopher': <IconSkull />,
  'nostalgic-soul': <IconStar />,
  'tension-expert': <IconLightning />,
  'cosmic-explorer': <IconCompass />,
  'feel-good-guru': <IconSmile />,
  'humanist-spirit': <IconRomanceHeart />,
  'chaos-connoisseur': <IconAction />,
};

export function ProfileResult({ profile, stats, onRestart }: ProfileResultProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const [serialNumber] = useState(() => 
    Math.floor(Math.random() * 999999).toString().padStart(6, '0')
  );

  return (
    <div className="profile-result">
      <motion.div
        ref={cardRef}
        className="profile-card"
        style={{ '--profile-color': profile.color } as React.CSSProperties}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* ... existing card content ... */}
        <div className="profile-card__header">
          <motion.div
            className="profile-card__icon-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            {ProfileIcons[profile.id] || ProfileIcons['indie-connoisseur']}
          </motion.div>
          <div className="profile-card__title-group">
            <span className="profile-card__badge">{t('app.result.yourProfile')}</span>
            <h2 className="profile-card__title">{t(profile.titleKey)}</h2>
          </div>
        </div>

        <p className="profile-card__description">"{t(profile.descriptionKey)}"</p>

        <div className="profile-card__main-content">
          <div className="profile-card__stats">
            <div className="profile-card__stat">
              <div className="profile-card__stat-icon-wrap"><IconHeart /></div>
              <span className="profile-card__stat-value">{stats.totalLoved}</span>
              <span className="profile-card__stat-label">{t('app.result.loved')}</span>
            </div>
            <div className="profile-card__stat">
              <div className="profile-card__stat-icon-wrap"><IconBrokenHeart /></div>
              <span className="profile-card__stat-value">{stats.totalLeft}</span>
              <span className="profile-card__stat-label">{t('app.result.left')}</span>
            </div>
            <div className="profile-card__stat">
              <div className="profile-card__stat-icon-wrap"><IconQuestion /></div>
              <span className="profile-card__stat-value">{stats.totalUnknown}</span>
              <span className="profile-card__stat-label">{t('app.result.unknown')}</span>
            </div>
          </div>

          <div className="profile-card__genres">
            <div className="profile-card__genre-bars">
              {stats.topGenres.map((gs, i) => (
                <div key={gs.genre} className="profile-card__genre-bar">
                  <span className="profile-card__genre-name">{t(`genres.${gs.genre}`)}</span>
                  <div className="profile-card__genre-track">
                    <motion.div
                      className="profile-card__genre-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, gs.score * 100)}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: "circOut" }}
                      style={{ background: profile.color, height: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-card__footer">
          <div className="profile-card__brand">
            <img src="/static/bda.webp" alt="BDA Logo" className="footer-logo" />
            LOVE IT OR LEAVE IT
          </div>
          <div className="profile-card__serial">№ {serialNumber}</div>
        </div>
      </motion.div>

      <motion.div
        className="profile-result__actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="welcome-screen__start-btn profile-result__ticket-btn"
          onClick={onRestart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <span className="ticket-decoration ticket-decoration--left">№ {serialNumber}</span>
          <span className="btn-text">{t('app.playAgain')}</span>
          <span className="ticket-decoration ticket-decoration--right">ADMIT ONE</span>
          <div className="btn-shine" />
        </motion.button>
      </motion.div>
    </div>
  );
}
