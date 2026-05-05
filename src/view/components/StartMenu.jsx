import { GAME_COPY } from '../../data/gameCopy.js';

export function StartMenu({ hidden, onStart }) {
  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F9FA]/90 backdrop-blur-sm ${hidden ? 'hidden' : ''}`}>
      <h1 className="mb-4 text-5xl font-black tracking-tighter text-gray-800" style={{ textShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
        NEON <span className="text-[#A8E6CF]">ANGEL</span>
      </h1>
      <p className="mb-8 max-w-xs text-center text-sm font-bold text-gray-500">
        {GAME_COPY.subtitle.split('。').filter(Boolean).map((line) => (
          <span key={line}>
            {line}。
            <br />
          </span>
        ))}
      </p>
      <button
        type="button"
        className="btn-glass rounded-full px-10 py-4 text-xl font-bold tracking-wide text-gray-700 hover:bg-white"
        onClick={onStart}
      >
        开始游戏
      </button>
    </div>
  );
}