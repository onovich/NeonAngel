export function GameOverMenu({ hidden, finalScore, onRestart }) {
  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F9FA]/90 backdrop-blur-sm ${hidden ? 'hidden' : ''}`}>
      <h1 className="mb-2 text-5xl font-black tracking-tighter text-[#FFADAD]">GAME OVER</h1>
      <p className="mb-8 text-lg font-bold text-gray-500">
        最终得分: <span className="text-gray-800">{finalScore}</span>
      </p>
      <button
        type="button"
        className="btn-glass rounded-full px-10 py-4 text-xl font-bold tracking-wide text-gray-700 hover:bg-white"
        onClick={onRestart}
      >
        重新开始
      </button>
    </div>
  );
}