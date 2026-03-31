import { motion } from 'framer-motion';
import { ProfileResult } from '../components/ProfileResult/ProfileResult';
import { CinemaProfile, GameStats } from '../types';
import './screens.css';

interface ResultScreenProps {
  profile: CinemaProfile;
  stats: GameStats;
  onRestart: () => void;
  playSound: (name: string) => void;
}

export function ResultScreen({ profile, stats, onRestart, playSound }: ResultScreenProps) {
  playSound('result');

  return (
    <motion.div
      className="screen result-screen"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProfileResult
        profile={profile}
        stats={stats}
        onRestart={onRestart}
      />
    </motion.div>
  );
}
