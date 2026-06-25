import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, MessageCircle, ArrowLeft, Camera, Loader2, UploadCloud, User, CheckCircle2, ChevronRight, RefreshCw, X, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface SplashAndLoginProps {
  onLoginSuccess: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function SplashAndLogin({ onLoginSuccess, onUpdateProfile }: SplashAndLoginProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('example@email.com');
  const [password, setPassword] = useState('password');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Profile Photo State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social Auth Simulator States
  const [socialLoginType, setSocialLoginType] = useState<'NONE' | 'GOOGLE' | 'KAKAO'>('NONE');
  const [socialInnerLoading, setSocialInnerLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<{ active: boolean; provider: 'google' | 'kakao' | 'signup' | null }>({
    active: false,
    provider: null
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Handle Photo Upload via standard FileReader
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
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    }
  };

  // Submit Custom Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!signupEmail.includes('@')) {
      alert('유효한 이메일 주소를 입력해 주세요.');
      return;
    }
    if (signupPassword.length < 4) {
      alert('비밀번호는 4자리 이상이어야 합니다.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setSocialLoading({ active: true, provider: 'signup' });

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { name: signupName } }
    })

    if (error) {
      setSocialLoading({ active: false, provider: null })
      alert(error.message)
      return
    }

    if (photoPreview) {
      onUpdateProfile({
        name: signupName,
        avatar: photoPreview,
        googleSynced: false,
        appleSynced: false
      })
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  };

  // Kakao Login Simulator
  const handleKakaoLogin = () => {
    setSocialLoginType('KAKAO');
    setSocialInnerLoading(false);
  };

  if (showSplash) {
    return (
      <div 
        id="splash-screen"
        className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#f8faf0]"
        onClick={() => setShowSplash(false)}
      >
        {/* Breathing Aura Blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[130%] h-[130%] bg-gradient-to-tr from-[#346823]/5 via-transparent to-[#9cd684]/5 rounded-full filter blur-[80px]" />
        
        {/* Floating Logo Container */}
        <div className="flex flex-col items-center justify-center z-10 text-center animate-fade-in-up">
          <div className="mb-6 relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center animate-bounce duration-1000">
            {/* Outer spinning ring with glow */}
            <div className="absolute inset-0 rounded-full border-2 border-[#346823]/20 animate-spin shadow-[0_0_20px_rgba(52,104,35,0.1)]" style={{ animationDuration: '15s' }} />
            
            {/* Core Logo mimicking yin-yang vine curves */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg flex items-center justify-center p-3 ring-4 ring-[#346823]/5">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#346823] stroke-[6]">
                <path d="M 50,10 A 40,40 0 0,1 90,50 A 20,20 0 0,1 70,70 A 20,20 0 0,0 50,90" strokeWidth="8" strokeLinecap="round" />
                <path d="M 50,90 A 40,40 0 0,1 10,50 A 20,20 0 0,1 30,30 A 20,20 0 0,0 50,10" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                <circle cx="50" cy="50" r="6" fill="#346823" />
              </svg>
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl bg-gradient-to-br from-[#346823] to-[#49663f] bg-clip-text text-transparent font-bold tracking-tight mb-2">
            장단:음
          </h1>
          <p className="text-xs tracking-[0.25em] font-bold text-[#49663f]/80 uppercase mb-8">
            RebalAI
          </p>

          <div className="flex gap-1.5 justify-center mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#346823]/60 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#346823]/40 animate-pulse delay-150" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#346823]/20 animate-pulse delay-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#f8faf0] relative overflow-y-auto custom-scrollbar">
      {/* Floating Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#cfe9b9]/30 rounded-full filter blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-100px] w-64 h-64 bg-[#caecbb]/20 rounded-full filter blur-[60px] pointer-events-none" />

      {/* Social Authentication Loading Overlay */}
      {socialLoading.active && (
        <div className="absolute inset-0 z-50 bg-[#f8faf0]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          {socialLoading.provider === 'kakao' && (
            <div className="space-y-6 max-w-xs">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FEE500] shadow-md flex items-center justify-center">
                <MessageCircle className="w-10 h-10 fill-[#3C1E1E] stroke-[#3C1E1E]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#3C1E1E]">카카오톡 간편 로그인 중</h3>
                <p className="text-xs text-[#72796c] font-semibold">안전한 제3자 개인정보 제공 동의</p>
                <p className="text-[11px] text-[#72796c] leading-relaxed">카카오 계정을 통해 안전한 프로필 설정 및 일간 바이오리듬 트래커를 연동하는 중입니다...</p>
              </div>
              <div className="flex justify-center pt-2">
                <Loader2 className="w-8 h-8 text-[#a38f00] animate-spin" />
              </div>
            </div>
          )}

          {socialLoading.provider === 'signup' && (
            <div className="space-y-6 max-w-xs">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#346823]/10 flex items-center justify-center text-[#346823]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#191d17]">회원 가입 완료 중</h3>
                <p className="text-xs text-[#346823] font-semibold">{signupName}님 반갑습니다!</p>
                <p className="text-[11px] text-[#72796c] leading-relaxed">프로필 사진을 동기화하고 맞춤형 웰니스 케어 솔루션 데이터를 생성하고 있습니다...</p>
              </div>
              <div className="flex justify-center pt-2">
                <Loader2 className="w-8 h-8 text-[#346823] animate-spin" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-4 z-10">
        <div className="w-11 h-11 bg-[#346823] rounded-2xl flex items-center justify-center shadow-md transform -rotate-3 mb-3">
          <Sparkles className="text-white w-5.5 h-5.5" />
        </div>
        <h2 className="text-2xl font-bold text-[#191d17] tracking-tight mb-1">
          {isSignUp ? '장단:음 회원 가입' : '장단:음'}
        </h2>
        <p className="text-xs text-[#42493d]/80">
          {isSignUp ? '나에게 맞는 일상의 리듬과 웰니스를 찾아보세요' : '삶의 리듬을 찾는 여정, RebalAI'}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="bg-white/85 backdrop-blur-md p-5 rounded-3xl border border-[#346823]/10 shadow-sm z-10 my-4 flex-grow flex flex-col justify-center">
        {!isSignUp ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#42493d] ml-1">이메일 주소</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                  placeholder="example@email.com" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-[#42493d]">비밀번호</label>
                <a href="#" className="text-[10px] text-[#346823] font-bold hover:underline" onClick={(e) => e.preventDefault()}>비밀번호 분실?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-4 h-4" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#72796c] hover:text-[#346823] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-11 bg-[#346823] text-white font-bold text-xs rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all mt-2"
            >
              로그인
            </button>

            {/* Toggle to Sign Up */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-xs text-[#42493d] font-semibold hover:text-[#346823] hover:underline"
              >
                아직 계정이 없으신가요? <span className="text-[#346823] font-bold">회원 가입</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c1c9b9]/50" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-white text-[#42493d]/70 rounded-full font-semibold">소셜 계정 로그인</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-1.5 h-10 bg-white border border-[#c1c9b9] rounded-xl hover:bg-[#f3f5eb] transition-all text-[11px] font-bold text-[#191d17]"
              >
                <div className="w-3.5 h-3.5" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyjWmHT6am4HV5V7WQII0DE---xUdWrXtEB45Z-fTrUx6ByRQECQA-ijbeKN4e85ayF38WqOJlSZdCRUV5Fz2lFKQW3PB1UbvCJsPUIsPWHs_SyPAuDEgLBc3_KoVOKTFA9Gxxx94XzDF8NNUddxr3WeQgRix0oOpPfXfnb5RwWn9FGHQ9_RYKQFrDzAxUQisaFY29k0S4AIBb9c9kJbgUrlHVZmivywJsuCIvxpfjYzF76HUtgYN3pkQW5E_oqgCyNqizuZ_pIDoh')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
                Google
              </button>
              <button 
                type="button"
                onClick={handleKakaoLogin}
                className="flex items-center justify-center gap-1.5 h-10 bg-[#FEE500] rounded-xl hover:brightness-105 transition-all text-[11px] font-bold text-[#3C1E1E]"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#3C1E1E] stroke-[#3C1E1E]" />
                카카오톡
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM WITH PROFILE PHOTO UPLOADER */
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setIsSignUp(false)}
                className="text-xs text-[#72796c] hover:text-[#346823] flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                로그인으로 돌아가기
              </button>
              <span className="text-[10px] bg-[#346823]/10 text-[#346823] px-2 py-0.5 rounded-full font-bold">회원 가입</span>
            </div>

            {/* Interactive Photo Upload Container with Drag-and-Drop */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#42493d] ml-1">프로필 사진 등록</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-[#346823] bg-[#346823]/5' 
                    : 'border-[#c1c9b9] hover:border-[#346823]/60 hover:bg-[#f3f5eb]/50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />

                {photoPreview ? (
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#346823] text-white rounded-full flex items-center justify-center border border-white shadow">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-1 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#edefe5] flex items-center justify-center text-[#72796c]">
                      <UploadCloud className="w-5 h-5 text-[#346823]/70" />
                    </div>
                    <span className="text-[10px] font-bold text-[#191d17]">클릭하거나 이미지를 끌어놓으세요</span>
                    <span className="text-[9px] text-[#72796c]">PNG, JPG (최대 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Name input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#42493d] ml-1">이름</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-4 h-4" />
                <input 
                  type="text" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                  placeholder="예: 김서연" 
                  required
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#42493d] ml-1">이메일 주소</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-4 h-4" />
                <input 
                  type="email" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                  placeholder="example@email.com" 
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#42493d] ml-1">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-3.5 h-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-8 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                    placeholder="비밀번호" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#72796c]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#42493d] ml-1">비밀번호 확인</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72796c] w-3.5 h-3.5" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-8 bg-[#f3f5eb] border border-transparent rounded-xl focus:border-[#346823]/30 focus:ring-4 focus:ring-[#346823]/5 transition-all text-xs text-[#191d17] outline-none" 
                    placeholder="비밀번호 확인" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#72796c]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-11 bg-[#346823] text-white font-bold text-xs rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all mt-2"
            >
              회원 가입 완료 및 시작하기
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-1 z-10">
        <p className="text-[10px] text-[#42493d]/80">
          계속 진행함으로써 장단:음의 <span className="underline cursor-pointer font-semibold">이용약관</span> 및 <span className="underline cursor-pointer font-semibold">개인정보방침</span>에 동의하게 됩니다.
        </p>
      </div>

      {/* KakaoTalk Social Login Simulation Overlay (kept as mock for now) */}
      {socialLoginType === 'KAKAO' && (
        <div className="absolute inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FEE500] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-400 flex flex-col text-left text-[#3C1E1E]">
            {/* Header with browser window simulation controls */}
            <div className="bg-[#fcdb00] border-b border-amber-400/20 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] text-[#3C1E1E]/60 font-mono truncate max-w-[180px] select-none">
                kauth.kakao.com/oauth/login
              </span>
              <button 
                type="button"
                onClick={() => setSocialLoginType('NONE')}
                className="text-xs font-bold text-[#3C1E1E] hover:text-black transition-colors"
              >
                취소
              </button>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-center min-h-[380px]">
              {socialInnerLoading ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-[#3C1E1E] animate-spin" />
                  <div>
                    <h4 className="text-sm font-bold text-[#3C1E1E]">카카오 간편 정보 연동 중...</h4>
                    <p className="text-xs text-[#5C3E3E] mt-1">카카오톡 닉네임과 프로필 사진을 가져옵니다.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 w-full">
                  {/* Kakao Logo Header */}
                  <div className="flex items-center justify-center gap-1.5 bg-[#3C1E1E] text-white py-1.5 px-3 rounded-full w-fit mx-auto shadow-sm">
                    <span className="text-xs">💬</span>
                    <span className="text-[10px] font-black uppercase tracking-wider">kakao</span>
                  </div>

                  <div className="text-center">
                    <h3 className="text-base font-bold text-[#3C1E1E]">카카오계정 로그인</h3>
                    <p className="text-xs text-[#5C3E3E] mt-0.5">장단:음(RebalAI)과 카카오 계정을 연동합니다.</p>
                  </div>

                  {/* App Permissions Checklist */}
                  <div className="bg-white/40 border border-[#3C1E1E]/5 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-bold text-[#3C1E1E]/70 uppercase tracking-wider block">제공 항목 및 수집 동의</span>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#3C1E1E] flex items-center justify-center text-white shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        </div>
                        <p className="text-xs text-[#3C1E1E]">
                          프로필 정보 (닉네임, 사진) <span className="text-red-600 font-extrabold text-[9px]">[필수]</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#3C1E1E] flex items-center justify-center text-white shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        </div>
                        <p className="text-xs text-[#3C1E1E]">
                          이메일 (moshim668@gmail.com) <span className="text-red-600 font-extrabold text-[9px]">[필수]</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#3C1E1E] flex items-center justify-center text-white shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[4]" />
                        </div>
                        <p className="text-xs text-[#3C1E1E]">
                          생체 리듬 맞춤형 목표 추천 연동 <span className="text-zinc-600 font-extrabold text-[9px]">[선택]</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSocialInnerLoading(true);
                      setTimeout(() => {
                        onUpdateProfile({
                          name: '카카오 프렌즈',
                          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kakao',
                          googleSynced: false,
                          appleSynced: false
                        });
                        setSocialInnerLoading(false);
                        setSocialLoginType('NONE');
                        onLoginSuccess();
                      }, 1200);
                    }}
                    className="w-full h-11 bg-[#3C1E1E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    동의하고 계속하기
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
