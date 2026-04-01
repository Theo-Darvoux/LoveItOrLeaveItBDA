import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSoundOn, IconSoundOff } from '../Icons/Icons';

interface SoundToggleButtonProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  className?: string;
}

export function SoundToggleButton({ soundEnabled, onToggleSound, className = '' }: SoundToggleButtonProps) {
  const { t } = useTranslation();
  
  return (
    <button 
      className={`control-btn ${className}`.trim()} 
      onClick={onToggleSound} 
      aria-label={soundEnabled ? t('app.soundOn') : t('app.soundOff')}
    >
      {soundEnabled ? <IconSoundOn /> : <IconSoundOff />}
      <div className="control-btn-shine" />
    </button>
  );
}
