import React, { useState } from 'react';
import { 
  Calendar, Plus, Lock, Unlock, Check, Sparkles, Filter, Edit3, 
  ShieldAlert, ArrowRight, RefreshCw, X, ChevronRight, Brain, 
  Info, AlertTriangle, Coffee, Award, Zap, HelpCircle, Bell, Play, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarEvent, UserProfile } from '../types';
import { translations } from '../translations';

interface ScheduleViewProps {
  events: CalendarEvent[];
  profile: UserProfile;
  onToggleFixed: (id: string) => void;
  onAddEventClick: () => void;
  onSync: () => void;
  currentDay: string; // YYYY-MM-DD
  onSelectDay: (day: string) => void;
  onUpdateEvents?: (events: CalendarEvent[]) => void;
}

export default function ScheduleView({
  events,
  profile,
  onToggleFixed,
  onAddEventClick,
  onSync,
  currentDay,
  onSelectDay,
  onUpdateEvents
}: ScheduleViewProps) {
  const [filterFixed, setFilterFixed] = useState(true);
  const [filterFlexible, setFilterFlexible] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // AI Rebalance Interactive state
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [rebalanceStep, setRebalanceStep] = useState<number>(1);
  const [selectedProposal, setSelectedProposal] = useState<'balanced' | 'sprint' | 'recovery'>('balanced');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Proactive 20-min Notifications states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeAlertToast, setActiveAlertToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    category: string;
  }>({ show: false, title: '', message: '', category: '' });

  const lang = profile.language || 'ko';
  const t = translations[lang] || translations.ko;

  // Localized wording for the step-by-step AI Rebalancer
  const stepsText = {
    ko: {
      modal_title: '장단:음 AI 라이프 최적화',
      banner_warn: '오후 번아웃 위험 감지!',
      banner_desc: 'AI가 수면 부족 및 인지적 과부하를 분석하여 최적의 하루 리듬 조율을 제안합니다.',
      btn_rebalance: 'AI 일정 자동 조율',
      step1_title: '1단계 : AI 기반 일정 의미 분석',
      step1_desc: '자연어로 등록된 일정을 분석하여 두뇌 인지 부하(Cognitive Load)를 카테고리화합니다.',
      cognitive_load: '일간 인지적 과부하:',
      step2_title: '2단계 : 다차원 위험 예측 모델',
      step2_desc: '수면, 피로도, SNS 사용, 초과 근무 데이터를 융합해 번아웃 점수를 산출합니다.',
      sleep_debt: '수면 부채',
      sns_freq: 'SNS 사용 빈도',
      overwork: '초과 업무 빈도',
      burnout_score: '번아웃 위험 점수',
      risk_level: '⚠️ 번아웃 위험 최고조',
      step3_title: '3단계 : 맞춤형 AI 선제 개입 제안',
      step3_desc: '컨디션과 피로를 개선하기 위해 최적의 일정 배치 플랜을 제시합니다.',
      apply_btn: '이 제안으로 일정 재배치 적용',
      optimizing_text: 'AI 에이전트가 최적의 시간선을 시뮬레이션 및 재배치 중입니다...',
      success_title: '🎉 리밸런싱 조율 완료!',
      success_desc: '일정이 최적의 웰빙 루틴에 맞게 성공적으로 재조율되었습니다! 아래처럼 유동 일정이 시간 조정 및 여유 시간 확보 처리되었습니다.',
      close_btn: '완료 및 타임라인 보기',
      coach_words: 'AI 코치 조언: "어제 수면이 4.5시간으로 평소보다 3시간 부족합니다. 오늘은 고강도 업무를 뒤로 늦추거나 주말로 조율하여 두뇌 과부하를 방지하세요."'
    },
    en: {
      modal_title: 'Jangdan:um AI Life Optimizer',
      banner_warn: 'Afternoon Burnout Risk!',
      banner_desc: 'AI analyzes sleep debt & cognitive load to propose the optimal daily rebalance.',
      btn_rebalance: 'AI Auto Reschedule',
      step1_title: 'Step 1: AI Cognitive Load Analysis',
      step1_desc: 'Analyzes natural language event text to categorize brain cognitive energy spending.',
      cognitive_load: 'Daily Cognitive Load:',
      step2_title: 'Step 2: Multidimensional Risk Prediction',
      step2_desc: 'Fuses sleep, fatigue level, SNS usage, and overwork to calculate a Burnout score.',
      sleep_debt: 'Sleep Debt',
      sns_freq: 'SNS Overuse frequency',
      overwork: 'Overtime working patterns',
      burnout_score: 'Burnout Risk Score',
      risk_level: '⚠️ Peak Burnout Danger',
      step3_title: 'Step 3: Customized AI Proactive Intervention',
      step3_desc: 'We offer specialized schedule layouts designed to reduce stress and improve energy.',
      apply_btn: 'Apply This Rebalance Plan',
      optimizing_text: 'AI Agent is simulating and redrawing your timeline...',
      success_title: '🎉 Rebalance Successful!',
      success_desc: 'Your schedule was successfully optimized! Flexible events were moved to secure critical buffer times.',
      close_btn: 'Done & View Timeline',
      coach_words: 'AI Coach advice: "Your sleep was 4.5 hours last night, which is 3 hours short. We recommend moving high-effort work to a later time or tomorrow."'
    },
    ja: {
      modal_title: '「장단:음」 AI ライフ最適化',
      banner_warn: '午後バーンアウト警告！',
      banner_desc: 'AIが睡眠負債と認知的負荷を分析し、最適な一日のリズム調整を提案します。',
      btn_rebalance: 'AI 自動スケジュール調整',
      step1_title: '1段階 : AI 認知的負荷の分析',
      step1_desc: '登録された予定テキストを自然言語処理し、脳の認知的エネルギー消費に分類します。',
      cognitive_load: '日間認知的負荷:',
      step2_title: '2段階 : 多次元リスク予測モデル',
      step2_desc: '睡眠、疲労度、SNS過度使用、残業パターンを融合し、燃え尽きリスクを算出します。',
      sleep_debt: '睡眠負債',
      sns_freq: 'SNS使用急増頻度',
      overwork: '超過勤務パターン',
      burnout_score: '燃え尽きリスク度',
      risk_level: '⚠️ 燃え尽き警告アラート',
      step3_title: '3段階 : AI 先制介入（最適プラン提案）',
      step3_desc: '体調と疲労を改善するために、最適なスケジュール配置計画を提示します。',
      apply_btn: 'この計画をカレンダーに反映',
      optimizing_text: 'AIエージェントが最適なタイムラインをシミュレーション＆調整中です...',
      success_title: '🎉 調整が完了しました！',
      success_desc: 'スケジュールがウェルビーイングルーティンに沿って最適化されました！流動的な予定が自動調整され、休息時間が確保されました。',
      close_btn: '完了してタイムラインを表示',
      coach_words: 'AIコーチのアドバイス: "昨夜の睡眠時間は4.5時間で、通常より3時間不足しています。高負荷のタスクを延期するか、休息を優先してください。"'
    }
  };

  const st = stepsText[lang] || stepsText.ko;

  // Days list mapping
  const daysList = [
    { label: 'Mon', dayNum: '22', date: '2026-06-22' },
    { label: 'Tue', dayNum: '23', date: '2026-06-23' },
    { label: 'Wed', dayNum: '24', date: '2026-06-24' },
    { label: 'Thu', dayNum: '25', date: '2026-06-25' },
    { label: 'Fri', dayNum: '26', date: '2026-06-26' },
    { label: 'Sat', dayNum: '27', date: '2026-06-27' },
    { label: 'Sun', dayNum: '28', date: '2026-06-28' },
  ];

  // Filter events based on current selection and checkboxes
  const filteredEvents = events.filter(e => {
    if (e.date !== currentDay) return false;
    if (e.type === 'fixed' && !filterFixed) return false;
    if (e.type === 'flexible' && !filterFlexible) return false;
    if (e.type === 'optimized' && !filterFlexible) return false; // optimized acts as flexible
    return true;
  });

  // Calculate balance score based on ratio of flexible/optimized to fixed
  const flexibleCount = events.filter(e => e.type !== 'fixed').length;
  const totalCount = events.length;
  const balanceScore = totalCount > 0 ? Math.round((flexibleCount / totalCount) * 40 + 60) : 85;

  // Triggering the actual live rescheduling action
  const handleApplyRebalancePlan = () => {
    if (!onUpdateEvents) return;
    setIsOptimizing(true);

    setTimeout(() => {
      let rescheduled: CalendarEvent[] = [];

      if (selectedProposal === 'recovery') {
        // Calm Recovery
        rescheduled = [
          { id: '1', title: '기말고사 (수학)', type: 'fixed', date: currentDay, time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가', category: 'hardworking' },
          { id: 'rec-1', title: '허브 티 & 차분한 명상', type: 'optimized', date: currentDay, time: '11:00', duration: 60, description: '시험 피로 해소를 위한 브레인 리셋 🍃', category: 'break' },
          { id: 'rec-2', title: '따뜻한 점심 식사', type: 'optimized', date: currentDay, time: '12:00', duration: 60, description: '지친 소화계를 위한 자연식 식사', category: 'break' },
          { id: '2', title: '중간 발표 준비', type: 'optimized', date: currentDay, time: '14:00', duration: 60, description: '안정 뇌파 상태에서 가볍게 리허설', category: 'learning' },
          { id: 'rec-3', title: '차분한 야외 산책', type: 'optimized', date: currentDay, time: '15:00', duration: 60, description: '자연 광선 흡수 및 스트레스 완화', category: 'break' },
          { id: 'rec-4', title: '웰빙 인문학 독서', type: 'optimized', date: currentDay, time: '16:00', duration: 90, description: '창의 뇌파를 위한 이완 학습', category: 'learning' },
          { id: '3', title: '팀 프로젝트 회의', type: 'optimized', date: currentDay, time: '19:00', duration: 60, description: '저녁 가벼운 마무리 싱크업', category: 'hardworking' }
        ];
      } else if (selectedProposal === 'sprint') {
        // Morning Sprint
        rescheduled = [
          { id: '1', title: '기말고사 (수학)', type: 'fixed', date: currentDay, time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가', category: 'hardworking' },
          { id: '2', title: '중간 발표 준비', type: 'optimized', date: currentDay, time: '11:00', duration: 90, description: '집중 뇌파 상태에서 전력 몰입', category: 'learning' },
          { id: 'spr-1', title: '가벼운 식사 & 조용한 성찰', type: 'optimized', date: currentDay, time: '12:30', duration: 60, description: '과식을 피하고 가볍게 리프레시', category: 'break' },
          { id: '3', title: '팀 프로젝트 회의', type: 'optimized', date: currentDay, time: '13:30', duration: 90, description: '팀 협업 과제 압축 몰입', category: 'hardworking' },
          { id: 'spr-2', title: '성찰 일지 작성 & 짧은 독서', type: 'optimized', date: currentDay, time: '15:00', duration: 45, description: '하루의 배움 핵심 요약', category: 'learning' },
          { id: 'spr-3', title: '저녁 전면 자유 오프 그리드', type: 'optimized', date: currentDay, time: '15:45', duration: 180, description: '완전한 충전을 위한 이른 저녁 자유', category: 'break' }
        ];
      } else {
        // Balanced Focus
        rescheduled = [
          { id: '1', title: '기말고사 (수학)', type: 'fixed', date: currentDay, time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가', category: 'hardworking' },
          { id: 'bal-1', title: '런치 웰빙 브레이크 & 햇볕 쬐기', type: 'optimized', date: currentDay, time: '12:00', duration: 60, description: '세로토닌 분비를 촉진하는 식사 및 산책 ☀️', category: 'break' },
          { id: '2', title: '중간 발표 준비', type: 'optimized', date: currentDay, time: '14:30', duration: 120, description: '여유 휴식 버퍼 확보 후 최적 몰입', category: 'learning' },
          { id: 'bal-2', title: '차분한 마인드풀 요가 브레이크', type: 'optimized', date: currentDay, time: '16:30', duration: 30, description: '피로해진 두뇌와 육체 스트레칭', category: 'break' },
          { id: '3', title: '팀 프로젝트 회의', type: 'optimized', date: currentDay, time: '18:00', duration: 90, description: '저녁 전 무리하지 않도록 일정 안배', category: 'hardworking' }
        ];
      }

      onUpdateEvents(rescheduled);
      setIsOptimizing(false);
      setRebalanceStep(4); // Success step
    }, 1800);
  };

  // Calculate 20 minutes before an HH:MM time string
  const getNotificationTime = (timeStr: string): string => {
    try {
      const [hStr, mStr] = timeStr.split(':');
      let h = parseInt(hStr, 10);
      let m = parseInt(mStr, 10);
      m -= 20;
      if (m < 0) {
        m += 60;
        h -= 1;
        if (h < 0) {
          h += 24;
        }
      }
      const hPad = String(h).padStart(2, '0');
      const mPad = String(m).padStart(2, '0');
      return `${hPad}:${mPad}`;
    } catch (err) {
      return timeStr;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[var(--theme-bg)] relative overflow-y-auto custom-scrollbar pb-24">
      {/* Floating Push Notification Simulator Toast */}
      <AnimatePresence>
        {activeAlertToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="absolute top-4 left-4 right-4 bg-zinc-950 text-white rounded-2xl p-4 shadow-2xl border border-white/10 z-[300] text-left pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary)] text-white flex items-center justify-center shrink-0 shadow-lg">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-[var(--theme-primary)] tracking-widest uppercase">장단:음 ‧ 선제 알림</span>
                  <span className="text-[9px] text-zinc-500">지금</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{activeAlertToast.title}</h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed">{activeAlertToast.message}</p>
              </div>
              <button 
                onClick={() => setActiveAlertToast({ show: false, title: '', message: '', category: '' })}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info Area */}
      <div className="px-6 pt-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <span className="text-[10px] font-bold text-[var(--theme-primary)] tracking-widest uppercase">{t.sched_subtitle}</span>
            <h2 className="text-xl font-bold text-[var(--theme-text)]">{t.sched_title}</h2>
          </div>
          
          <div className="flex gap-1.5 bg-[var(--theme-border)]/20 rounded-full p-1 border border-[var(--theme-border)]/20 text-xs font-bold">
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'day' ? 'bg-[var(--theme-accent)] text-[var(--theme-text)]' : 'text-[var(--theme-secondary)]'}`}
            >
              {t.sched_view_day}
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'week' ? 'bg-[var(--theme-accent)] text-[var(--theme-text)]' : 'text-[var(--theme-secondary)]'}`}
            >
              {t.sched_view_week}
            </button>
          </div>
        </div>

        {/* AI RESCHEDULE DRAWING TIMETABLE PROACTIVE BANNER */}
        <div className="bg-gradient-to-r from-[var(--theme-primary)]/10 via-[var(--theme-accent)]/20 to-transparent p-4.5 rounded-[24px] border border-[var(--theme-border)]/30 shadow-sm relative overflow-hidden flex items-center justify-between gap-3 text-left">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[var(--theme-accent)]/20 rounded-full filter blur-2xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-1.5 text-[var(--theme-primary)] font-bold">
              <Sparkles className="w-4 h-4 animate-pulse text-[var(--theme-primary)]" />
              <span className="text-[10px] uppercase tracking-widest">{st.banner_warn}</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--theme-text)]">
              {lang === 'en' ? 'AI Smart Timetable Rebalance' : (lang === 'ja' ? 'AI タイムテーブル自动调整' : 'AI 기반 웰빙 루틴 자동 일정 조율')}
            </h3>
            <p className="text-[10px] text-[var(--theme-secondary)] leading-relaxed max-w-[250px]">
              {st.banner_desc}
            </p>
          </div>
          <button
            onClick={() => {
              setRebalanceStep(1);
              setShowRebalanceModal(true);
            }}
            className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white text-xs font-extrabold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all shrink-0 z-10 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{st.btn_rebalance}</span>
          </button>
        </div>

        {/* 20-MINUTE PROACTIVE REMINDERS CARD */}
        <div className="bg-[var(--theme-card)] p-4.5 rounded-[24px] border border-[var(--theme-border)]/30 shadow-sm text-left space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center">
                <Bell className={`w-4 h-4 ${notificationsEnabled ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[var(--theme-text)]">
                  {lang === 'ko' ? '스마트 20분 전 선제 알림' : '20-Min Proactive Smart Alarm'}
                </h3>
                <p className="text-[9px] text-[var(--theme-secondary)]">
                  {lang === 'ko' ? '집중 • 학습 • 휴식 전환 20분 전 자동 리마인더 및 가이드 가동 중' : 'Smart guides 20 mins before your next task transition'}
                </p>
              </div>
            </div>

            {/* Notification Switch Toggle */}
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                notificationsEnabled ? 'bg-[var(--theme-primary)]' : 'bg-[var(--theme-border)]'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                  notificationsEnabled ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {notificationsEnabled ? (
            <div className="space-y-2 pt-1">
              {filteredEvents.length === 0 ? (
                <p className="text-[10px] text-[var(--theme-secondary)] italic">
                  {lang === 'ko' ? '오늘 예정된 일정이 없어 활성화된 알림이 없습니다.' : 'No active schedules today to trigger alarms.'}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {filteredEvents.map(ev => {
                    const notifyTime = getNotificationTime(ev.time);
                    let alertMsg = '';
                    if (ev.category === 'hardworking') {
                      alertMsg = lang === 'ko' 
                        ? `⏰ [집중 예열] '심호흡 3회' 후 전자기기 알림을 차단하세요!`
                        : `⏰ [Focus Ready] Take 3 deep breaths and turn off phone alerts!`;
                    } else if (ev.category === 'learning') {
                      alertMsg = lang === 'ko'
                        ? `⏰ [학습 예열] '가벼운 수분 섭취'와 함께 목과 어깨를 스트레칭 해주세요!`
                        : `⏰ [Study Ready] Drink a glass of water and stretch your neck!`;
                    } else {
                      alertMsg = lang === 'ko'
                        ? `⏰ [휴식 전환] 모든 인지 작업을 일시 정지하고 몸과 마음을 이완하세요.`
                        : `⏰ [Break Transition] Stop working and let your brain completely rest.`;
                    }

                    return (
                      <div key={`notif-${ev.id}`} className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-[var(--theme-accent)]/5 border border-[var(--theme-border)]/10 text-[10px] text-[var(--theme-text)]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-extrabold text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-1.5 py-0.5 rounded shrink-0">
                            🔔 {notifyTime}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold truncate">'{ev.title}' 리마인더 예정</p>
                            <p className="text-[9px] text-[var(--theme-secondary)] truncate">{alertMsg}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveAlertToast({
                              show: true,
                              title: `${ev.title} 시작 20분 전!`,
                              message: alertMsg,
                              category: ev.category || 'break'
                            });
                            // Auto dismiss after 6 seconds
                            setTimeout(() => {
                              setActiveAlertToast(prev => prev.title === `${ev.title} 시작 20분 전!` ? { ...prev, show: false } : prev);
                            }, 6000);
                          }}
                          className="px-2 py-1 bg-[var(--theme-primary)] text-white text-[8px] font-black rounded-full hover:brightness-115 active:scale-90 transition-all shrink-0"
                          title="알림 테스트 발송"
                        >
                          {lang === 'ko' ? '알림 테스트' : 'Test'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-[var(--theme-border)]/10 rounded-xl border border-dashed border-[var(--theme-border)]/20 text-center">
              <p className="text-[10px] text-[var(--theme-secondary)]">
                {lang === 'ko' ? '🔇 선제 알림이 비활성화되었습니다.' : '🔇 Proactive reminders are turned off.'}
              </p>
            </div>
          )}
        </div>

        {/* Date Swiper */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-[var(--theme-secondary)] uppercase">Date Navigation</span>
            <span className="text-xs font-bold text-[var(--theme-primary)]">{lang === 'en' ? 'June 2026' : (lang === 'ja' ? '2026年 6月' : '2026년 6월')}</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
            {daysList.map((day) => {
              const active = currentDay === day.date;
              return (
                <button
                  key={day.date}
                  onClick={() => onSelectDay(day.date)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-18 rounded-2xl transition-all ${
                    active 
                      ? 'bg-[var(--theme-primary)] text-white shadow-md scale-105' 
                      : 'bg-[var(--theme-card)] hover:bg-[var(--theme-border)]/20 text-[var(--theme-text)] border border-[var(--theme-border)]/30'
                  }`}
                >
                  <span className={`text-[10px] ${active ? 'text-white/80' : 'text-[var(--theme-secondary)]'}`}>{day.label}</span>
                  <span className="text-lg font-bold leading-none mt-1">{day.dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Legend & Checkbox Filter */}
        <div className="flex items-center gap-4 py-2 border-b border-[var(--theme-border)]/30">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[var(--theme-secondary)]" />
            <span className="text-xs text-[var(--theme-secondary)] font-bold">{lang === 'ko' ? '필터:' : 'Filters:'}</span>
          </div>
          
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[var(--theme-text)]">
            <input 
              type="checkbox" 
              checked={filterFixed} 
              onChange={() => setFilterFixed(!filterFixed)} 
              className="rounded border-[var(--theme-border)] text-[var(--theme-primary)] focus:ring-[var(--theme-primary)] w-3.5 h-3.5"
            />
            <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
            <span>{t.sched_fixed}</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[var(--theme-text)]">
            <input 
              type="checkbox" 
              checked={filterFlexible} 
              onChange={() => setFilterFlexible(!filterFlexible)} 
              className="rounded border-[var(--theme-border)] text-[var(--theme-primary)] focus:ring-[var(--theme-primary)] w-3.5 h-3.5"
            />
            <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)]" />
            <span>{t.sched_flexible}</span>
          </label>
        </div>
      </div>

      {/* Main Timeline Section */}
      <div className="flex-1 px-6 mt-4 relative">
        {viewMode === 'day' ? (
          <>
            {/* Continuous Timeline center-left line */}
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-[var(--theme-border)]/40 z-0" />

            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center space-y-3 z-10 relative">
                <Calendar className="w-12 h-12 text-[var(--theme-secondary)]/30 mx-auto" />
                <p className="text-sm text-[var(--theme-text)] font-semibold">{t.sched_no_events}</p>
                <button 
                  onClick={onAddEventClick}
                  className="px-4 py-1.5 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-full hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  {t.sched_add_btn}
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10 pt-2">
                {filteredEvents.map((event) => {
                  const isFixed = event.type === 'fixed';
                  const isOptimized = event.type === 'optimized';

                  return (
                    <div key={event.id} className="flex gap-4 group animate-fade-in">
                      {/* Timeline Time Pin */}
                      <div className="w-10 flex-shrink-0 text-right pt-2.5">
                        <span className="text-[10px] font-bold text-[var(--theme-secondary)]">{event.time}</span>
                      </div>

                      {/* Timetable Card */}
                      <div className={`flex-1 bg-[var(--theme-card)] rounded-[24px] p-4.5 border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isFixed 
                          ? 'border-[var(--theme-primary)] border-l-4' 
                          : isOptimized 
                            ? 'border-2 border-dashed border-[var(--theme-primary)]/40 bg-[var(--theme-accent)]/5' 
                            : 'border-[var(--theme-border)]/30 border-l-4'
                      }`}>
                        <div className="flex-1 space-y-1 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isFixed ? (
                              <span className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[9px] font-extrabold uppercase border border-[var(--theme-primary)]/5">
                                {t.sched_fixed}
                              </span>
                            ) : isOptimized ? (
                              <span className="px-2 py-0.5 rounded-full bg-[var(--theme-accent)] text-[var(--theme-text)] text-[9px] font-extrabold uppercase border border-[var(--theme-accent)]/5 animate-pulse">
                                {t.sched_optimized}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-[var(--theme-border)]/20 text-[var(--theme-secondary)] text-[9px] font-extrabold uppercase border border-[var(--theme-border)]/10">
                                {t.sched_flexible}
                              </span>
                            )}
                            
                            {/* Proactive Drawn Category Tags */}
                            {event.category === 'hardworking' && (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[9px] font-extrabold uppercase border border-red-500/5">
                                🔥 {lang === 'en' ? 'Deep Focus' : '집중 시간'}
                              </span>
                            )}
                            {event.category === 'learning' && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[9px] font-extrabold uppercase border border-indigo-500/5">
                                📚 {lang === 'en' ? 'Study & Learn' : '배움 시간'}
                              </span>
                            )}
                            {event.category === 'break' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-extrabold uppercase border border-emerald-500/5 animate-pulse">
                                🍃 {lang === 'en' ? 'Recharge Break' : '휴식 시간'}
                              </span>
                            )}

                            <span className="text-[10px] text-[var(--theme-secondary)]">{event.duration}{t.sched_minutes}</span>
                          </div>
                          
                          <h4 className={`text-sm font-bold text-[var(--theme-text)]`}>
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="text-xs text-[var(--theme-secondary)] leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Interactive Actions */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <button 
                            onClick={() => onToggleFixed(event.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                              isFixed 
                                ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)]/30 text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/20' 
                                : 'bg-[var(--theme-bg)] border-[var(--theme-border)]/30 text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/10'
                            }`}
                            title={isFixed ? "유동 일정으로 변경" : "고정 일정으로 설정"}
                          >
                            {isFixed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* WEEKLY VIEW: Day-by-Day grouping dashboard */
          <div className="space-y-5 pb-8 animate-fade-in">
            {daysList.map((day) => {
              const dayEvents = events.filter(e => {
                if (e.date !== day.date) return false;
                if (e.type === 'fixed' && !filterFixed) return false;
                if (e.type === 'flexible' && !filterFlexible) return false;
                if (e.type === 'optimized' && !filterFlexible) return false;
                return true;
              });

              const isSelectedDay = currentDay === day.date;
              const koreanDayNames: Record<string, string> = {
                'Mon': lang === 'ko' ? '월요일' : (lang === 'ja' ? '月曜日' : 'Monday'),
                'Tue': lang === 'ko' ? '화요일' : (lang === 'ja' ? '火曜日' : 'Tuesday'),
                'Wed': lang === 'ko' ? '수요일' : (lang === 'ja' ? '水曜日' : 'Wednesday'),
                'Thu': lang === 'ko' ? '목요일' : (lang === 'ja' ? '木曜日' : 'Thursday'),
                'Fri': lang === 'ko' ? '금요일' : (lang === 'ja' ? '金曜日' : 'Friday'),
                'Sat': lang === 'ko' ? '토요일' : (lang === 'ja' ? '土曜日' : 'Saturday'),
                'Sun': lang === 'ko' ? '일요일' : (lang === 'ja' ? '日曜日' : 'Sunday')
              };

              return (
                <div 
                  key={day.date}
                  className={`p-4 rounded-[24px] border transition-all ${
                    isSelectedDay 
                      ? 'bg-[var(--theme-card)] border-[var(--theme-primary)] shadow-md ring-4 ring-[var(--theme-primary)]/5' 
                      : 'bg-[var(--theme-card)]/60 hover:bg-[var(--theme-card)] border-[var(--theme-border)]/30'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-[var(--theme-border)]/20">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectDay(day.date)}
                        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                          isSelectedDay ? 'bg-[var(--theme-primary)] text-white' : 'bg-[var(--theme-bg)] text-[var(--theme-text)]'
                        }`}
                      >
                        {day.dayNum}
                      </button>
                      <div className="text-left">
                        <span className="text-xs font-bold text-[var(--theme-text)]">{koreanDayNames[day.label]}</span>
                        <span className="text-[9px] text-[var(--theme-secondary)] ml-1.5 font-sans">{day.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelectedDay && (
                        <span className="text-[8px] bg-[var(--theme-primary)] text-white px-2 py-0.5 rounded-full font-bold">
                          {t.sched_selected}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--theme-secondary)] font-bold">
                        {t.sched_days_count.replace('{count}', String(dayEvents.length))}
                      </span>
                    </div>
                  </div>

                  {/* Day Events nested list */}
                  {dayEvents.length === 0 ? (
                    <div className="py-2.5 text-center bg-[var(--theme-bg)]/50 rounded-xl border border-dashed border-[var(--theme-border)]/20">
                      <p className="text-[11px] text-[var(--theme-secondary)] italic">{t.sched_no_events_short}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const isFixed = event.type === 'fixed';
                        const isOptimized = event.type === 'optimized';

                        return (
                          <div 
                            key={event.id}
                            className="flex items-center justify-between p-2.5 bg-[var(--theme-bg)]/80 rounded-xl border border-[var(--theme-border)]/15 hover:border-[var(--theme-primary)]/20 transition-all gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[10px] font-bold text-[var(--theme-secondary)] w-8 tabular-nums text-left">{event.time}</span>
                              <div className="min-w-0 text-left">
                                <h5 className="text-xs font-bold text-[var(--theme-text)] truncate">{event.title}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {isFixed ? (
                                    <span className="text-[8px] text-[var(--theme-primary)] font-extrabold uppercase">{t.sched_fixed}</span>
                                  ) : isOptimized ? (
                                    <span className="text-[8px] text-[var(--theme-text)] bg-[var(--theme-accent)] px-1 rounded font-extrabold uppercase">{t.sched_optimized}</span>
                                  ) : (
                                    <span className="text-[8px] text-[var(--theme-secondary)] font-extrabold uppercase">{t.sched_flexible}</span>
                                  )}
                                  <span className="text-[9px] text-[var(--theme-secondary)]">• {event.duration}{t.sched_minutes}</span>
                                </div>
                              </div>
                            </div>

                            {/* Lock Toggle Action inside Week View */}
                            <button 
                              onClick={() => onToggleFixed(event.id)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                                isFixed 
                                  ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 text-[var(--theme-primary)]' 
                                  : 'bg-[var(--theme-card)] border-transparent text-[var(--theme-secondary)] hover:bg-[var(--theme-border)]/20'
                              }`}
                            >
                              {isFixed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button 
          onClick={onSync}
          className="w-12 h-12 bg-[var(--theme-card)] text-[var(--theme-primary)] rounded-full shadow-lg border border-[var(--theme-border)]/50 flex items-center justify-center hover:bg-[var(--theme-border)]/20 transition-transform active:rotate-180 duration-500"
          title="캘린더 동기화"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button 
          onClick={onAddEventClick}
          className="w-14 h-14 bg-[var(--theme-primary)] text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          title="일정 추가"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* IMMERSIVE AI REBALANCE MODAL (STAGES 1, 2, 3, 4 FULLY IMPLEMENTED) */}
      {showRebalanceModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[200] flex flex-col justify-end md:justify-center p-0 md:p-6 animate-fade-in text-left">
          <div className="w-full max-h-[92%] bg-[var(--theme-bg)] rounded-t-[36px] md:rounded-[36px] overflow-hidden flex flex-col shadow-2xl relative border-t border-[var(--theme-border)]/30 max-w-lg mx-auto">
            
            {/* Header */}
            <div className="p-5 border-b border-[var(--theme-border)]/20 flex items-center justify-between bg-[var(--theme-card)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--theme-primary)] animate-pulse" />
                <h3 className="text-base font-extrabold text-[var(--theme-text)]">{st.modal_title}</h3>
              </div>
              <button 
                onClick={() => setShowRebalanceModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--theme-border)]/20 hover:bg-[var(--theme-border)]/40 flex items-center justify-center transition-colors text-[var(--theme-text)]"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Stages Step Navigator */}
            <div className="flex justify-between px-6 py-3 bg-[var(--theme-card)]/50 border-b border-[var(--theme-border)]/10 text-[10px] font-bold text-[var(--theme-secondary)]">
              <button 
                onClick={() => setRebalanceStep(1)} 
                className={`pb-1 border-b-2 transition-all ${rebalanceStep === 1 ? 'text-[var(--theme-primary)] border-[var(--theme-primary)] font-extrabold' : 'border-transparent'}`}
              >
                1. {lang === 'en' ? 'Cognitive Load' : '인지부하 분류'}
              </button>
              <button 
                onClick={() => setRebalanceStep(2)} 
                className={`pb-1 border-b-2 transition-all ${rebalanceStep === 2 ? 'text-[var(--theme-primary)] border-[var(--theme-primary)] font-extrabold' : 'border-transparent'}`}
              >
                2. {lang === 'en' ? 'Risk Score' : '복합 위험 예측'}
              </button>
              <button 
                onClick={() => setRebalanceStep(3)} 
                className={`pb-1 border-b-2 transition-all ${rebalanceStep === 3 ? 'text-[var(--theme-primary)] border-[var(--theme-primary)] font-extrabold' : 'border-transparent'}`}
              >
                3. {lang === 'en' ? 'AI Coach Action' : 'AI 조율 제안'}
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

              {/* 1단계 : AI 기반 일정 의미 분석 및 카테고리화 */}
              {rebalanceStep === 1 && (
                <div className="space-y-4 animate-scale-up">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{lang === 'en' ? 'STAGE 1' : '1단계'}</span>
                    <h4 className="text-sm font-extrabold text-[var(--theme-text)] pt-1.5">{st.step1_title}</h4>
                    <p className="text-xs text-[var(--theme-secondary)] leading-relaxed">{st.step1_desc}</p>
                  </div>

                  {/* Cognitive Load categorization mapping widgets */}
                  <div className="space-y-3 bg-[var(--theme-card)]/70 p-4.5 rounded-2xl border border-[var(--theme-border)]/30 shadow-sm">
                    <span className="text-[10px] font-bold text-[var(--theme-secondary)] uppercase block mb-1">{st.cognitive_load}</span>
                    
                    {events.map((evt) => {
                      const isHighLoad = evt.title.includes('시험') || evt.title.includes('공부') || evt.title.includes('발표');
                      const loadColor = isHighLoad ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20';
                      const loadEmoji = isHighLoad ? '🧠' : '🍃';
                      const loadText = isHighLoad 
                        ? (lang === 'en' ? 'High Brain Load (고강도 집중)' : (lang === 'ja' ? '高負荷（集中）' : '고강도 인지적 부하 (집중)'))
                        : (lang === 'en' ? 'Low Brain Load (휴식/사교)' : (lang === 'ja' ? '低負荷（休息・社交）' : '저강도 부하 (휴식/사교)'));

                      return (
                        <div key={evt.id} className="flex items-center justify-between p-3 bg-[var(--theme-bg)] rounded-xl border border-[var(--theme-border)]/20">
                          <div className="text-left">
                            <span className="text-[9px] text-[var(--theme-secondary)] font-bold">{evt.time} ({evt.duration}m)</span>
                            <h5 className="text-xs font-extrabold text-[var(--theme-text)] leading-tight">{evt.title}</h5>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 shrink-0 ${loadColor}`}>
                            <span>{loadEmoji}</span>
                            <span>{loadText}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stage navigation footer button */}
                  <button
                    onClick={() => setRebalanceStep(2)}
                    className="w-full h-11 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all mt-4"
                  >
                    <span>{lang === 'en' ? 'Next: Risk Prediction Models' : '다음: 다차원 위험 분석 단계'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 2단계 : 다차원 데이터를 통한 복합 위험 예측 (미래 스트레스 & 번아웃) */}
              {rebalanceStep === 2 && (
                <div className="space-y-4 animate-scale-up">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] bg-[#ba1a1a]/10 text-[#ba1a1a] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{lang === 'en' ? 'STAGE 2' : '2단계'}</span>
                    <h4 className="text-sm font-extrabold text-[var(--theme-text)] pt-1.5">{st.step2_title}</h4>
                    <p className="text-xs text-[var(--theme-secondary)] leading-relaxed">{st.step2_desc}</p>
                  </div>

                  {/* Multi-indicator health charts */}
                  <div className="space-y-3.5 bg-[var(--theme-card)]/70 p-4.5 rounded-2xl border border-[var(--theme-border)]/30 shadow-sm text-left">
                    {/* Sleep Debt */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-extrabold">
                        <span className="text-[var(--theme-text)]">{st.sleep_debt}</span>
                        <span className="text-red-500">4.5h / 8.0h (⚠️ 부족)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--theme-border)]/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '56%' }} />
                      </div>
                    </div>

                    {/* SNS Overuse pattern */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-extrabold">
                        <span className="text-[var(--theme-text)]">{st.sns_freq}</span>
                        <span className="text-orange-500">급증 (주의)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--theme-border)]/30 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>

                    {/* Overtime working */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-extrabold">
                        <span className="text-[var(--theme-text)]">{st.overwork}</span>
                        <span className="text-red-500">초과 (과도함)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--theme-border)]/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Huge Burnout Risk Score visual meter */}
                  <div className="bg-[#ba1a1a]/5 rounded-2xl p-4.5 border border-[#ba1a1a]/20 text-center space-y-2">
                    <span className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-widest block">{st.burnout_score}</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-[#ba1a1a] tracking-tight">85</span>
                      <span className="text-xs text-[#ba1a1a]/70 font-bold">/100</span>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold">
                      <AlertTriangle className="w-3 h-3 fill-current" />
                      {st.risk_level}
                    </span>
                  </div>

                  {/* Stage navigation footer button */}
                  <button
                    onClick={() => setRebalanceStep(3)}
                    className="w-full h-11 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all mt-4"
                  >
                    <span>{lang === 'en' ? 'Next: AI Coach Intervention' : '다음: AI 코치 선제 조치 제안'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 3단계 : 맞춤형 AI 코치 모드 및 Action을 통한 선제적 개입 */}
              {rebalanceStep === 3 && (
                <div className="space-y-4 animate-scale-up text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{lang === 'en' ? 'STAGE 3' : '3단계'}</span>
                    <h4 className="text-sm font-extrabold text-[var(--theme-text)] pt-1.5">{st.step3_title}</h4>
                    <p className="text-xs text-[var(--theme-secondary)] leading-relaxed">{st.step3_desc}</p>
                  </div>

                  {/* Friendly chatbot style advice banner */}
                  <div className="bg-[var(--theme-accent-light)] rounded-2xl p-4.5 border border-[var(--theme-primary)]/20 flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center shrink-0 shadow-md">
                      <Brain className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-[var(--theme-text)] leading-relaxed">
                      {st.coach_words}
                    </p>
                  </div>

                  {/* Interactive Proposal Selection Cards */}
                  <div className="space-y-2.5">
                    {[
                      { 
                        id: 'balanced', 
                        title: lang === 'ko' ? 'Balanced Focus (균형 잡힌 몰입)' : 'Balanced Focus', 
                        desc: lang === 'ko' ? '일정 간격 사이에 30분의 인지 휴식 버퍼를 적용하여 스트레스를 분산시킵니다.' : 'Adds 30 mins break buffers between high focus tasks.',
                        emoji: '⚖️',
                        scoreDiff: '-20%'
                      },
                      { 
                        id: 'sprint', 
                        title: lang === 'ko' ? 'Morning Sprint (오전 몰입형)' : 'Morning Sprint', 
                        desc: lang === 'ko' ? '에너지가 최고조인 아침 시간에 모든 주요 일정을 처리하고, 오후를 보장합니다.' : 'Front-loads focus sessions to guarantee a free quiet evening.',
                        emoji: '⚡',
                        scoreDiff: '-30%'
                      },
                      { 
                        id: 'recovery', 
                        title: lang === 'ko' ? 'Calm Recovery (차분한 회복)' : 'Calm Recovery', 
                        desc: lang === 'ko' ? '과부하 일정을 주말로 연기하고, 오늘 남은 시간을 완전한 오프 그리드 휴식으로 대체합니다.' : 'Postpones heavy events and guarantees peaceful relaxation today.',
                        emoji: '🌱',
                        scoreDiff: '-40%'
                      },
                    ].map((plan) => {
                      const active = selectedProposal === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedProposal(plan.id as any)}
                          className={`w-full p-4 rounded-2xl border transition-all text-left flex gap-3 items-start relative overflow-hidden ${
                            active 
                              ? 'bg-[var(--theme-card)] border-[var(--theme-primary)] shadow-md ring-2 ring-[var(--theme-primary)]/10' 
                              : 'bg-[var(--theme-card)]/40 border-[var(--theme-border)]/20 hover:border-[var(--theme-primary)]/40'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{plan.emoji}</span>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs font-extrabold text-[var(--theme-text)]">{plan.title}</h5>
                              <span className="text-[9px] font-extrabold bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-1.5 py-0.5 rounded">
                                {plan.scoreDiff} Stress
                              </span>
                            </div>
                            <p className="text-[10px] text-[var(--theme-secondary)] leading-relaxed">{plan.desc}</p>
                          </div>
                          {active && (
                            <div className="absolute right-3 top-3 w-5 h-5 bg-[var(--theme-primary)] rounded-full flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Live Timetable Preview of Selected Option */}
                  <div className="bg-[var(--theme-card)] p-4.5 rounded-2xl border border-[var(--theme-border)]/30 space-y-2 text-left">
                    <span className="text-[10px] font-extrabold text-[var(--theme-primary)] uppercase tracking-wider block mb-2">
                      📋 {lang === 'en' ? 'Proposed Timetable Preview' : '제안된 일과표 미리보기 (집중 • 배움 • 휴식)'}
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      {selectedProposal === 'balanced' && (
                        <>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">09:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">기말고사 (수학)</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">12:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">런치 웰빙 브레이크</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">14:30</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">중간 발표 준비</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-600 font-extrabold uppercase">📚 배움 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">16:30</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">마인드풀 요가 브레이크</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">18:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">팀 프로젝트 회의</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                        </>
                      )}
                      {selectedProposal === 'sprint' && (
                        <>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">09:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">기말고사 (수학)</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">11:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">중간 발표 준비</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-600 font-extrabold uppercase">📚 배움 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">12:30</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">가벼운 식사 & 조용한 성찰</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">13:30</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">팀 프로젝트 회의</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">15:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">성찰 일지 & 독서</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-600 font-extrabold uppercase">📚 배움 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">15:45</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">저녁 전면 자유 충전</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                        </>
                      )}
                      {selectedProposal === 'recovery' && (
                        <>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">09:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">기말고사 (수학)</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">11:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">허브 티 & 차분한 명상</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">12:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">따뜻한 슬로우 푸드 점심</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">14:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">중간 발표 준비</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-600 font-extrabold uppercase">📚 배움 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">15:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">차분한 야외 숲 산책</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase">🍃 휴식 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">16:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">웰빙 인문학 독서</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-600 font-extrabold uppercase">📚 배움 시간</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="text-xs font-bold w-10 text-[var(--theme-secondary)]">19:00</span>
                            <span className="text-xs font-black text-[var(--theme-text)] flex-1">팀 프로젝트 회의</span>
                            <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/10 text-red-600 font-extrabold uppercase">🔥 집중 시간</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trigger optimization logic */}
                  <button
                    onClick={handleApplyRebalancePlan}
                    disabled={isOptimizing}
                    className="w-full h-12 bg-[var(--theme-primary)] hover:brightness-110 text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-lg transition-all mt-4 disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{st.optimizing_text}</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white animate-bounce" />
                        <span>{st.apply_btn}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 4단계 : 최종 결과 완료 화면 (Success & Care high alignment) */}
              {rebalanceStep === 4 && (
                <div className="space-y-4 animate-scale-up text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[var(--theme-accent)] to-[var(--theme-primary)] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Award className="w-8 h-8 animate-bounce" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-[var(--theme-text)]">{st.success_title}</h4>
                    <p className="text-xs text-[var(--theme-secondary)] leading-relaxed max-w-sm mx-auto">
                      {st.success_desc}
                    </p>
                  </div>

                  <div className="bg-[var(--theme-accent-light)] p-4 rounded-2xl border border-[var(--theme-primary)]/20 text-left space-y-1.5 max-w-sm mx-auto">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--theme-primary)]">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'en' ? 'Burnout risk lowered to 45%!' : '번아웃 예측 지수 45%로 안전 하락 완료!'}</span>
                    </div>
                    <p className="text-[10px] text-[var(--theme-secondary)]">
                      {lang === 'ko' 
                        ? '유동 일정이 여유 가이드에 따라 성공적으로 시각적 타임라인에 재배치 완료되었습니다. 일상에 마음 쉼표를 찍어보세요.'
                        : 'Timetable was automatically re-arranged on the scheduler grid.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowRebalanceModal(false);
                      setRebalanceStep(1);
                    }}
                    className="w-full h-11 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all mt-4"
                  >
                    <span>{st.close_btn}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
