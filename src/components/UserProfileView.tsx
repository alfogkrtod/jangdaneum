import React, { useState } from 'react';
import { Award, Calendar, Heart, Shield, LogOut, ChevronRight, ChevronDown, ChevronUp, Palette, HelpCircle, Activity, LayoutGrid, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../translations';

interface UserProfileViewProps {
  profile: UserProfile;
  onLogout: () => void;
  onTogglePremium: () => void;
  onNavigateToSync: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  eventsCount: number;
  diaryCount: number;
}

interface CompletedTask {
  id: string;
  title: string;
  category: 'hardworking' | 'learning' | 'break';
  duration: number;
}

interface DailyCompletedGroup {
  dateStr: {
    ko: string;
    en: string;
    ja: string;
  };
  tasks: CompletedTask[];
}

const COMPLETED_TASKS_DATA: DailyCompletedGroup[] = [
  {
    dateStr: {
      ko: '6월 25일 (오늘)',
      en: 'June 25 (Today)',
      ja: '6月25日 (今日)'
    },
    tasks: [
      { id: 'c-1', title: '기말고사 (수학)', category: 'hardworking', duration: 120 },
      { id: 'c-2', title: '런치 웰빙 브레이크 & 햇볕 쬐기 ☀️', category: 'break', duration: 60 },
      { id: 'c-3', title: '중간 발표 준비 리허설', category: 'learning', duration: 120 }
    ]
  },
  {
    dateStr: {
      ko: '6월 24일 (어제)',
      en: 'June 24 (Yesterday)',
      ja: '6月24日 (昨日)'
    },
    tasks: [
      { id: 'c-4', title: '마인드풀 저녁 요가 스트레칭', category: 'break', duration: 45 },
      { id: 'c-5', title: '프론트엔드 핵심 아키텍처 학습 📚', category: 'learning', duration: 120 },
      { id: 'c-6', title: '생체 리듬 AI 알고리즘 독서', category: 'learning', duration: 90 }
    ]
  },
  {
    dateStr: {
      ko: '6월 23일 (2일 전)',
      en: 'June 23 (2 days ago)',
      ja: '6月23日 (2日前)'
    },
    tasks: [
      { id: 'c-7', title: '연구 과제 보고서 최종 마감 ✍️', category: 'hardworking', duration: 150 },
      { id: 'c-8', title: '가벼운 숲속 산책 & 브레인 리셋', category: 'break', duration: 40 }
    ]
  },
  {
    dateStr: {
      ko: '6월 22일 (3일 전)',
      en: 'June 22 (3 days ago)',
      ja: '6月22日 (3日前)'
    },
    tasks: [
      { id: 'c-9', title: '생체 리듬 최적화 기획안 피드백', category: 'hardworking', duration: 100 },
      { id: 'c-10', title: '활력을 찾아주는 선셋 수영 🏊‍♂️', category: 'break', duration: 60 },
      { id: 'c-11', title: '사용자 중심 UX 인터랙션 분석', category: 'learning', duration: 80 }
    ]
  }
];

export default function UserProfileView({
  profile,
  onLogout,
  onTogglePremium,
  onNavigateToSync,
  onUpdateProfile,
  eventsCount,
  diaryCount
}: UserProfileViewProps) {
  const lang = profile.language || 'ko';
  const t = translations[lang] || translations.ko;

  const [showAllTasks, setShowAllTasks] = useState(false);

  const visibleGroups = showAllTasks ? COMPLETED_TASKS_DATA : COMPLETED_TASKS_DATA.slice(0, 1);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[var(--theme-bg)] relative overflow-y-auto custom-scrollbar pb-24">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-accent)]/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="px-6 pt-4 space-y-6">
        
        {/* Profile Card Header */}
        <section className="flex flex-col md:flex-row items-center gap-5 p-6 rounded-[28px] bg-[var(--theme-card)]/70 backdrop-blur-md border border-[var(--theme-border)]/30 shadow-sm relative overflow-hidden">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--theme-primary)]/20 p-0.5 bg-[var(--theme-bg)]">
              <img 
                src={profile.avatar} 
                className="w-full h-full rounded-full object-cover" 
                alt={profile.name}
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={onTogglePremium}
              className="absolute bottom-0 right-0 bg-[var(--theme-primary)] hover:brightness-110 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
              title="Toggle Premium Status"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <button 
              onClick={onTogglePremium}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                profile.isPremium 
                  ? 'bg-[var(--theme-accent)] text-[var(--theme-text)]' 
                  : 'bg-[var(--theme-border)]/20 text-[var(--theme-secondary)]'
              }`}
            >
              <Shield className="w-3 h-3 fill-current animate-pulse" />
              <span>{profile.isPremium ? t.profile_is_premium : t.profile_go_premium}</span>
            </button>
            <h2 className="text-xl font-bold text-[var(--theme-text)]">{profile.name}</h2>
            <p className="text-xs text-[var(--theme-secondary)] leading-tight italic">"{profile.motto}"</p>
          </div>
        </section>

        {/* Dynamic Streak Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--theme-accent-light)] border border-[var(--theme-border)]/30 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary)] flex items-center justify-center shrink-0">
              <Award className="text-white w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-[var(--theme-primary)] uppercase">{t.profile_streak_stat}</p>
              <h4 className="text-sm font-bold text-[var(--theme-text)]">
                {profile.streak}{lang === 'ko' ? '일 연속' : t.profile_stat_days}
              </h4>
            </div>
          </div>

          <div className="bg-[var(--theme-accent-light)] border border-[var(--theme-border)]/30 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary)] flex items-center justify-center shrink-0">
              <Activity className="text-white w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-[var(--theme-primary)] uppercase">{t.profile_flow_stat}</p>
              <h4 className="text-sm font-bold text-[var(--theme-text)]">
                {profile.avgFlowTime}{lang === 'ko' ? '시간' : t.profile_stat_hours}
              </h4>
            </div>
          </div>
        </div>

        {/* Focus vs Rest - Rhythmic Bar Chart */}
        <div className="bg-[var(--theme-card)]/80 backdrop-blur-md rounded-3xl p-5 border border-[var(--theme-border)]/30 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <h3 className="text-sm font-bold text-[var(--theme-text)]">{t.profile_chart_title}</h3>
              <p className="text-[10px] text-[var(--theme-secondary)]">{t.profile_chart_sub}</p>
            </div>
            <span className="bg-[var(--theme-bg)] text-[var(--theme-secondary)] px-2.5 py-1 rounded-full text-[9px] font-bold">{t.profile_chart_thisweek}</span>
          </div>

          <div className="h-32 flex items-end gap-2.5 pt-2">
            {[
              { day: 'Mon', focus: 60, rest: 30 },
              { day: 'Tue', focus: 40, rest: 50 },
              { day: 'Wed', focus: 70, rest: 20 },
              { day: 'Thu', focus: 45, rest: 45 },
              { day: 'Fri', focus: 60, rest: 30 },
              { day: 'Sat', focus: 20, rest: 70 },
              { day: 'Sun', focus: 15, rest: 80 },
            ].map((d, index) => (
              <div key={index} className="flex-1 flex flex-col gap-1 items-center h-full justify-end">
                <div className="w-full flex flex-col justify-end gap-0.5 h-full">
                  <div className="w-full bg-[var(--theme-primary)]/20 rounded-t-md" style={{ height: `${d.rest}%` }} />
                  <div className="w-full bg-[var(--theme-primary)] rounded-b-md" style={{ height: `${d.focus}%` }} />
                </div>
                <span className="text-[9px] text-[var(--theme-secondary)] font-bold mt-1">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-2 border-t border-[var(--theme-border)]/20 text-[10px] text-[var(--theme-secondary)] font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[var(--theme-primary)] rounded-full" /> 
              {t.profile_chart_focus}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[var(--theme-primary)]/20 rounded-full" /> 
              {t.profile_chart_rest}
            </span>
          </div>
        </div>

        {/* Day-by-Day Completed Tasks with Toggle */}
        <div className="bg-[var(--theme-card)]/80 backdrop-blur-md rounded-3xl p-5 border border-[var(--theme-border)]/30 shadow-sm space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-bold text-[var(--theme-text)] flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[var(--theme-primary)]" />
              {lang === 'ko' ? '일별 완료 과제 분석' : (lang === 'ja' ? '日別完了タスク分析' : 'Day-by-Day Completed Tasks')}
            </h3>
            <p className="text-[10px] text-[var(--theme-secondary)]">
              {lang === 'ko' ? '완료되어 뇌파 최적화 점수에 반영된 누적 루틴 분석' : (lang === 'ja' ? '完了してバイオリ듬スコアに反映された累積ルーティン分析' : 'Cumulative routine analysis reflected in your balance scores')}
            </p>
          </div>

          <div className="space-y-4">
            {visibleGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2 border-l-2 border-[var(--theme-primary)]/20 pl-3">
                <span className="text-[10px] font-extrabold text-[var(--theme-primary)] uppercase tracking-wider block text-left">
                  🗓️ {group.dateStr[lang] || group.dateStr['en']}
                </span>
                
                <div className="space-y-1.5">
                  {group.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[var(--theme-bg)]/50 border border-[var(--theme-border)]/10 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-4.5 h-4.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="font-bold text-[var(--theme-text)] truncate">{task.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        {task.category === 'hardworking' && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-red-500/10 text-red-600 border border-red-500/5">
                            🔥 {lang === 'ko' ? '집중' : (lang === 'ja' ? '集中' : 'Focus')}
                          </span>
                        )}
                        {task.category === 'learning' && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-indigo-500/10 text-indigo-600 border border-indigo-500/5">
                            📚 {lang === 'ko' ? '배움' : (lang === 'ja' ? '学び' : 'Learn')}
                          </span>
                        )}
                        {task.category === 'break' && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/5 text-emerald-600">
                            🍃 {lang === 'ko' ? '휴식' : (lang === 'ja' ? '休息' : 'Break')}
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--theme-secondary)] font-mono">{task.duration}{lang === 'ko' ? '분' : (lang === 'ja' ? '分' : 'm')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Show All / Show Less Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="w-full py-2.5 rounded-xl bg-[var(--theme-bg)] hover:bg-[var(--theme-border)]/10 text-xs font-bold text-[var(--theme-text)] transition-colors flex items-center justify-center gap-1.5 border border-[var(--theme-border)]/30 active:scale-[0.98]"
          >
            {showAllTasks ? (
              <>
                <span>{lang === 'ko' ? '간략히 보기 (오늘 일정만)' : (lang === 'ja' ? 'シンプル表示 (今日のみ)' : 'Show Less (Today only)')}</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>
                  {lang === 'ko' 
                    ? `일별 완료 과제 모두 보기 (${COMPLETED_TASKS_DATA.length}일분)` 
                    : (lang === 'ja' 
                      ? `完了したタスクをすべて表示 (${COMPLETED_TASKS_DATA.length}日분)` 
                      : `Show all completed tasks (${COMPLETED_TASKS_DATA.length} days)`
                    )
                  }
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Circular Sleep suggestion widget */}
        <div className="bg-[var(--theme-primary)] text-white p-6 rounded-[28px] relative overflow-hidden shadow-md">
          <div className="absolute right-[-20px] bottom-[-20px] w-28 h-28 opacity-15 pointer-events-none">
            <Activity className="w-full h-full text-white" />
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/80">{t.profile_quality_title}</span>
          <h4 className="text-lg font-bold mt-1 text-left">{t.profile_quality_title}</h4>
          <p className="text-xs text-white/95 mt-2 leading-relaxed text-left">
            {t.profile_quality_desc}
          </p>
        </div>

        {/* Settings Links */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--theme-secondary)] uppercase ml-1 block text-left">{t.profile_settings_sec}</span>
          
          <div className="bg-[var(--theme-card)]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-[var(--theme-border)]/30">
            {/* Connected Calendars */}
            <button 
              onClick={onNavigateToSync}
              className="w-full flex items-center justify-between p-4.5 hover:bg-[var(--theme-bg)]/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--theme-bg)] flex items-center justify-center text-[var(--theme-primary)]">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--theme-text)]">{t.profile_setting_calendar}</p>
                  <p className="text-[10px] text-[var(--theme-secondary)]">{t.profile_setting_calendar_desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--theme-secondary)] font-bold">
                <span className="bg-[var(--theme-accent)] text-[var(--theme-text)] px-2 py-0.5 rounded text-[9px] font-extrabold">2 CONNECTED</span>
                <ChevronRight className="w-4 h-4 text-[var(--theme-secondary)]" />
              </div>
            </button>

            <div className="h-px bg-[var(--theme-border)]/20" />

            {/* Language Selection */}
            <div className="flex items-center justify-between p-4.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--theme-bg)] flex items-center justify-center text-[var(--theme-primary)]">
                  <LayoutGrid className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--theme-text)]">{t.profile_setting_lang}</p>
                  <p className="text-[10px] text-[var(--theme-secondary)]">{t.profile_setting_lang_desc}</p>
                </div>
              </div>
              <div className="flex gap-1 bg-[var(--theme-bg)] p-1 rounded-lg">
                <button 
                  onClick={() => onUpdateProfile({ language: 'ko' })}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'ko' ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  한국어
                </button>
                <button 
                  onClick={() => onUpdateProfile({ language: 'en' })}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => onUpdateProfile({ language: 'ja' })}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'ja' ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  日本語
                </button>
              </div>
            </div>

            <div className="h-px bg-[var(--theme-border)]/20" />

            {/* Theme / Appearance Selection */}
            <div className="flex items-center justify-between p-4.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--theme-bg)] flex items-center justify-center text-[var(--theme-primary)]">
                  <Palette className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--theme-text)]">{t.profile_setting_theme}</p>
                  <p className="text-[10px] text-[var(--theme-secondary)]">{t.profile_setting_theme_desc}</p>
                </div>
              </div>
              <div className="flex gap-1 bg-[var(--theme-bg)] p-1 rounded-lg">
                <button 
                  onClick={() => onUpdateProfile({ theme: 'organic' })}
                  className={`px-2 py-1 text-[9px] font-bold rounded ${profile.theme === 'organic' || !profile.theme ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  Organic
                </button>
                <button 
                  onClick={() => onUpdateProfile({ theme: 'dark' })}
                  className={`px-2 py-1 text-[9px] font-bold rounded ${profile.theme === 'dark' ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => onUpdateProfile({ theme: 'warm' })}
                  className={`px-2 py-1 text-[9px] font-bold rounded ${profile.theme === 'warm' ? 'bg-[var(--theme-primary)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'}`}
                >
                  Warm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full h-12 rounded-full border-2 border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ba1a1a]/5 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.profile_sign_out}</span>
          </button>
          
          <p className="text-center mt-6 text-[10px] text-[var(--theme-secondary)]/80">
            장단:음 (RebalAI) v2.4.0 • Crafted for Circadian & Inner Balance
          </p>
        </div>

      </div>
    </div>
  );
}
