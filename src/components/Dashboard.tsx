import React, { useState } from 'react';
import { JobCard } from './JobCard';
import type { Role } from './JobCard';
import { useLocalStorage } from './useLocalStorage';

export interface JobData {
  jobCode: string;
  jobName: string;
  role: Role;
  phase: number;
  isPinned?: boolean;
}

const INITIAL_JOBS: JobData[] = [
  { jobCode: 'PLD', jobName: 'ナイト', role: 'tank', phase: 0, isPinned: false },
  { jobCode: 'WAR', jobName: '戦士', role: 'tank', phase: 0, isPinned: false },
  { jobCode: 'DRK', jobName: '暗黒騎士', role: 'tank', phase: 0, isPinned: false },
  { jobCode: 'GNB', jobName: 'ガンブレイカー', role: 'tank', phase: 0, isPinned: false },
  { jobCode: 'WHM', jobName: '白魔道士', role: 'healer', phase: 0, isPinned: false },
  { jobCode: 'SCH', jobName: '学者', role: 'healer', phase: 0, isPinned: false },
  { jobCode: 'AST', jobName: '占星術師', role: 'healer', phase: 0, isPinned: false },
  { jobCode: 'SGE', jobName: '賢者', role: 'healer', phase: 0, isPinned: false },
  { jobCode: 'MNK', jobName: 'モンク', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'DRG', jobName: '竜騎士', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'NIN', jobName: '忍者', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'SAM', jobName: '侍', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'RPR', jobName: 'リーパー', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'VPR', jobName: 'ヴァイパー', role: 'melee', phase: 0, isPinned: false },
  { jobCode: 'BRD', jobName: '吟遊詩人', role: 'ranged', phase: 0, isPinned: false },
  { jobCode: 'MCH', jobName: '機工士', role: 'ranged', phase: 0, isPinned: false },
  { jobCode: 'DNC', jobName: '踊り子', role: 'ranged', phase: 0, isPinned: false },
  { jobCode: 'BLM', jobName: '黒魔道士', role: 'caster', phase: 0, isPinned: false },
  { jobCode: 'SMN', jobName: '召喚士', role: 'caster', phase: 0, isPinned: false },
  { jobCode: 'RDM', jobName: '赤魔道士', role: 'caster', phase: 0, isPinned: false },
  { jobCode: 'PCT', jobName: 'ピクトマンサー', role: 'caster', phase: 0, isPinned: false },
];

type FilterRole = 'all' | 'pinned' | Role;

