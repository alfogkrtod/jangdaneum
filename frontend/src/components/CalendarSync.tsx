import React, { useState } from 'react';
import { RefreshCw, Calendar, ArrowRight, ShieldCheck, Sparkles, Check, Loader2, X, AlertCircle } from 'lucide-react';
import { UserProfile, CalendarEvent } from '../types';

interface CalendarSyncProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onComplete: () => void;
  onImportEvents?: (imported: CalendarEvent[]) => void;
}

const GOOGLE_EVENTS_MOCK: CalendarEvent[] = [
  { 
    id: 'g1', 
    title: '[Google] 부서 주간 싱크업', 
    type: 'fixed', 
    date: '2026-06-25', 
    time: '10:30', 
    duration: 60, 
    description: '구글 캘린더 실시간 연동 - 주요 업무 동향 및 스트레스 지표 체크' 
  },
  { 
    // Flexible task imported from GCal
    id: 'g2', 
    title: '[Google] 리프레시 야외 러닝', 
    type: 'flexible', 
    date: '2026-06-25', 
    time: '16:30', 
    duration: 60, 
    description: '구글 캘린더 연동 - 신체 에너지를 깨우는 가벼운 러닝 세션' 
  },
  { 
    id: 'g3', 
    title: '[Google] 인문학 독서 & 명상', 
    type: 'flexible', 
    date: '2026-06-25', 
    time: '21:30', 
    duration: 90, 
    description: '구글 캘린더 연동 - 뇌 피로 회복을 위한 힐링 타임' 
  }
];

