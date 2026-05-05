import { useGameRuntime } from '../../logic/hooks/useGameRuntime.js';
import { GameOverMenu } from '../components/GameOverMenu.jsx';
import { Hud } from '../components/Hud.jsx';
import { StartMenu } from '../components/StartMenu.jsx';

export function GameScreen() {
  const {
    canvasRef,
    containerRef,
    snapshot,
    startGame,
    restartGame,
    useUltimate,
  } = useGameRuntime();

  return (
    <div id="game-container" ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-[#F8F9FA]">
      <canvas ref={canvasRef} id="gameCanvas" />
      <Hud
        hp={snapshot.hp}
        maxHp={snapshot.maxHp}
        score={snapshot.score}
        energy={snapshot.energy}
        onUseUltimate={useUltimate}
      />
      <StartMenu hidden={snapshot.screen !== 'menu'} onStart={startGame} />
      <GameOverMenu hidden={snapshot.screen !== 'over'} finalScore={snapshot.finalScore} onRestart={restartGame} />
    </div>
  );
}