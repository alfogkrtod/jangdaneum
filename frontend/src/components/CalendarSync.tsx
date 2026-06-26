import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ArrowRight, ShieldCheck, Sparkles, Check, Loader2, X, AlertCircle } from 'lucide-react';
import { UserProfile, CalendarEvent } from '../types';
import { supabase } from '../lib/supabase';

const API_BASE = 'http://localhost:4000';

interface CalendarSyncProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onComplete: () => void;
  onImportEvents?: (imported: CalendarEvent[]) => void;
}

export default function CalendarSync({ profile, onUpdateProfile, onComplete, onImportEvents }: CalendarSyncProps) {
  const [googleConnected, setGoogleConnected] = useState(profile.googleSynced);
  const [appleConnected, setAppleConnected] = useState(profile.appleSynced);
  const [syncing, setSyncing] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);

  useEffect(() => {
    setGoogleConnected(profile.googleSynced);
  }, [profile.googleSynced]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'calendar_connected') {
        refreshProfile();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data?.google_synced) {
      setGoogleConnected(true);
      onUpdateProfile({ googleSynced: true });
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const handleGoogleClick = async () => {
    if (googleConnected) {
      setGoogleConnected(false);
      onUpdateProfile({ googleSynced: false });
      return;
    }

    setAuthLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE}/api/calendar/auth-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const popup = window.open(
        json.data.url,
        'google-calendar-auth',
        'width=600,height=700,left=200,top=100'
      );

      if (!popup) {
        alert('Popup blocked. Please allow popups for this site.');
      }
    } catch (err) {
      console.error('Failed to start Google OAuth:', err);
      alert('Failed to connect Google Calendar. Make sure the backend is running.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('idle');
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE}/api/calendar/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setImportedCount(json.data.imported);
      setSyncStatus('success');

      const resEvents = await fetch(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsJson = await resEvents.json();
      if (eventsJson.success && onImportEvents) {
        onImportEvents(eventsJson.data);
      }
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  const handleAppleClick = () => {
    setAppleConnected(!appleConnected);
    onUpdateProfile({ appleSynced: !appleConnected });
  };

  const handleConnect = async () => {
    if (googleConnected) {
      await handleSync();
    }
    setTimeout(() => onComplete(), 500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#f8faf0] relative overflow-y-auto custom-scrollbar">
      <div className="absolute top-10 right-[-50px] w-56 h-56 bg-[#346823]/5 rounded-full filter blur-[40px] pointer-events-none" />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-2 h-1.5 rounded-full bg-[#c1c9b9]" />
          <span className="text-xs text-[#72796c] font-bold ml-2">Step 3 of 4</span>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className={`absolute inset-0 border border-dashed border-[#c1c9b9] rounded-full ${syncing ? 'animate-spin' : ''}`} style={{ animationDuration: '20s' }} />
            <div className="relative z-10 w-24 h-24 bg-[#346823] rounded-[24px] flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Calendar className="w-11 h-11 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all ${
              googleConnected ? 'bg-[#346823] text-white' : 'bg-[#c7e9b9] text-[#346823]'
            }`}>
              {googleConnected ? (
                <Check className="w-5 h-5" />
              ) : (
                <RefreshCw className={`w-5 h-5 ${authLoading ? 'animate-spin' : ''}`} />
              )}
            </div>
            <div className="absolute -bottom-1 -left-1 w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md ring-4 ring-[#346823]/5">
              <Sparkles className="w-5 h-5 text-[#346823]" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#191d17]">캘린더 연동</h2>
          <p className="text-xs text-[#42493d] max-w-sm mx-auto leading-relaxed">
            Google Calendar를 연동하여 <br />
            AI가 당신의 일상 리듬을 더 정확하게 분석해 드립니다.
          </p>
        </div>

        <div className="space-y-2.5">
          <div
            onClick={handleGoogleClick}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              googleConnected
                ? 'border-[#346823] bg-[#346823]/5 shadow-sm'
                : 'border-[#c1c9b9]/30 bg-white/60 hover:bg-[#edefe5]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
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
                {googleConnected ? 'Google 계정 연동 완료' : '일정 및 작업 실시간 동기화'}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              googleConnected ? 'border-[#346823] bg-[#346823]' : 'border-[#c1c9b9]'
            }`}>
              {googleConnected && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>

          {syncStatus === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {importedCount > 0
                ? `${importedCount}개의 Google 일정이 동기화되었습니다.`
                : '새로운 Google 일정이 없습니다.'}
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              동기화 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}

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

        <div className="flex justify-center gap-2 text-[10px] text-[#72796c] bg-[#edefe5]/50 py-2.5 rounded-xl border border-[#c1c9b9]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#346823] shrink-0" />
          <span>연동된 정보는 전적으로 암호화되며 프라이버시가 보장됩니다.</span>
        </div>
      </div>

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
          disabled={syncing || authLoading}
          className="w-full h-12 bg-[#346823] text-white font-bold text-sm rounded-full shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>동기화하는 중...</span>
            </>
          ) : (
            <>
              <span>{googleConnected ? '동기화 및 계속하기' : '연동 및 계속하기'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
