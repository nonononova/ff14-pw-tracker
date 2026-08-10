import React from 'react';

export type Role = 'tank' | 'healer' | 'melee' | 'ranged' | 'caster';

export interface JobCardProps {
  jobCode: string;
  jobName: string;
  role: Role;
  phase: number;
  onPhaseChange: (newPhase: number) => void;
}

const ROLE_STYLES: Record<Role, { bg: string; text: string; border: string }> = {
  tank: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  healer: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  melee: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  ranged: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  caster: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
};

const PHASE_NAMES = ['未着手', '第1段階', '第2段階', '第3段階', '✨ 完成'];

export const JobCard: React.FC<JobCardProps> = ({
  jobCode,
  jobName,
  role,
  phase,
  onPhaseChange,
}) => {
  const roleStyle = ROLE_STYLES[role];
  const isCompleted = phase === 4;
  const remainingTokens = isCompleted ? 0 : (4 - phase) * 1500;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        isCompleted
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-pink-50/50 border-amber-300 shadow-md shadow-amber-100/50'
          : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-pink-200'
      }`}
    >
      {/* 上段：ジョブ名と必要数理を横並びに配置 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {jobCode}
          </span>
          <span className="font-bold text-slate-700 text-sm">{jobName}</span>
        </div>

        <div className={`text-xs font-semibold ${isCompleted ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
          {isCompleted ? '🎉 Complete!' : `数理: ${remainingTokens.toLocaleString()}個`}
        </div>
      </div>

      {/* 中段：進捗ゲージ */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-400">進捗度</span>
          <span className={isCompleted ? 'text-amber-500 font-bold' : 'text-slate-600'}>
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
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 shadow-sm shadow-pink-200'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title={`${PHASE_NAMES[step]}に変更`}
              />
            );
          })}
        </div>
      </div>

      {/* 下段：ボタン */}
      <div className="flex gap-2">
        <button
          disabled={phase === 0}
          onClick={() => onPhaseChange(Math.max(0, phase - 1))}
          className="flex-1 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-500 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          戻す
        </button>
        <button
          disabled={phase === 4}
          onClick={() => onPhaseChange(Math.min(4, phase + 1))}
          className="flex-1 py-1.5 text-xs font-bold rounded-xl border border-pink-200 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm hover:from-pink-600 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {phase === 0 ? 'スタート' : phase === 3 ? '完成させる' : '進める'}
        </button>
      </div>
    </div>
  );
};