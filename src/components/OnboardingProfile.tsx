import React, { useState, useRef } from 'react';
import { Camera, ArrowRight, Check, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onComplete: () => void;
}

export default function OnboardingProfile({ profile, onUpdateProfile, onComplete }: OnboardingProfileProps) {
  const [name, setName] = useState(profile.name);
  const [motto, setMotto] = useState(profile.motto);
  const [selectedGoal, setSelectedGoal] = useState<'peace' | 'energy' | 'focus' | 'rest'>('focus');
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateProfile({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaultAvatar = () => {
    onUpdateProfile({ avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + encodeURIComponent(name || 'avatar') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, motto });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#f8faf0] relative overflow-y-auto custom-scrollbar">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-[-80px] w-48 h-48 bg-[#b7f39d]/15 rounded-full filter blur-[50px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-80px] w-48 h-48 bg-[#caecbb]/20 rounded-full filter blur-[50px] pointer-events-none" />

      <div className="space-y-6">
        {/* Onboarding Step Tracker */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-8 h-1.5 rounded-full bg-[#346823]" />
          <div className="w-2 h-1.5 rounded-full bg-[#c1c9b9]" />
          <div className="w-2 h-1.5 rounded-full bg-[#c1c9b9]" />
          <span className="text-xs text-[#72796c] font-bold ml-2">Step 2 of 4</span>
        </div>

        {/* Hero Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#191d17] leading-tight">
            환영합니다! <br />나만의 리듬을 설정해 보세요.
          </h2>
          <p className="text-xs text-[#42493d] mt-2 leading-relaxed">
            장단:음은 AI를 통해 당신의 일상에 최적화된 리듬을 찾아드립니다. 프로필을 완성하고 개인화된 경험을 시작하세요.
          </p>
        </div>

        {/* Profile Image Setup */}
        <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-[#346823]/10 shadow-sm flex items-center gap-5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-full bg-[#edefe5] overflow-hidden border-2 border-white shadow-inner flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-8 h-8 text-[#72796c]/40" />
              )}
            </div>
            <button 
              type="button"
              className="absolute bottom-0 right-0 w-6 h-6 bg-[#346823] text-white rounded-full flex items-center justify-center shadow-md border border-white"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#191d17]">프로필 사진</h3>
            <p className="text-[11px] text-[#42493d]">당신을 가장 잘 나타내는 사진을 선택해 주세요.</p>
            <div className="flex gap-2 mt-2">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="px-3 py-1.5 rounded-full border border-[#c1c9b9] text-[11px] font-bold hover:bg-[#edefe5] transition-colors"
              >
                사진 업로드
              </button>
              <button 
                type="button" 
                onClick={resetToDefaultAvatar} 
                className="px-3 py-1.5 rounded-full border border-[#c1c9b9]/40 text-[11px] font-bold text-[#72796c] hover:bg-[#edefe5] transition-colors"
              >
                기본 아바타
              </button>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#42493d] ml-1">이름</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-[#c1c9b9]/50 rounded-xl text-sm outline-none focus:border-[#346823] focus:ring-4 focus:ring-[#346823]/5 transition-all text-[#191d17]" 
              placeholder="김서연"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#42493d] ml-1">나의 한마디 (Motto)</label>
            <textarea 
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              rows={2}
              className="w-full p-3 bg-white border border-[#c1c9b9]/50 rounded-xl text-sm outline-none focus:border-[#346823] focus:ring-4 focus:ring-[#346823]/5 transition-all text-[#191d17] resize-none" 
              placeholder="오늘도 나만의 리듬을 찾아서..."
              required
            />
          </div>

          {/* Goal selection (Bento style goal cards) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-[#42493d] ml-1">나의 웰니스 목표</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'focus', title: '집중 & 몰입', desc: '의사결정과 깊은 공부', color: 'bg-[#346823]' },
                { id: 'peace', title: '평온 & 안정', desc: '스트레스 지수 낮추기', color: 'bg-[#caecbb]' },
                { id: 'energy', title: '활기 & 자극', desc: '활기찬 에너지 찾기', color: 'bg-[#b7f39d]' },
                { id: 'rest', title: '휴식 & 숙면', desc: '회복력과 충분한 잠', color: 'bg-[#dbe7ca]' },
              ].map((goal) => {
                const active = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                      active 
                        ? 'border-[#346823] bg-[#346823]/5 ring-2 ring-[#346823]/10 shadow-sm' 
                        : 'border-[#c1c9b9]/30 bg-white/50 hover:bg-[#edefe5]'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xs font-bold text-[#191d17]">{goal.title}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#346823]" />}
                    </div>
                    <span className="text-[10px] text-[#42493d]/80">{goal.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="w-full h-12 bg-[#346823] text-white font-bold text-sm rounded-full shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>저장 및 계속하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Success Toast Overlay */}
      {showToast && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300">
          <div className="bg-[#2e312b] text-[#f0f2e8] px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b7f39d] animate-spin" />
            <span className="text-xs font-semibold">프로필 설정이 완료되었습니다!</span>
          </div>
        </div>
      )}
    </div>
  );
}
