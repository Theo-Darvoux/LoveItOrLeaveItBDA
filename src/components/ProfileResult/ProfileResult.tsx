import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CinemaProfile, GameStats } from '../../types';
import './ProfileResult.css';

interface ProfileResultProps {
  profile: CinemaProfile;
  stats: GameStats;
  onRestart: () => void;
}

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconBrokenHeart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-0.5, 0)">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L11 8l2 3-2 3Z" />
    </g>
    <g transform="translate(0.5, 0)">
      <path d="M16.5 3c1.74 0 3.41.81 4.5 2.09C22.09 6.38 22 8.5 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35l-1-7.35 2-3-2-3 1-2.91Z" />
    </g>
  </svg>
);

const IconQuestion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ProfileIcons: Record<string, React.ReactNode> = {
  'action-hero': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 21h22L12 2zm0 3.45l7.75 13.55H4.25L12 5.45zM11 15h2v2h-2v-2zm0-6h2v4h-2V9z" />
    </svg>
  ),
  'comedy-legend': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  'horror-master': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a7 7 0 0 0-7 7c0 3.57 2.11 6.38 3.32 7.63.1.1.18.21.18.37v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-.16.08-.27.18-.37C13.89 15.38 16 12.57 16 9a7 7 0 0 0-7-7zm-2 16h4v1h-4v-1zm0 2h4v1h-4v-1z" />
    </svg>
  ),
  'romance-dreamer': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  'drama-critic': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    </svg>
  ),
  'animation-fan': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  'thriller-addict': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  ),
  'sci-fi-pioneer': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-7.5-7.5-7.5 1.4-1.4 8.9 8.9-8.9 8.9-1.4-1.4z" />
    </svg>
  ),
  'epic-adventurer': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 21h22L12 2zm0 3.45l7.75 13.55H4.25L12 5.45zM11 15h2v2h-2v-2zm0-6h2v4h-2V9z" />
    </svg>
  ),
  'dark-philosopher': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a7 7 0 0 0-7 7c0 3.57 2.11 6.38 3.32 7.63.1.1.18.21.18.37v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-.16.08-.27.18-.37C13.89 15.38 16 12.57 16 9a7 7 0 0 0-7-7zm-2 16h4v1h-4v-1zm0 2h4v1h-4v-1z" />
    </svg>
  ),
  'nostalgic-soul': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  'tension-expert': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  ),
  'cosmic-explorer': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-7.5-7.5-7.5 1.4-1.4 8.9 8.9-8.9 8.9-1.4-1.4z" />
    </svg>
  ),
  'feel-good-guru': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  'humanist-spirit': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  'chaos-connoisseur': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 21h22L12 2zm0 3.45l7.75 13.55H4.25L12 5.45zM11 15h2v2h-2v-2zm0-6h2v4h-2V9z" />
    </svg>
  ),
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
              {stats.topGenres.map((genre, i) => (
                <div key={genre} className="profile-card__genre-bar">
                  <span className="profile-card__genre-name">{t(`genres.${genre}`)}</span>
                  <div className="profile-card__genre-track">
                    <motion.div
                      className="profile-card__genre-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - i * 20}%` }}
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
