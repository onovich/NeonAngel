import { useEffect, useRef, useState } from 'react';
import { INITIAL_SNAPSHOT } from '../../data/gameConfig.js';
import { createGameEngine } from '../engine/gameEngine.js';

export function useGameRuntime() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [snapshot, setSnapshot] = useState(INITIAL_SNAPSHOT);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) {
      return undefined;
    }

    const engine = createGameEngine({
      canvas: canvasRef.current,
      container: containerRef.current,
      onSnapshot: setSnapshot,
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return {
    canvasRef,
    containerRef,
    snapshot,
    startGame: () => engineRef.current?.startGame(),
    restartGame: () => engineRef.current?.startGame(),
    selectRewardOption: (index) => engineRef.current?.selectRewardOption(index),
    confirmRewardSelection: () => engineRef.current?.confirmRewardSelection(),
    useUltimate: () => engineRef.current?.useUltimate(),
  };
}