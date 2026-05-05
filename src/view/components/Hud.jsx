export function Hud({
  hp,
  maxHp,
  score,
  level,
  xp,
  nextLevelXp,
  energy,
  weaponName,
  weaponLevel,
  weaponToast,
  rewardOptions,
  rewardSelection,
  onRewardSelect,
  onRewardConfirm,
  onUseUltimate,
}) {
  const hpRatio = Math.max(0, (hp / maxHp) * 100);
  const xpRatio = nextLevelXp > 0 ? Math.max(0, Math.min(100, (xp / nextLevelXp) * 100)) : 0;
  const fullSlots = Math.floor(energy / 100);
  const hpClassName = hp >= maxHp
    ? 'bg-[#FDFFB6]'
    : hp < maxHp * 0.3
      ? 'bg-[#FFADAD]'
      : 'bg-[#A8E6CF]';

  return (
    <div id="ui-layer" className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
      {weaponToast ? (
        <div className="weapon-toast absolute left-1/2 top-24 -translate-x-1/2 rounded-full border border-white/60 bg-white/80 px-5 py-3 text-center backdrop-blur-md hud-shadow">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9A8C98]">{weaponToast.title}</div>
          <div className="mt-1 text-sm font-bold text-gray-700">{weaponToast.detail}</div>
        </div>
      ) : null}

      {rewardOptions ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#F8F9FA]/70 backdrop-blur-sm pointer-events-auto">
          <div className="w-[min(92vw,42rem)] rounded-[2rem] border border-white/60 bg-white/85 p-5 hud-shadow">
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#9A8C98]">Level Up</div>
              <div className="mt-2 text-xl font-black text-gray-800">Choose one upgrade</div>
              <div className="mt-1 text-sm font-bold text-gray-500">Keyboard: `1` / `2`, `Q` / `E`, `Enter`</div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {rewardOptions.map((option, index) => (
                <button
                  key={`${option.weaponId}-${option.kind}`}
                  type="button"
                  onClick={() => onRewardSelect(index)}
                  onTouchStart={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRewardSelect(index);
                  }}
                  onDoubleClick={onRewardConfirm}
                  className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${rewardSelection === index ? 'border-[#9BF6FF] bg-[#9BF6FF]/15 shadow-[0_0_0_4px_rgba(155,246,255,0.18)]' : 'border-white/60 bg-white/70 hover:bg-white'}`}
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#9A8C98]">Option {index + 1}</div>
                  <div className="mt-2 text-lg font-black text-gray-800">{option.title}</div>
                  <div className="mt-2 text-sm font-bold leading-6 text-gray-500">{option.detail}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onRewardConfirm}
                onTouchStart={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRewardConfirm();
                }}
                className="btn-glass rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.2em] text-gray-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-start justify-between pointer-events-auto">
        <div className="min-w-[150px] rounded-2xl bg-white/80 p-3 backdrop-blur-md hud-shadow">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">HP</div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full transition-all duration-200 ${hpClassName}`} style={{ width: `${hpRatio}%` }} />
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Score: <span className="text-lg text-gray-700">{score}</span>
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Lv: <span className="text-sm text-gray-700">{level}</span>
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">EXP</div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full bg-[#5D8BFF] transition-all duration-200" style={{ width: `${xpRatio}%` }} />
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Weapon: <span className="text-sm text-gray-700">{weaponName} Lv.{weaponLevel}</span>
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