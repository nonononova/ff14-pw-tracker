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

const ROLE_COLORS: Record<Role, { bg: string; text: string; darkBg: string }> = {
  tank: { bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'bg-blue-950/40' },
  healer: { bg: 'bg-emerald-50', text: 'text-emerald-600', darkBg: 'bg-emerald-950/40' },
  melee: { bg: 'bg-red-50', text: 'text-red-600', darkBg: 'bg-red-950/40' },
  ranged: { bg: 'bg-amber-50', text: 'text-amber-600', darkBg: 'bg-amber-950/40' },
  caster: { bg: 'bg-purple-50', text: 'text-purple-600', darkBg: 'bg-purple-950/40' },
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

  // 📱 コンパクト表示（1行のリスト形式）
  if (isCompact) {
    return (
      <div
        className={`flex items-center justify-between p-2.5 px-3.5 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700/80'
            : 'bg-white border-slate-100 shadow-sm'
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
          <span className={`text-xs font-black tracking-wider px-2 py-0.5 rounded-lg ${roleStyle.bg} ${roleStyle.text}`}>
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

  // 🎴 標準カード表示
  return (
    <div
      className={`p-4 rounded-3xl border transition-all duration-200 relative group shadow-sm hover:shadow-md ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700/80'
          : 'bg-white border-slate-100'
      } ${isPinned ? 'ring-2 ring-pink-400/50' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-xl ${roleStyle.bg} ${roleStyle.text}`}>
            {jobCode}
          </span>
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            {jobName}
          </h3>
        </div>

        <button
          onClick={onTogglePin}
          className={`text-sm transition-all active:scale-75 ${
            isPinned ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-100'
          }`}
          title="メインジョブにピン留め"
        >
          📌
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">進捗フェーズ</span>
          <span className="font-extrabold text-pink-500">
            {phase === 4 ? '完成！' : `Phase ${phase}`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {[0, 1, 2, 3, 4].map((p) => (
            <button
              key={p}
              onClick={() => onPhaseChange(p)}
              className={`py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
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
    </div>
  );
};