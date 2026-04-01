import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SwipeDirection } from '../../types';
import { IconBtnLeave, IconBtnUnknown, IconBtnLove } from '../Icons/Icons';
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
          <IconBtnLeave />
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
          <IconBtnUnknown />
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
          <IconBtnLove />
        </motion.button>
        {labels && <span className="action-item__label action-item__label--love">{labels.right}</span>}
      </div>

    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
