import React from 'react';

export type Role = 'tank' | 'healer' | 'melee' | 'ranged' | 'caster';

export interface JobCardProps {
  jobCode: string;
  jobName: string;
  role: Role;
  phase: number;
  isPinned: boolean;
  isDarkMode: boolean;
  onPhaseChange: (newPhase: number) => void;
  onTogglePin: () => void;
}

const ROLE_STYLES_LIGHT: Record<Role, { bg: string; text: string; border: string }> = {
  tank: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  healer: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  melee: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  ranged: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  caster: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
};

const ROLE_STYLES_DARK: Record<Role, { bg: string; text: string; border: string }> = {
  tank: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-800' },
  healer: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' },
  melee: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-800' },
  ranged: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' },
  caster: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' },
};

const PHASE_NAMES = ['未着手', '第1段階', '第2段階', '第3段階', '✨ 完成'];

export const JobCard: React.FC<JobCardProps> = ({
  jobCode,
  jobName,
  role,
  phase,
  isPinned,
  isDarkMode,
  onPhaseChange,
  onTogglePin,
}) => {
  const roleStyle = isDarkMode ? ROLE_STYLES_DARK[role] : ROLE_STYLES_LIGHT[role];
  const isCompleted = phase === 4;
  const remainingTokens = isCompleted ? 0 : (4 - phase) * 1500;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        isDarkMode
          ? isCompleted
            ? 'bg-gradient-to-br from-amber-950/40 via-slate-800 to-pink-950/30 border-amber-500/50 shadow-md shadow-amber-900/20'
            : isPinned
            ? 'bg-slate-800/90 border-pink-500/50 shadow-md shadow-pink-950/30'
            : 'bg-slate-800/80 border-slate-700/80 shadow-sm hover:border-pink-500/40'
          : isCompleted
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-pink-50/50 border-amber-300 shadow-md shadow-amber-100/50'
          : isPinned
          ? 'bg-pink-50/30 border-pink-300 shadow-sm shadow-pink-100'
          : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-pink-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePin}
            className={`text-xs p-1 rounded-lg transition-transform active:scale-95 ${
              isPinned
                ? 'opacity-100 scale-110'
                : 'opacity-30 hover:opacity-70 grayscale hover:grayscale-0'
            }`}
            title={isPinned ? 'ピン留め解除' : 'メイン育成にピン留め'}
          >
            📌
          </button>
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {jobCode}
          </span>
          <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {jobName}
          </span>
        </div>

        <div className={`text-xs font-semibold ${isCompleted ? 'text-amber-500 font-bold' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
          {isCompleted ? '🎉 Complete!' : `数理: ${remainingTokens.toLocaleString()}個`}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-400">進捗度</span>
          <span className={isCompleted ? 'text-amber-500 font-bold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
            {PHASE_NAMES[phase]}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((step) => {
            const active = phase >= step;
            return (
              <button
                key={step}
                onClick={() => onPhaseChange(phase === step ? step - 1 : step)}
                className={`h-2.5 rounded-full transition-all active:scale-95 ${
                  active
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 shadow-sm shadow-pink-200/50'
                    : isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title={`${PHASE_NAMES[step]}に変更`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          disabled={phase === 0}
          onClick={() => onPhaseChange(Math.max(0, phase - 1))}
          className={`flex-1 py-1.5 text-xs rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 ${
            isDarkMode
              ? 'bg-slate-700/80 border border-slate-600 text-slate-300 hover:bg-slate-700'
              : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          戻す
        </button>
        <button
          disabled={phase === 4}
          onClick={() => onPhaseChange(Math.min(4, phase + 1))}
          className="flex-1 py-1.5 text-xs font-bold rounded-xl border border-pink-200/30 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm hover:from-pink-600 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {phase === 0 ? 'スタート' : phase === 3 ? '完成させる' : '進める'}
        </button>
      </div>
    </div>
  );
};