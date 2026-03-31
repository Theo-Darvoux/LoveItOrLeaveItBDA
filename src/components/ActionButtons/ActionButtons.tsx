import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SwipeDirection } from '../../types';
import './ActionButtons.css';

interface ActionButtonsProps {
  onAction: (direction: SwipeDirection) => void;
  labels?: { left: string; up: string; right: string };
  disabled?: boolean;
}

export const ActionButtons = memo(({ onAction, labels, disabled }: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className={`action-buttons ${disabled ? 'action-buttons--disabled' : ''}`}>
      <div className="action-item">
        <motion.button
          className="action-btn action-btn--leave"
          onClick={() => !disabled && onAction('left')}
          whileTap={!disabled ? { scale: 0.88 } : {}}
          whileHover={!disabled ? { scale: 1.08 } : {}}
          aria-label={t('swipe.leave')}
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="btn-leave-grad" x1="18" y1="6" x2="6" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff80a0" />
                <stop offset="100%" stopColor="#ff1a3d" />
              </linearGradient>
            </defs>
            <line x1="18" y1="6" x2="6" y2="18" stroke="url(#btn-leave-grad)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="url(#btn-leave-grad)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.button>
        {labels && <span className="action-item__label action-item__label--leave">{labels.left}</span>}
      </div>

      <div className="action-item action-item--unknown">
        <motion.button
          className="action-btn action-btn--unknown"
          onClick={() => !disabled && onAction('up')}
          whileTap={!disabled ? { scale: 0.88 } : {}}
          whileHover={!disabled ? { scale: 1.08 } : {}}
          aria-label={t('swipe.unknown')}
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="btn-unknown-grad" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#80c4ff" />
                <stop offset="100%" stopColor="#0077ff" />
              </linearGradient>
            </defs>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="url(#btn-unknown-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17.5" r="1" fill="url(#btn-unknown-grad)" />
          </svg>
        </motion.button>
        {labels && <span className="action-item__label action-item__label--unknown">{labels.up}</span>}
      </div>

      <div className="action-item">
        <motion.button
          className="action-btn action-btn--love"
          onClick={() => !disabled && onAction('right')}
          whileTap={!disabled ? { scale: 0.88 } : {}}
          whileHover={!disabled ? { scale: 1.08 } : {}}
          aria-label={t('swipe.love')}
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="btn-love-grad" x1="12" y1="4" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE84D" />
                <stop offset="100%" stopColor="#FFB300" />
              </linearGradient>
            </defs>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="url(#btn-love-grad)" />
          </svg>
        </motion.button>
        {labels && <span className="action-item__label action-item__label--love">{labels.right}</span>}
      </div>

    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

