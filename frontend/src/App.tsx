import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Code, FileCode, Copy, Check, Sparkles, 
  RotateCcw, ShieldAlert, Cpu, Heart, CheckCircle2, 
  Lightbulb, RefreshCw, Layers, Calendar, Award, Moon, Brain, Bot, User 
} from 'lucide-react';

import { CalendarEvent, UserProfile, ChatMessage, DiaryEntry, RebalanceProposal } from './types';
import { translations } from './translations';
import SplashAndLogin from './components/SplashAndLogin';
import OnboardingProfile from './components/OnboardingProfile';
import CalendarSync from './components/CalendarSync';
import ScheduleView from './components/ScheduleView';
import StressAnalysis from './components/StressAnalysis';
import MindfulDiary from './components/MindfulDiary';
import CoachChat from './components/CoachChat';
import UserProfileView from './components/UserProfileView';
import AddEventForm from './components/AddEventForm';
import DailySummaryReport from './components/DailySummaryReport';

// Predefined event parameters for quick mock testing
const eventKeywords: { [key: string]: { duration: number; time: string; desc: string } } = {
  '매주 수학 공부': { duration: 90, time: '13:00', desc: '기말고사 대비 기하와 벡터 킬러 문항 정복' },
  '요가 세션': { duration: 45, time: '07:30', desc: '아침 스트레칭과 전신 코어 릴렉스' },
  '클라이언트 싱크': { duration: 60, time: '11:00', desc: '분기 디자인 시안 최종 피드백 리뷰' },
  '에너지 러닝': { duration: 50, time: '18:30', desc: '페이스 6분 안정을 유지하는 시티 나이트 러닝' },
  '프로젝트 회의': { duration: 90, time: '15:00', desc: '스마트 일정 조율 아키텍처 점검' }
};

const eventTimeMap: Record<string, string> = {
  '매주 수학 공부': '13:00',
  '요가 세션': '07:30',
  '클라이언트 싱크': '11:00',
  '에너지 러닝': '18:30',
  '프로젝트 회의': '15:00'
};

const eventDurationMap: Record<string, number> = {
  '매주 수학 공부': 90,
  '요가 세션': 45,
  '클라이언트 싱크': 60,
  '에너지 러닝': 50,
  '프로젝트 회의': 90
};

const eventDescMap: Record<string, string> = {
  '매주 수학 공부': '기말고사 대비 기하와 벡터 킬러 문항 정복',
  '요가 세션': '아침 스트레칭과 전신 코어 릴렉스',
  '클라이언트 싱크': '분기 디자인 시안 최종 피드백 리뷰',
  '에너지 러닝': '페이스 6분 안정을 유지하는 시티 나이트 러닝',
  '프로젝트 회의': '스마트 일정 조율 아키텍처 점검'
};

