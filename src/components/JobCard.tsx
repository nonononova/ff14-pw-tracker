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
  tank: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', darkBg: 'bg-blue-950/50 border-blue-900/50' },
  healer: { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600', darkBg: 'bg-emerald-950/50 border-emerald-900/50' },
  melee: { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600', darkBg: 'bg-rose-950/50 border-rose-900/50' },
  ranged: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', darkBg: 'bg-amber-950/50 border-amber-900/50' },
  caster: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600', darkBg: 'bg-purple-950/50 border-purple-900/50' },
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
            title="メインにピン留め"
          >
            📌
          </button>
          <span
            className={`text-[11px] font-black tracking-wider px-2 py-0.5 rounded-lg border ${
              isDarkMode ? `${roleStyle.darkBg} ${roleStyle.text}` : `${roleStyle.bg} ${roleStyle.text}`
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

  // 🎴 標準カード表示（デザイン復活＆洗練）
  const tokensLeft = phase === 4 ? 0 : (4 - phase) * 1500;

  return (
    <div
      className={`p-4 rounded-3xl border transition-all duration-200 relative group shadow-sm hover:shadow-md flex flex-col justify-between ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700/80 hover:border-slate-600'
          : 'bg-white border-slate-100 hover:border-pink-100'
      } ${isPinned ? 'ring-2 ring-pink-400/50' : ''}`}
    >
      <div>
        {/* ヘッダー: ロールバッジ・ジョブ名・ピン留め */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-xl border ${
                isDarkMode ? `${roleStyle.darkBg} ${roleStyle.text}` : `${roleStyle.bg} ${roleStyle.text}`
              }`}
            >
              {jobCode}
            </span>
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {jobName}
            </h3>
          </div>

          <button
            onClick={onTogglePin}
            className={`text-sm p-1 rounded-lg transition-all active:scale-75 ${
              isPinned
                ? 'opacity-100 scale-110'
                : 'opacity-25 hover:opacity-80'
            }`}
            title="メインジョブにピン留め"
          >
            📌
          </button>
        </div>

        {/* サブ情報: 進捗フェーズ ＆ 残り数理 */}
        <div className="flex items-center justify-between text-xs mb-3 px-0.5">
          <span className="text-slate-400 font-medium">
            {phase === 4 ? (
              <span className="text-emerald-500 font-bold">✨ 完成済み</span>
            ) : (
              <span>Phase <strong className="text-pink-500 font-extrabold">{phase}</strong> / 4</span>
            )}
          </span>
          <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            {phase === 4 ? '完了' : `残り ${tokensLeft.toLocaleString()} 数理`}
          </span>
        </div>
      </div>

      {/* フェーズ切り替えボタン */}
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {[0, 1, 2, 3, 4].map((p) => (
          <button
            key={p}
            onClick={() => onPhaseChange(p)}
            className={`py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center ${
              phase === p
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm ring-2 ring-pink-300/40'
                : isDarkMode
                ? 'bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
          >
            {p === 4 ? '✨' : p}
          </button>
        ))}
      </div>
    </div>
  );
};