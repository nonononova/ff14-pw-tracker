import React, { useState } from 'react';
import { JobCard } from './JobCard';
import type { Role } from './JobCard';
import { useLocalStorage } from './useLocalStorage';

export interface JobData {
  jobCode: string;
  jobName: string;
  role: Role;
  phase: number;
}

const INITIAL_JOBS: JobData[] = [
  { jobCode: 'PLD', jobName: 'ナイト', role: 'tank', phase: 0 },
  { jobCode: 'WAR', jobName: '戦士', role: 'tank', phase: 0 },
  { jobCode: 'DRK', jobName: '暗黒騎士', role: 'tank', phase: 0 },
  { jobCode: 'GNB', jobName: 'ガンブレイカー', role: 'tank', phase: 0 },
  { jobCode: 'WHM', jobName: '白魔道士', role: 'healer', phase: 0 },
  { jobCode: 'SCH', jobName: '学者', role: 'healer', phase: 0 },
  { jobCode: 'AST', jobName: '占星術師', role: 'healer', phase: 0 },
  { jobCode: 'SGE', jobName: '賢者', role: 'healer', phase: 0 },
  { jobCode: 'MNK', jobName: 'モンク', role: 'melee', phase: 0 },
  { jobCode: 'DRG', jobName: '竜騎士', role: 'melee', phase: 0 },
  { jobCode: 'NIN', jobName: '忍者', role: 'melee', phase: 0 },
  { jobCode: 'SAM', jobName: '侍', role: 'melee', phase: 0 },
  { jobCode: 'RPR', jobName: 'リーパー', role: 'melee', phase: 0 },
  { jobCode: 'VPR', jobName: 'ヴァイパー', role: 'melee', phase: 0 },
  { jobCode: 'BRD', jobName: '吟遊詩人', role: 'ranged', phase: 0 },
  { jobCode: 'MCH', jobName: '機工士', role: 'ranged', phase: 0 },
  { jobCode: 'DNC', jobName: '踊り子', role: 'ranged', phase: 0 },
  { jobCode: 'BLM', jobName: '黒魔道士', role: 'caster', phase: 0 },
  { jobCode: 'SMN', jobName: '召喚士', role: 'caster', phase: 0 },
  { jobCode: 'RDM', jobName: '赤魔道士', role: 'caster', phase: 0 },
  { jobCode: 'PCT', jobName: 'ピクトマンサー', role: 'caster', phase: 0 },
];

type FilterRole = 'all' | Role;

export const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useLocalStorage<JobData[]>('ff14_pw_tracker_jobs', INITIAL_JOBS);
  const [activeFilter, setActiveFilter] = useState<FilterRole>('all');

  const handlePhaseChange = (jobCode: string, newPhase: number) => {
    setJobs((prev) =>
      prev.map((job) => (job.jobCode === jobCode ? { ...job, phase: newPhase } : job))
    );
  };

  const handleReset = () => {
    if (window.confirm('すべての進捗をリセットしますか？')) {
      setJobs(INITIAL_JOBS);
    }
  };

  const filteredJobs =
    activeFilter === 'all' ? jobs : jobs.filter((job) => job.role === activeFilter);

  const completedCount = jobs.filter((job) => job.phase === 4).length;
  const totalTokensNeeded = jobs.reduce((sum, job) => {
    if (job.phase === 4) return sum;
    return sum + (4 - job.phase) * 1500;
  }, 0);

  // 全体達成率 (全21ジョブ完了に必要な全トークン数: 21 * 4 * 1500 = 126,000)
  const MAX_TOKENS = 21 * 4 * 1500;
  const currentTokens = MAX_TOKENS - totalTokensNeeded;
  const progressPercent = Math.round((currentTokens / MAX_TOKENS) * 100);

  // 周回数の換算 (Lv100 ID = 50個/周, エキルレ = 90個/日)
  const idRunsNeeded = Math.ceil(totalTokensNeeded / 50);
  const exDaysNeeded = Math.ceil(totalTokensNeeded / 90);

  const filterTabs: { id: FilterRole; label: string }[] = [
    { id: 'all', label: `すべて (${jobs.length})` },
    { id: 'tank', label: 'TANK' },
    { id: 'healer', label: 'HEALER' },
    { id: 'melee', label: 'MELEE' },
    { id: 'ranged', label: 'RANGED' },
    { id: 'caster', label: 'CASTER' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-700 p-4 sm:p-6 lg:p-8 font-sans selection:bg-pink-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                ✨ PW Tracker
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                FF14 ファントムウェポン進捗チェックノート
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 bg-pink-50/60 border border-pink-100 p-3 px-4 rounded-2xl">
                <div className="text-right border-r border-pink-200/60 pr-4">
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">完成</div>
                  <div className="text-base font-extrabold text-pink-600">
                    {completedCount} <span className="text-xs text-slate-400 font-normal">/ 21</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">残り数理</div>
                  <div className="text-base font-extrabold text-slate-700">
                    {totalTokensNeeded.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors font-medium shadow-sm"
              >
                リセット
              </button>
            </div>
          </div>

          {/* 追加部分：全体進捗バー & 周回目安 */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* 達成率プログレスバー */}
            <div className="md:col-span-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">全体達成率</span>
                <span className="text-pink-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 周回目安表示 */}
            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 flex items-center justify-around text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Lv100 ID周回</div>
                <div className="font-bold text-slate-700">約 <span className="text-pink-600 font-extrabold">{idRunsNeeded}</span> 周</div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">エキルレのみ</div>
                <div className="font-bold text-slate-700">約 <span className="text-pink-600 font-extrabold">{exDaysNeeded}</span> 日</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200'
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.jobCode}
              jobCode={job.jobCode}
              jobName={job.jobName}
              role={job.role}
              phase={job.phase}
              onPhaseChange={(newPhase) => handlePhaseChange(job.jobCode, newPhase)}
            />
          ))}
        </main>
      </div>
    </div>
  );
};