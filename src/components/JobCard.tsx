import React from 'react';

export type Role = 'tank' | 'healer' | 'melee' | 'ranged' | 'caster';

interface JobCardProps {
  jobCode: string;
  jobName: string;
  role: Role;
  phase: number;
  isPinned: boolean;
  isDarkMode: boolean;
  isCompact?: boolean;
  onPhaseChange: (phase: number) => void;
  onTogglePin: () => void;
}

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string; darkBg: string }> = {
  tank: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', darkBg: 'bg-blue-950/40' },
  healer: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', darkBg: 'bg-emerald-950/40' },
  melee: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', darkBg: 'bg-rose-950/40' },
  ranged: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', darkBg: 'bg-amber-950/40' },
  caster: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', darkBg: 'bg-purple-950/40' },
};

export const JobCard: React.FC<JobCardProps> = ({
  jobCode,
  jobName,
  role,
  phase,
  isPinned,
  isDarkMode,
  isCompact = false,
  onPhaseChange,
  onTogglePin,
}) => {
  const roleStyle = ROLE_COLORS[role];
  const tokensLeft = phase === 4 ? 0 : (4 - phase) * 1500;
  const progressPercent = (phase / 4) * 100;

  // 📱 リスト表示（1行のスリム形式）
  if (isCompact) {
    return (
      <div
        className={`flex items-center justify-between p-2.5 px-3.5 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
            : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
        } ${isPinned ? 'ring-2 ring-pink-400/50' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onTogglePin}
            className={`text-xs transition-transform active:scale-75 ${
              isPinned ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-100'
            }`}
          >
            📌
          </button>
          <span
            className={`text-[11px] font-black tracking-wider px-2 py-0.5 rounded-lg border ${
              isDarkMode ? `${roleStyle.darkBg} ${roleStyle.text} border-slate-700` : `${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`
            }`}
          >
            {jobCode}
          </span>
          <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {jobName}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[0, 1, 2, 3, 4].map((p) => (
            <button
              key={p}
              onClick={() => onPhaseChange(p)}
              className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all active:scale-95 ${
                phase === p
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-slate-700/60 text-slate-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {p === 4 ? '✨' : p}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 🎴 本格カード表示（デザイン完全復活）
  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative group shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700/80'
          : 'bg-white border-slate-100'
      } ${isPinned ? 'ring-2 ring-pink-400/60' : ''}`}
    >
      {/* 上段：ロールバッジ + ジョブ名 + ピン留め */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-xl border ${
              isDarkMode
                ? `${roleStyle.darkBg} ${roleStyle.text} border-slate-700`
                : `${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`
            }`}
          >
            {jobCode}
          </span>
          <h3 className={`font-bold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            {jobName}
          </h3>
        </div>

        <button
          onClick={onTogglePin}
          className={`text-base transition-all active:scale-75 ${
            isPinned ? 'opacity-100 scale-110' : 'opacity-25 hover:opacity-100'
          }`}
          title="メインジョブにピン留め"
        >
          📌
        </button>
      </div>

      {/* 中段：進捗テキスト + カード内プログレスバー */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className={phase === 4 ? 'text-emerald-500' : 'text-slate-400'}>
            {phase === 4 ? '✨ 完成！' : `Phase ${phase} / 4`}
          </span>
          <span className="text-pink-500">
            {phase === 4 ? '完了' : `残り ${tokensLeft.toLocaleString()} 数理`}
          </span>
        </div>

        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 下段：フェーズ選択ボタン */}
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {[0, 1, 2, 3, 4].map((p) => (
          <button
            key={p}
            onClick={() => onPhaseChange(p)}
            className={`py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
              phase === p
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md ring-2 ring-pink-300/30'
                : isDarkMode
                ? 'bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            {p === 4 ? '✨' : p}
          </button>
        ))}
      </div>
    </div>
  );
};