export const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useLocalStorage<JobData[]>('ff14_pw_tracker_jobs', INITIAL_JOBS);
  const [activeFilter, setActiveFilter] = useState<FilterRole>('all');
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('ff14_pw_tracker_darkmode', false);
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'compact'>('ff14_pw_tracker_viewmode', 'grid');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhaseChange = (jobCode: string, newPhase: number) => {
    const job = jobs.find((j) => j.jobCode === jobCode);
    if (newPhase === 4 && job && job.phase !== 4) {
      showToast(`🎉 ${job.jobName}のファントムウェポンが完成しました！`);
    }

    setJobs((prev) =>
      prev.map((j) => (j.jobCode === jobCode ? { ...j, phase: newPhase } : j))
    );
  };

  const handleTogglePin = (jobCode: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.jobCode === jobCode ? { ...job, isPinned: !Boolean(job.isPinned) } : job
      )
    );
  };

  const handleReset = () => {
    if (window.confirm('すべての進捗をリセットしますか？')) {
      setJobs(INITIAL_JOBS);
      showToast('進捗をリセットしました');
    }
  };

  const pinnedCount = jobs.filter((job) => Boolean(job.isPinned)).length;

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pinned') return Boolean(job.isPinned);
    return job.role === activeFilter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (activeFilter === 'pinned') return 0;
    return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
  });

  const completedCount = jobs.filter((job) => job.phase === 4).length;
  const totalTokensNeeded = jobs.reduce((sum, job) => {
    if (job.phase === 4) return sum;
    return sum + (4 - job.phase) * 1500;
  }, 0);

  const MAX_TOKENS = 21 * 4 * 1500;
  const currentTokens = MAX_TOKENS - totalTokensNeeded;
  const progressPercent = Math.round((currentTokens / MAX_TOKENS) * 100);

  const idRunsNeeded = Math.ceil(totalTokensNeeded / 50);
  const exDaysNeeded = Math.ceil(totalTokensNeeded / 90);

  const handleShare = () => {
    const text = `✨【FF14】ファントムウェポン作成進捗\n\n・完成数: ${completedCount} / 21本\n・全体達成率: ${progressPercent}%\n・残り数理: ${totalTokensNeeded.toLocaleString()}個\n\n#FF14 #PWTracker #ファントムウェポン\n`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  const filterTabs: { id: FilterRole; label: string }[] = [
    { id: 'all', label: `すべて (${jobs.length})` },
    { id: 'pinned', label: `📌 メイン (${pinnedCount})` },
    { id: 'tank', label: 'TANK' },
    { id: 'healer', label: 'HEALER' },
    { id: 'melee', label: 'MELEE' },
    { id: 'ranged', label: 'RANGED' },
    { id: 'caster', label: 'CASTER' },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 sm:p-6 lg:p-8 font-sans selection:bg-pink-200 relative ${
        isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50/60 text-slate-700'
      }`}
    >
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold px-6 py-3 rounded-full shadow-lg text-xs sm:text-sm border border-white/20">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header
          className={`p-5 sm:p-6 rounded-3xl shadow-sm border transition-colors duration-300 space-y-5 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  ✨ PW Tracker
                </h1>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-all active:scale-95 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-amber-300 hover:bg-slate-600'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isDarkMode ? '🌙 ダーク' : '☀️ ライト'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                FF14 ファントムウェポン進捗チェックノート
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`flex items-center gap-4 p-3 px-4 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-slate-900/60 border-slate-700'
                    : 'bg-pink-50/60 border-pink-100'
                }`}
              >
                <div className="text-right border-r border-pink-200/40 pr-4">
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">完成</div>
                  <div className="text-base font-extrabold text-pink-500">
                    {completedCount} <span className="text-xs text-slate-400 font-normal">/ 21</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">残り数理</div>
                  <div className={`text-base font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {totalTokensNeeded.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="text-xs px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>𝕏</span> シェア
              </button>

              <button
                onClick={handleReset}
                className={`text-xs px-3 py-2 rounded-xl border font-medium shadow-sm transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-slate-400 hover:text-rose-400'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
              >
                リセット
              </button>
            </div>
          </div>

          <div className={`pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className="md:col-span-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>全体達成率</span>
                <span className="text-pink-500">{progressPercent}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200/50'}`}>
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className={`rounded-2xl p-2.5 border flex items-center justify-around text-center text-xs ${
              isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50/80 border-slate-100'
            }`}>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Lv100 ID周回</div>
                <div className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  約 <span className="text-pink-500 font-extrabold">{idRunsNeeded}</span> 周
                </div>
              </div>
              <div className={`h-6 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">エキルレのみ</div>
                <div className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  約 <span className="text-pink-500 font-extrabold">{exDaysNeeded}</span> 日
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* フィルター ＆ 表示モード切り替えスイッチ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200/50'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={`flex items-center p-1 rounded-2xl border shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              🎴 カード表示
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'compact'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              📱 リスト表示
            </button>
          </div>
        </div>

        <main
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'grid grid-cols-1 md:grid-cols-2 gap-2'
          }
        >
          {sortedJobs.map((job) => (
            <JobCard
              key={job.jobCode}
              jobCode={job.jobCode}
              jobName={job.jobName}
              role={job.role}
              phase={job.phase}
              isPinned={Boolean(job.isPinned)}
              isDarkMode={isDarkMode}
              isCompact={viewMode === 'compact'}
              onPhaseChange={(newPhase) => handlePhaseChange(job.jobCode, newPhase)}
              onTogglePin={() => handleTogglePin(job.jobCode)}
            />
          ))}
        </main>

        <footer className={`pt-8 pb-4 text-center text-[11px] leading-relaxed space-y-1 ${
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <p>※当サイトは個人が作成した非公式のファンメイドツールです。</p>
          <p>記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。</p>
          <p className="font-medium pt-1">(C) SQUARE ENIX CO., LTD. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};