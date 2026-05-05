export function Hud({ hp, maxHp, score, energy, onUseUltimate }) {
  const hpRatio = Math.max(0, (hp / maxHp) * 100);
  const fullSlots = Math.floor(energy / 100);
  const hpClassName = hp >= maxHp
    ? 'bg-[#FDFFB6]'
    : hp < maxHp * 0.3
      ? 'bg-[#FFADAD]'
      : 'bg-[#A8E6CF]';

  return (
    <div id="ui-layer" className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
      <div className="flex items-start justify-between pointer-events-auto">
        <div className="min-w-[150px] rounded-2xl bg-white/80 p-3 backdrop-blur-md hud-shadow">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">HP</div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full transition-all duration-200 ${hpClassName}`} style={{ width: `${hpRatio}%` }} />
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Score: <span className="text-lg text-gray-700">{score}</span>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl bg-white/80 p-3 backdrop-blur-md hud-shadow">
          {[0, 1, 2].map((slotIndex) => (
            <div
              key={slotIndex}
              className={`energy-slot h-8 w-8 rounded-full ${slotIndex < fullSlots ? 'energy-filled' : 'bg-gray-100'}`}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-auto flex justify-end pb-4 pr-4">
        <button
          id="btn-ult"
          type="button"
          onClick={onUseUltimate}
          onTouchStart={(event) => {
            event.preventDefault();
            onUseUltimate();
          }}
          className={`btn-glass flex h-20 w-20 flex-col items-center justify-center rounded-full font-black text-[#9BF6FF] transition-opacity ${fullSlots > 0 ? 'opacity-100 animate-pulse' : 'opacity-50'}`}
        >
          <svg className="mb-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L22 20H2L12 2Z" />
          </svg>
          <span className="text-xs text-gray-500">大招</span>
        </button>
      </div>
    </div>
  );
}