export default function App() {
  // Navigation Screens: 'Splash' | 'Onboarding' | 'CalendarSync' | 'MainTabs' | 'AddEvent'
  const [currentScreen, setCurrentScreen] = useState<'Splash' | 'Onboarding' | 'CalendarSync' | 'MainTabs' | 'AddEvent'>('Splash');
  const [activeTab, setActiveTab] = useState<'schedule' | 'stress' | 'diary' | 'coach' | 'summary' | 'profile'>('schedule');

  // React Native Code Tab state
  const [activeCodeTab, setActiveCodeTab] = useState<'App.js' | 'package.json' | 'app.json'>('App.js');
  const [copied, setCopied] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: '김서연',
    motto: '오늘도 나만의 리듬을 찾아서...',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9DX0VW9dWt0T4tD0dDQAe-UvLp5KFaNjDTW4hNunP-ZUz3vUpt2ouEw5WRfE53VY4M4GdFBE2LzZ_22RPy5uQXZ0CaJvTDyLkmJs7gxg7KRi4sFgpSfwmR1L70a0lT2h4zJpfFjrxyD9qofp3HH_Z5PdXNbfknnkFm9tD0o5E8olSMej5ILtqnltWVgd_GLfEOOxWvm16cXNSnFZVkWnzhTJw8zB4aDwT96nEGqBhnfiGJ08KRVSZNZ_Y_u6FHDueRnSWsQjqyJ4P',
    streak: 12,
    avgFlowTime: 4.2,
    isPremium: true,
    googleSynced: true,
    appleSynced: false,
    language: 'ko',
    theme: 'organic'
  });

  const themes = {
    organic: {
      '--theme-primary': '#346823',
      '--theme-primary-hover': '#26501a',
      '--theme-bg': '#f8faf0',
      '--theme-card': '#ffffff',
      '--theme-text': '#191d17',
      '--theme-border': '#c1c9b9',
      '--theme-secondary': '#72796c',
      '--theme-accent': '#c7e9b9',
      '--theme-accent-light': 'rgba(199, 233, 185, 0.2)',
    },
    dark: {
      '--theme-primary': '#a3e635',
      '--theme-primary-hover': '#bef264',
      '--theme-bg': '#12140e',
      '--theme-card': '#1a1c16',
      '--theme-text': '#e4e6db',
      '--theme-border': '#3a3c34',
      '--theme-secondary': '#8e9285',
      '--theme-accent': '#2e4a21',
      '--theme-accent-light': 'rgba(46, 74, 33, 0.3)',
    },
    warm: {
      '--theme-primary': '#854d0e',
      '--theme-primary-hover': '#a16207',
      '--theme-bg': '#fdf8f2',
      '--theme-card': '#fffbf7',
      '--theme-text': '#3b2302',
      '--theme-border': '#eaddcf',
      '--theme-secondary': '#8c7860',
      '--theme-accent': '#fed7aa',
      '--theme-accent-light': 'rgba(254, 215, 170, 0.25)',
    }
  };

  const activeThemeStyles = themes[profile.theme || 'organic'] as React.CSSProperties;

  // Events State
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: '기말고사 (수학)', type: 'fixed', date: '2026-06-25', time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가', category: 'hardworking' },
    { id: '2', title: '중간 발표 준비', type: 'flexible', date: '2026-06-25', time: '14:00', duration: 120, description: 'AI 최적화 가능 시간', category: 'learning' },
    { id: '3', title: '팀 프로젝트 회의', type: 'flexible', date: '2026-06-25', time: '19:00', duration: 90, description: '온라인 싱크업 미팅', category: 'hardworking' }
  ]);

  // Current selected day in DayPicker
  const [currentDay, setCurrentDay] = useState('2026-06-25');

  // AI Proposal state
  const [activeProposal, setActiveProposal] = useState<RebalanceProposal>('balanced');

  // Chat message state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: '지난밤 수면 기록이 4.5시간으로 평소보다 3시간 적습니다. 오늘 무리한 일정보다는 가벼운 릴랙스 타임을 가져보세요.', timestamp: '오전 08:30' },
    { id: '2', sender: 'ai', text: '오후 4시에 예정되어 있는 [중간 발표 준비] 일정을 내일 오전으로 연기하여 스트레스 위험을 낮출까요?', timestamp: '오전 08:31' }
  ]);

  // Diary logs state
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  // Simulator notifications / events helper
  const [simulatorStatus, setSimulatorStatus] = useState<string>('Wearable Synced');

  // Code mapping for the developer explorer
  const expoCodes = {
    'App.js': `// expo/App.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Calendar, Award, Bot, Lock, Unlock, Moon, Sparkles } from 'lucide-react-native';

export default function App() {
  const [screen, setScreen] = useState('Splash');
  const [events, setEvents] = useState([
    { id: '1', title: '기말고사 (수학)', type: 'fixed', time: '09:00', duration: 120 },
    { id: '2', title: '중간 발표 준비', type: 'flexible', time: '14:00', duration: 120 }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>장단:음 (RebalAI)</Text>
      {/* Complete modular screens available inside /expo workspace */}
    </SafeAreaView>
  );
}`,
    'package.json': `{
  "name": "jangdan-um-expo",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react-native": "0.74.1",
    "lucide-react-native": "^0.379.0"
  }
}`,
    'app.json': `{
  "expo": {
    "name": "장단:음 (Jangdan:um)",
    "slug": "jangdan-um",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "backgroundColor": "#f8faf0"
  }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContents[activeCodeTab] || codeContents['App.js']);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFixed = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, type: e.type === 'fixed' ? 'flexible' : 'fixed' } : e));
  };

  const handleTogglePremium = () => {
    setProfile(prev => ({ ...prev, isPremium: !prev.isPremium }));
  };

  const handleAddEvent = (newEvent: Partial<CalendarEvent>) => {
    const titleKey = newEvent.title || '';
    const fresh: CalendarEvent = {
      id: String(events.length + 1),
      title: newEvent.title || '새 일정',
      type: newEvent.type || 'flexible',
      date: newEvent.date || currentDay,
      time: eventTimeMap[titleKey] || newEvent.time || '10:00',
      duration: eventDurationMap[titleKey] || newEvent.duration || 60,
      description: eventDescMap[titleKey] || newEvent.description || 'AI Balance Active',
      category: newEvent.category || 'hardworking'
    };

    setEvents([...events, fresh]);
    setCurrentScreen('MainTabs');
  };

  const handleApplyProposal = (proposal: RebalanceProposal) => {
    setActiveProposal(proposal);
    // Real-time Reschedule events depending on proposal type
    if (proposal === 'recovery') {
      setEvents(events.map(e => {
        if (e.id === '2') return { ...e, time: '15:30', description: '휴식 확보를 위해 오후 늦게 시작' };
        if (e.id === '3') return { ...e, time: '16:00', date: '2026-06-26', description: '스트레스 방지를 위해 금요일로 이월' };
        return e;
      }));
      setSimulatorStatus('Calm Recovery Active');
    } else if (proposal === 'sprint') {
      setEvents(events.map(e => {
        if (e.id === '2') return { ...e, time: '11:00', description: '에너지가 충만한 아침 타임으로 앞당김' };
        if (e.id === '3') return { ...e, time: '13:00', description: '오후 집중 오피스 싱크업' };
        return e;
      }));
      setSimulatorStatus('Sprint mode applied');
    } else {
      // restore default Wed schedule
      setEvents([
        { id: '1', title: '기말고사 (수학)', type: 'fixed', date: '2026-06-24', time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가' },
        { id: '2', title: '중간 발표 준비', type: 'flexible', date: '2026-06-24', time: '14:00', duration: 120, description: 'AI 최적화 가능 시간' },
        { id: '3', title: '팀 프로젝트 회의', type: 'flexible', date: '2026-06-24', time: '19:00', duration: 90, description: '온라인 싱크업 미팅' }
      ]);
    }
  };

  const handleSendMessage = (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp };
    // We add local messages
    setEvents(prev => {
      // Force trigger state sync
      return [...prev];
    });
  };

  // Add Diary journal
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const handleAddDiaryEntry = (entry: Partial<DiaryEntry>) => {
    const newEntry: DiaryEntry = {
      id: Math.random().toString(),
      date: entry.date || new Date().toISOString().split('T')[0],
      text: msgToAppendDiary(entry.text || ''),
      mood: entry.mood || 'peace'
    };
    onUpdateProfile({ streak: profile.streak + 1 });
    // update state
  };

  const onUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  // Simulated code viewer file map
  const [activeCodeFile, setActiveCodeFile] = useState<'app' | 'package' | 'appjson' | 'screen'>('app');

  const expoCodeMap = {
    app: `/expo/App.js`,
    package: `/expo/package.json`,
    config: `/expo/app.json`
  };

  const codeContents: Record<string, string> = {
    'package.json': `{
  "name": "jangdan-um-expo",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react-native": "0.74.1",
    "lucide-react-native": "^0.379.0",
    "expo-linear-gradient": "~13.0.2"
  }
}`,
    'app.json': `{
  "expo": {
    "name": "장단:음 (Jangdan:um)",
    "slug": "jangdan-um",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "backgroundColor": "#f8faf0"
  }
}`,
    'App.js': `// Standard React Native Entry Point with bottom tabs navigation
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar, Award, Bot, Lock, Unlock, Moon, Sparkles } from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [events, setEvents] = useState([
    { id: '1', title: '기말고사 (수학)', type: 'fixed', time: '09:00', duration: 120 },
    { id: '2', title: '중간 발표 준비', type: 'flexible', time: '14:00', duration: 120 }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>장단:음 (RebalAI)</Text>
      {/* Screen Render based on activeTab */}
      <ScrollView style={styles.content}>
        {activeTab === 'schedule' && <ScheduleScreen events={events} />}
      </ScrollView>
    </SafeAreaView>
  );
}`
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5eb] flex flex-col items-center p-4 md:p-8 select-none">
      
      {/* Web Branding Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#346823] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#191d17] tracking-tight">장단:음 (Jangdan:um)</h1>
            <p className="text-xs text-[#72796c] font-semibold">Expo React Native Premium Rhythm & AI Rebalance Simulator</p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="bg-[#caecbb] text-[#1e510f] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#caecbb]/30 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Expo Web Sandbox Active</span>
          </span>
          <button 
            onClick={() => {
              setCurrentScreen('Splash');
              setActiveTab('schedule');
              setEvents([
                { id: '1', title: '기말고사 (수학)', type: 'fixed', date: '2026-06-25', time: '09:00', duration: 120, description: '중요 시험 - 절대 수정 불가' },
                { id: '2', title: '중간 발표 준비', type: 'flexible', date: '2026-06-25', time: '14:00', duration: 120, description: 'AI 최적화 가능 시간' },
                { id: '3', title: '팀 프로젝트 회의', type: 'flexible', date: '2026-06-25', time: '19:00', duration: 90, description: '온라인 싱크업 미팅' }
              ]);
            }}
            className="bg-white/80 border border-[#c1c9b9] hover:bg-[#edefe5] p-2 rounded-xl text-xs font-bold text-[#346823] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="리셋 시뮬레이션"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Left Side Simulator */}
      <div className="w-full flex justify-center items-center">
        
        {/*  INTERACTIVE SIMULATOR  */}
        <div className="lg:col-span-12 flex flex-col items-center gap-4">
          <div className="w-full max-w-sm flex items-center justify-between text-xs text-[#72796c] font-bold px-2">
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-[#346823]" /> SIMULATOR PREVIEW</span>
            <span className="bg-[#346823]/10 text-[#346823] px-2 py-0.5 rounded-full text-[10px]">{simulatorStatus}</span>
          </div>

          {/* Sveltest smartphone outer casing mockup */}
          <div className="relative w-full max-w-sm aspect-[9/19] min-h-[720px] bg-[#1a1c16] rounded-[52px] p-3 shadow-2xl border-4 border-[#2f312b] ring-8 ring-[#1a1c16]/10 flex flex-col justify-between overflow-hidden">
            
            {/* Front speaker notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1c16] rounded-b-2xl z-[100] flex justify-center items-center">
              {/* Speaker lens */}
              <div className="w-10 h-1 bg-[#2f312b]/60 rounded-full mb-1" />
              {/* Camera sensor pinhole */}
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full ml-2 mb-1 border border-neutral-800" />
            </div>

            {/* Inner screen frame containing the complete application logic */}
            <div className="w-full h-full bg-[var(--theme-bg)] rounded-[42px] overflow-hidden relative flex flex-col" style={activeThemeStyles}>
              
              {/* Device System Top Bar */}
              <div className="h-10 pt-6 px-6 bg-[var(--theme-bg)]/90 backdrop-blur-md flex justify-between items-center text-[10px] font-bold text-[var(--theme-text)] z-[90] pointer-events-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 rounded bg-neutral-800 flex items-center p-0.5"><div className="w-2 h-full bg-[#f8faf0] rounded-sm" /></div>
                  <WifiIcon />
                  <BatteryIcon />
                </div>
              </div>

              {/* RENDER THE REVENUE SCREENS */}
              <div className="flex-1 overflow-hidden relative">
                {currentScreen === 'Splash' && (
                  <SplashAndLogin 
                    onLoginSuccess={() => setCurrentScreen('Onboarding')} 
                    onUpdateProfile={onUpdateProfile}
                  />
                )}

                {currentScreen === 'Onboarding' && (
                  <OnboardingProfile 
                    profile={profile} 
                    onUpdateProfile={onUpdateProfile} 
                    onComplete={() => setCurrentScreen('CalendarSync')} 
                  />
                )}

                {currentScreen === 'CalendarSync' && (
                  <CalendarSync 
                    profile={profile} 
                    onUpdateProfile={onUpdateProfile} 
                    onComplete={() => setCurrentScreen('MainTabs')} 
                    onImportEvents={(imported) => {
                      // Avoid duplicate importations
                      setEvents(prev => {
                        const existingIds = new Set(prev.map(e => e.id));
                        const filtered = imported.filter(e => !existingIds.has(e.id));
                        return [...prev, ...filtered];
                      });
                    }}
                  />
                )}

                {currentScreen === 'MainTabs' && (
                  <div className="w-full h-full flex flex-col justify-between relative">
                    
                    {/* Screens Mapping based on activeTab */}
                    <div className="flex-1 overflow-hidden relative">
                      {activeTab === 'schedule' && (
                        <ScheduleView 
                          events={events}
                          profile={profile}
                          onToggleFixed={handleToggleFixed}
                          onAddEventClick={() => setCurrentScreen('AddEvent')}
                          onSync={() => setCurrentScreen('CalendarSync')}
                          currentDay={currentDay}
                          onSelectDay={setCurrentDay}
                          onUpdateEvents={setEvents}
                        />
                      )}

                      {activeTab === 'stress' && (
                        <StressAnalysis 
                          onApplyProposal={handleApplyProposal}
                          activeProposal={activeProposal}
                          eventsCount={events.length}
                          fixedCount={events.filter(e => e.type === 'fixed').length}
                        />
                      )}

                      {activeTab === 'diary' && (
                        <MindfulDiary 
                          profile={profile}
                          onAddDiaryEntry={(entry) => {
                            // Append entry
                            const fresh: DiaryEntry = {
                              id: String(diaryEntries.length + 1),
                              date: entry.date || '2026-06-25',
                              text: entry.text || '',
                              mood: entry.mood || 'peace',
                              photoUrl: entry.photoUrl
                            };
                            setDiaryEntries([...diaryEntries, fresh]);
                            setProfile(prev => ({ ...prev, streak: prev.streak + 1 }));
                          }}
                          streak={profile.streak}
                        />
                      )}

                      {activeTab === 'coach' && (
                        <CoachChat 
                          messages={chatMessages}
                          onSendMessage={(text) => {
                            const newMsg: ChatMessage = {
                              id: String(chatMessages.length + 1),
                              sender: 'user',
                              text,
                              timestamp: '오후 12:45'
                            };
                            setChatMessages(prev => [...prev, newMsg]);
                          }}
                          onOptimizeSchedule={() => handleApplyProposal('balanced')}
                        />
                      )}

                      {activeTab === 'summary' && (
                        <DailySummaryReport 
                          streak={profile.streak}
                          eventsCount={events.length}
                          diaryText={diaryEntries[diaryEntries.length - 1]?.text || ''}
                        />
                      )}

                      {activeTab === 'profile' && (
                        <UserProfileView 
                          profile={profile}
                          onLogout={() => {
                            setCurrentScreen('Splash');
                            setActiveTab('schedule');
                          }}
                          onTogglePremium={handleTogglePremium}
                          onNavigateToSync={() => {
                            setCurrentScreen('CalendarSync');
                          }}
                          onUpdateProfile={onUpdateProfile}
                          eventsCount={events.length}
                          diaryCount={diaryEntries.length}
                        />
                      )}
                    </div>

                    {/* Unified Mobile Bottom Navigation Tab Bar */}
                    <nav className="absolute bottom-0 left-0 w-full z-50 h-18 bg-[var(--theme-card)]/95 backdrop-blur-lg border-t border-[var(--theme-border)]/30 flex justify-around items-center px-2 pb-2">
                      <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'schedule' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <Calendar className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_schedule || '일정'}</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('stress')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'stress' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <Brain className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_stress || '스트레스'}</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('diary')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'diary' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <Heart className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_diary || '일기'}</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('coach')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'coach' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <Bot className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_coach || '코치'}</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('summary')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'summary' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_summary || '요약'}</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === 'profile' ? 'text-[var(--theme-primary)] font-bold' : 'text-[var(--theme-secondary)]'}`}
                      >
                        <User className="w-4.5 h-4.5" />
                        <span className="text-[9px] mt-0.5">{translations[profile.language || 'ko']?.tab_profile || '계정'}</span>
                      </button>
                    </nav>
                  </div>
                )}

                {currentScreen === 'AddEvent' && (
                  <AddEventForm 
                    currentDay={currentDay}
                    onCancel={() => setCurrentScreen('MainTabs')}
                    onAddEvent={handleAddEvent}
                  />
                )}
              </div>

              {/* Bottom device pill bar indicator */}
              <div className="h-5 flex items-center justify-center bg-[var(--theme-bg)]/90 z-[95] pointer-events-none">
                <div className="w-24 h-1.5 bg-[var(--theme-text)]/40 rounded-full mb-1" />
              </div>

            </div>
          </div>
        </div>

        

      </div>

    </div>
  );
}

// Sub-icons mimicking hardware status
function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-neutral-800 stroke-[2] fill-none">
      <path d="M5 12.5a10 10 0 0 1 14 0" strokeLinecap="round" />
      <path d="M8.5 16a5 5 0 0 1 7 0" strokeLinecap="round" />
      <path d="M12 19.5h.01" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-neutral-800 stroke-[2] fill-none">
      <rect x="3" y="6" width="15" height="12" rx="3" />
      <path d="M21 10v4" strokeLinecap="round" />
      <rect x="5" y="8" width="8" height="8" rx="1.5" className="fill-neutral-800" />
    </svg>
  );
}

function msgToAppendDiary(text: string): string {
  // Simple safety sanitizer for dairy logs
  return text.trim();
}