export default function CalendarSync({ profile, onUpdateProfile, onComplete, onImportEvents }: CalendarSyncProps) {
  const [googleConnected, setGoogleConnected] = useState(profile.googleSynced);
  const [appleConnected, setAppleConnected] = useState(profile.appleSynced);
  const [syncing, setSyncing] = useState(false);

  // Google OAuth Popup Simulator states
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [authStage, setAuthStage] = useState<'consent' | 'processing' | 'done'>('consent');
  const [processStep, setProcessStep] = useState(0);

  // Progress labels for authentic sync feeling
  const stepsList = [
    'Google API 안전한 인증 통신망 구축 중...',
    'Google Calendar 데이터베이스 캘린더 토큰 교환 중...',
    '장단:음(RebalAI) 집중/휴식 맞춤형 지표 일동 연동 중...',
    '동기화 분석 완료! 캘린더 데이터가 온전하게 가져와졌습니다.'
  ];

  const handleGoogleClick = () => {
    if (googleConnected) {
      // Disconnect if already connected
      setGoogleConnected(false);
      onUpdateProfile({ googleSynced: false });
    } else {
      // Trigger oauth popup simulator
      setAuthStage('consent');
      setShowGoogleAuthModal(true);
    }
  };

  const handleAppleClick = () => {
    setAppleConnected(!appleConnected);
    onUpdateProfile({ appleSynced: !appleConnected });
  };

  const handleConsentAllow = () => {
    setAuthStage('processing');
    setProcessStep(0);

    // Incremental progress steps for realism
    const interval = setInterval(() => {
      setProcessStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setGoogleConnected(true);
            onUpdateProfile({ googleSynced: true });
            if (onImportEvents) {
              onImportEvents(GOOGLE_EVENTS_MOCK);
            }
            setAuthStage('done');
          }, 800);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleConnect = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onComplete();
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#f8faf0] relative overflow-y-auto custom-scrollbar">
      {/* Background decoration */}
      <div className="absolute top-10 right-[-50px] w-56 h-56 bg-[#346823]/5 rounded-full filter blur-[40px] pointer-events-none" />

      {/* Google OAuth Simulation Modal Overlay */}
      {showGoogleAuthModal && (
        <div className="absolute inset-0 z-50 bg-[#191d17]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl border border-neutral-100 overflow-hidden flex flex-col p-6 animate-fade-in-up relative">
            
            {authStage === 'consent' && (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <img 
                      alt="Google Logo" 
                      className="w-4 h-4 object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxuiaFF10ojzmg8eAQs0hxsU28RgRBE7V6ri8QeHpZlsEtiE6GucNujTVikDxt8LOE58r5JR51sBOfoL7wsgGipw-RyonTaSra2YowRM3bgBnrbVz15fH2sBg5pK6PTuRV_qqr6k2yvzCO_FTyNglenq4Lewa03DxCYlZGha6bLFEMM4G7yMR5JpIUe80MDSqO07NVSJ32AUfFSnw5NAn1BnBomPUbId0vSnsS18eaYVkVDZU5ziyLGee6eDOozunfdCgs5Rcznl4A" 
                    />
                    <span className="text-xs font-bold text-[#5f6368] font-sans">Google 계정으로 로그인</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowGoogleAuthModal(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                {/* Account card */}
                <div className="space-y-2">
                  <p className="text-[11px] text-[#202124] leading-relaxed">
                    <span className="font-bold text-[#346823]">장단:음 (RebalAI)</span> 서비스 제공을 위해 아래의 구글 계정으로 연동합니다.
                  </p>
                  
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                      <img src={profile.avatar} alt="User Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-neutral-800">{profile.name}</p>
                      <p className="text-[10px] text-neutral-500 font-sans">moshim668@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Permissions details */}
                <div className="bg-[#f3f5eb] p-4 rounded-2xl space-y-3">
                  <p className="text-[10px] font-bold text-[#346823]">장단:음이 요청하는 연동 권한:</p>
                  <ul className="space-y-2 text-[10px] text-[#42493d] leading-relaxed">
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#346823] mt-0.5">✔</span>
                      <span>Google Calendar의 일정을 읽어와 여유 일정 분석 및 스트레스 위험 제안</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#346823] mt-0.5">✔</span>
                      <span>개인 바이오리듬에 적합한 수면/집중/휴식 일정의 동기화 및 쓰기 권한</span>
                    </li>
                  </ul>
                </div>

                {/* Privacy Warning */}
                <div className="flex gap-2 items-start text-[9px] text-neutral-400 bg-neutral-50 p-2.5 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>동의 시 구글 캘린더를 통해 개인 맞춤 일정을 분석하며, 데이터는 전적으로 암호화 처리됩니다. 언제든지 연동을 해제할 수 있습니다.</span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleAuthModal(false)}
                    className="h-10 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleConsentAllow}
                    className="h-10 bg-[#346823] text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition-all"
                  >
                    동의 및 계속
                  </button>
                </div>
              </div>
            )}

            {authStage === 'processing' && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#346823]/10 border-t-[#346823] animate-spin" />
                  <img 
                    alt="Google" 
                    className="absolute w-6 h-6" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxuiaFF10ojzmg8eAQs0hxsU28RgRBE7V6ri8QeHpZlsEtiE6GucNujTVikDxt8LOE58r5JR51sBOfoL7wsgGipw-RyonTaSra2YowRM3bgBnrbVz15fH2sBg5pK6PTuRV_qqr6k2yvzCO_FTyNglenq4Lewa03DxCYlZGha6bLFEMM4G7yMR5JpIUe80MDSqO07NVSJ32AUfFSnw5NAn1BnBomPUbId0vSnsS18eaYVkVDZU5ziyLGee6eDOozunfdCgs5Rcznl4A" 
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#191d17]">Google Calendar 동기화 중</h3>
                  <div className="h-6 overflow-hidden">
                    <p className="text-[11px] text-[#346823] font-semibold animate-pulse">
                      {stepsList[processStep]}
                    </p>
                  </div>
                  <div className="w-48 h-1 bg-neutral-100 rounded-full mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-[#346823] transition-all duration-1000 rounded-full" 
                      style={{ width: `${(processStep + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {authStage === 'done' && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-scale-up">
                <div className="w-14 h-14 bg-[#346823] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#346823]/20">
                  <Check className="w-7 h-7" strokeWidth={3} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#191d17]">연동 완료!</h3>
                  <p className="text-xs text-[#72796c]">Google Calendar 일정을 장단:음에 성공적으로 반영했습니다.</p>
                  <p className="text-[10px] text-[#346823] font-bold pt-1">총 {GOOGLE_EVENTS_MOCK.length}개의 구글 캘린더 일정이 동기화되었습니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleAuthModal(false)}
                  className="w-full h-10 bg-[#346823] text-white rounded-xl text-xs font-bold hover:brightness-110 transition-colors mt-2"
                >
                  완료 및 닫기
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-2 h-1.5 rounded-full bg-[#c1c9b9]" />
          <span className="text-xs text-[#72796c] font-bold ml-2">Step 3 of 4</span>
        </div>

        {/* Central Orbital Animation */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Dashed outer orbit */}
            <div className={`absolute inset-0 border border-dashed border-[#c1c9b9] rounded-full ${syncing || (showGoogleAuthModal && authStage === 'processing') ? 'animate-spin' : ''}`} style={{ animationDuration: '20s' }} />
            
            {/* Core Calendar Box with bounce/float */}
            <div className="relative z-10 w-24 h-24 bg-[#346823] rounded-[24px] flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Calendar className="w-11 h-11 text-white" />
            </div>

            {/* Orbiting item 1: Google Sync Status */}
            <div className={`absolute -top-1 -right-1 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all ${
              googleConnected ? 'bg-[#346823] text-white' : 'bg-[#c7e9b9] text-[#346823]'
            }`}>
              {googleConnected ? (
                <Check className="w-5 h-5" />
              ) : (
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              )}
            </div>

            {/* Orbiting item 2: Coach sparkles */}
            <div className="absolute -bottom-1 -left-1 w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md ring-4 ring-[#346823]/5">
              <Sparkles className="w-5 h-5 text-[#346823]" />
            </div>
          </div>
        </div>

        {/* Content Description */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#191d17]">캘린더 연동</h2>
          <p className="text-xs text-[#42493d] max-w-sm mx-auto leading-relaxed">
            Google Calendar와 Apple Calendar를 연동하여 <br />
            AI가 당신의 일상 리듬을 더 정확하게 분석해 드립니다.
          </p>
        </div>

        {/* Integration Toggles */}
        <div className="space-y-2.5">
          {/* Google Calendar */}
          <div 
            onClick={handleGoogleClick}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              googleConnected 
                ? 'border-[#346823] bg-[#346823]/5 shadow-sm' 
                : 'border-[#c1c9b9]/30 bg-white/60 hover:bg-[#edefe5]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
              <img 
                alt="Google" 
                className="w-5 h-5" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxuiaFF10ojzmg8eAQs0hxsU28RgRBE7V6ri8QeHpZlsEtiE6GucNujTVikDxt8LOE58r5JR51sBOfoL7wsgGipw-RyonTaSra2YowRM3bgBnrbVz15fH2sBg5pK6PTuRV_qqr6k2yvzCO_FTyNglenq4Lewa03DxCYlZGha6bLFEMM4G7yMR5JpIUe80MDSqO07NVSJ32AUfFSnw5NAn1BnBomPUbId0vSnsS18eaYVkVDZU5ziyLGee6eDOozunfdCgs5Rcznl4A" 
              />
              {googleConnected && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#346823] rounded-full border border-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="text-left flex-grow">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#191d17]">Google Calendar</p>
                {googleConnected && (
                  <span className="text-[8px] bg-[#346823] text-white px-1.5 py-0.5 rounded-full font-bold">연동됨</span>
                )}
              </div>
              <p className="text-[10px] text-[#72796c]">
                {googleConnected ? '구글 일간 주요 일정 가져오기 완료' : '일정 및 작업 실시간 동기화'}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              googleConnected ? 'border-[#346823] bg-[#346823]' : 'border-[#c1c9b9]'
            }`}>
              {googleConnected && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>

          {/* Apple Calendar */}
          <div 
            onClick={handleAppleClick}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              appleConnected 
                ? 'border-[#346823] bg-[#346823]/5 shadow-sm' 
                : 'border-[#c1c9b9]/30 bg-white/60 hover:bg-[#edefe5]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
              <span className="text-lg font-bold text-[#191d17] font-sans"></span>
              {appleConnected && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#346823] rounded-full border border-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="text-left flex-grow">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#191d17]">Apple Calendar</p>
                {appleConnected && (
                  <span className="text-[8px] bg-[#346823] text-white px-1.5 py-0.5 rounded-full font-bold">연동됨</span>
                )}
              </div>
              <p className="text-[10px] text-[#72796c]">iCloud 계정 일정 가져오기</p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              appleConnected ? 'border-[#346823] bg-[#346823]' : 'border-[#c1c9b9]'
            }`}>
              {appleConnected && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        </div>

        {/* Sync Privacy Guard */}
        <div className="flex justify-center gap-2 text-[10px] text-[#72796c] bg-[#edefe5]/50 py-2.5 rounded-xl border border-[#c1c9b9]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#346823] shrink-0" />
          <span>연동된 정보는 전적으로 암호화되며 프라이버시가 보장됩니다.</span>
        </div>
      </div>

      {/* Rhythm Coach Tip Panel */}
      <div className="space-y-4 pt-4">
        <aside className="bg-white/60 border border-[#c1c9b9]/30 rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-[#c7e9b9] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#346823]" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#346823] mb-0.5">Rhythm Coach Tip</p>
            <p className="text-[11px] text-[#42493d] leading-relaxed">
              기존 일정을 연동하면 AI가 당신의 '여유 시간'을 분석하여, 생산성을 높일 최적의 집중 시간을 제안해 줍니다.
            </p>
          </div>
        </aside>

        <button 
          onClick={handleConnect}
          disabled={syncing}
          className="w-full h-12 bg-[#346823] text-white font-bold text-sm rounded-full shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>동기화하는 중...</span>
            </>
          ) : (
            <>
              <span>연동 및 계속하기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
