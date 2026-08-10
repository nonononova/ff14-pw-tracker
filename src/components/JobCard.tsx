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

  // 🎴 1枚目のデザイン（「進捗度」「戻す」「スタート/次へ」ボタンUI）
  const getPhaseText = () => {
    if (phase === 0) return '未着手';
    if (phase === 4) return '完成！';
    return `Phase ${phase}`;
  };

  const getNextButtonText = () => {
    if (phase === 0) return 'スタート';
    if (phase === 4) return '完成✨';
    return '次へ';
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative group shadow-sm hover:shadow-md flex flex-col justify-between space-y-3.5 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700/80'
          : 'bg-white border-slate-100'
      } ${isPinned ? 'ring-2 ring-pink-400/60' : ''}`}
    >
      {/* 上段：ピン・ロールバッジ・ジョブ名 ＆ 右側：数理表示 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePin}
            className={`text-xs transition-all active:scale-75 ${
              isPinned ? 'opacity-100 scale-110' : 'opacity-25 hover:opacity-100'
            }`}
            title="メインジョブにピン留め"
          >
            📌
          </button>
          <span
            className={`text-[11px] font-black tracking-wider px-2.5 py-0.5 rounded-xl border ${
              isDarkMode
                ? `${roleStyle.darkBg} ${roleStyle.text} border-slate-700`
                : `${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`
            }`}
          >
            {jobCode}
          </span>
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            {jobName}
          </h3>
        </div>

        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
          数理: {tokensLeft.toLocaleString()}個
        </span>
      </div>

      {/* 中段：進捗度ラベル ＆ 4分割セグメントプログレスバー */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-400'}>進捗度</span>
          <span className={phase === 4 ? 'text-emerald-500 font-bold' : phase > 0 ? 'text-pink-500 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
            {getPhaseText()}
          </span>
        </div>

        {/* 4分割バー */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                phase >= segment
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 shadow-sm'
                  : isDarkMode
                  ? 'bg-slate-700/70'
                  : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 下段：「戻す」＆「スタート/次へ」ボタン */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* 戻すボタン */}
        <button
          onClick={() => onPhaseChange(phase - 1)}
          disabled={phase === 0}
          className={`py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
            phase === 0
              ? isDarkMode
                ? 'bg-slate-800/40 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
              : isDarkMode
              ? 'bg-slate-700/80 text-slate-200 border border-slate-600 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          戻す
        </button>

        {/* スタート / 次へ ボタン */}
        <button
          onClick={() => onPhaseChange(phase + 1)}
          disabled={phase === 4}
          className={`py-2 rounded-2xl text-xs font-bold transition-all ${
            phase === 4
              ? 'bg-emerald-500 text-white shadow-sm cursor-default opacity-90'
              : 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm hover:brightness-105 active:scale-95'
          }`}
        >
          {getNextButtonText()}
        </button>
      </div>
    </div>
  );
};