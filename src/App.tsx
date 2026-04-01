import { AnimatePresence } from 'framer-motion';
import { CinemaBackground } from './components/Layout/CinemaBackground';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';
import { ImagePreloader } from './components/ImagePreloader';

function App() {
  const { state, currentMovie, nextMovie, startGame, swipe, finish, restart, toggleSound } = useGameState();
  const { play } = useSound(state.soundEnabled);

  const handleStart = () => {
    play('clap');
    startGame();
  };

  return (
    <div className="app">
      <ImagePreloader />
      <CinemaBackground />
      <AnimatePresence mode="wait">
        {state.screen === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            onStart={handleStart}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            playSound={play}
          />
        )}
        {state.screen === 'game' && (
          <GameScreen
            key="game"
            currentMovie={currentMovie}
            nextMovie={nextMovie}
            currentIndex={state.currentIndex}
            isFinished={state.isFinished}
            onSwipe={swipe}
            onFinish={finish}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            playSound={play}
          />
        )}
        {state.screen === 'result' && state.profile && state.stats && (
          <ResultScreen
            key="result"
            profile={state.profile}
            stats={state.stats}
            onRestart={restart}
            playSound={play}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
