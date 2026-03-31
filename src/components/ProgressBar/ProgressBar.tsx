import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TOTAL_MOVIES } from '../../utils/constants';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
}

export const ProgressBar = memo(({ current }: ProgressBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="progress-bar">
      <div className="progress-bar__strip">
        <div className="progress-bar__sprockets" />

        <div className="progress-bar__track">
          <motion.div
            className="progress-bar__fill"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: current / TOTAL_MOVIES }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{ width: '100%' }}
          />
        </div>

        <div className="progress-bar__sprockets" />
      </div>
      <span className="progress-bar__text">
        {t('app.progress', { current, total: TOTAL_MOVIES })}
      </span>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

