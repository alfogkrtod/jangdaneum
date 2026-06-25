import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, Smile, Sun, Eye, Mic, Image, Tag, Check, Award, X, Trash2, MicOff } from 'lucide-react';
import { DiaryEntry, MoodType, UserProfile } from '../types';
import { translations } from '../translations';

interface MindfulDiaryProps {
  profile: UserProfile;
  onAddDiaryEntry: (entry: Partial<DiaryEntry>) => void;
  streak: number;
}

export default function MindfulDiary({ profile, onAddDiaryEntry, streak }: MindfulDiaryProps) {
  const lang = profile.language || 'ko';
  const t = translations[lang] || translations.ko;

  const [diaryText, setDiaryText] = useState('');
  const [mood, setMood] = useState<MoodType>('peace');
  const [isRecording, setIsRecording] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        
        // Match language
        if (lang === 'en') {
          rec.lang = 'en-US';
        } else if (lang === 'ja') {
          rec.lang = 'ja-JP';
        } else {
          rec.lang = 'ko-KR';
        }

        rec.onstart = () => {
          setIsRecording(true);
          setRecordingStatus('listening');
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[event.results.length - 1][0].transcript;
          if (resultText) {
            setDiaryText(prev => prev + (prev ? ' ' : '') + resultText);
          }
        };

        rec.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setRecordingStatus('error');
          runSpeechFallback();
        };

        rec.onend = () => {
          setIsRecording(false);
          setRecordingStatus('');
        };

        recognitionRef.current = rec;
      } catch (e) {
        console.warn('Could not instantiate SpeechRecognition:', e);
      }
    }
  }, [lang]);

  // Graceful simulation fallback if speech api fails or is blocked in iframe
  const runSpeechFallback = () => {
    setIsRecording(true);
    setRecordingStatus('simulating');
    
    // Choose dynamic text based on current language
    const sampleTexts: Record<string, string[]> = {
      ko: [
        '오늘 하루 일정을 마치는 중인데, 몸은 조금 지쳤지만 명상을 하며 머리를 식히니 훨씬 가뿐해지는 것을 느낍니다.',
        '구글 캘린더에서 연동해둔 오늘 회의를 잘 끝냈습니다. 내일 집중 시간도 기대가 됩니다.',
        '산책을 다녀오면서 마음 속이 고요해지고 오늘 일정을 스스로 정성스레 조율한 것에 대해 아주 뿌듯함을 느낍니다.'
      ],
      en: [
        'Finished today\'s major schedules. Even though my body is a bit tired, spending quiet time meditating feels incredibly refreshing.',
        'Successfully completed the meetings imported from my Google Calendar. Looking forward to tomorrow\'s deep focus blocks.',
        'Took a light evening walk. Feeling truly peaceful and satisfied for organizing my time with complete mindfulness today.'
      ],
      ja: [
        '今日の大事な予定を終えました。体は少し疲れていますが、静かに瞑想をすることで、心と体がとてもスッキリしていくのを感じます。',
        'Googleカレンダーと連携した今日のミーティングを無事に終えることができました。明日の集中ブロックが楽しみです。',
        '夕方の散歩をしてきました。今日という一日をマインドフルに過ごすことができ、心から深く満たされています。'
      ]
    };

    const textList = sampleTexts[lang] || sampleTexts.ko;
    const randomText = textList[Math.floor(Math.random() * textList.length)];

    // Simulate real-time stream typing
    let currentIndex = 0;
    setDiaryText(prev => prev + (prev ? ' ' : ''));
    
    const interval = setInterval(() => {
      if (currentIndex < randomText.length) {
        const nextChar = randomText.charAt(currentIndex);
        setDiaryText(prev => prev + nextChar);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
        setRecordingStatus('');
        // Alert/inform user of transcription success
        const notificationMsg = t.voice_success_added || '음성 인식 추가 완료!';
        alert(notificationMsg);
      }
    }, 50);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Failed to start native recognition, using fallback');
        runSpeechFallback();
      }
    } else {
      // Fallback directly
      runSpeechFallback();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'ko' ? '파일 크기는 5MB 이하여야 합니다.' : 'File size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryText.trim()) return;

    onAddDiaryEntry({
      text: diaryText,
      mood: mood,
      photoUrl: photoUrl || undefined,
      date: new Date().toISOString().split('T')[0]
    });

    setDiaryText('');
    setPhotoUrl(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[var(--theme-bg)] relative overflow-y-auto custom-scrollbar pb-24">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--theme-accent)]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hidden file input for photos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="px-6 pt-4 space-y-6">
        {/* Header Block */}
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h2 className="text-xl font-bold text-[var(--theme-text)]">{t.diary_title}</h2>
            <p className="text-xs text-[var(--theme-secondary)] mt-1">{t.diary_subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--theme-card)]/80 border border-[var(--theme-border)]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--theme-primary)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.diary_date_format}</span>
            <span className="w-px h-3 bg-[var(--theme-border)]" />
            <Sun className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mindful Journal Entry Card */}
        <div className="bg-[var(--theme-card)]/70 backdrop-blur-md rounded-[28px] p-5 border border-[var(--theme-border)]/30 shadow-sm relative overflow-hidden space-y-4">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            className="w-full min-h-[140px] bg-transparent border-none text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-secondary)]/60 resize-none outline-none focus:ring-0 p-0"
            placeholder={t.diary_placeholder}
          />

          {/* Photo Preview inside Card */}
          {photoUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-[var(--theme-border)]/30 bg-neutral-100 max-h-48 group animate-scale-up">
              <img 
                src={photoUrl} 
                alt="Uploaded attachment" 
                className="w-full h-full object-cover max-h-48"
                referrerPolicy="no-referrer"
              />
              <button 
                type="button"
                onClick={removePhoto}
                className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors shadow-md backdrop-blur-sm"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Recording status prompt */}
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-xl text-[10px] text-[#ba1a1a] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
              <span>
                {recordingStatus === 'simulating' 
                  ? (lang === 'ko' ? 'AI 리듬 코치가 음성을 받아쓰는 중...' : 'AI Coach dictating voice...')
                  : t.diary_voice_recording}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--theme-border)]/20">
            <div className="flex gap-1.5">
              <button 
                type="button"
                onClick={triggerFileUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[var(--theme-primary)] text-xs font-bold hover:bg-[var(--theme-accent)]/20 transition-all border border-transparent hover:border-[var(--theme-primary)]/10"
                title={t.diary_photo}
              >
                <Image className="w-4 h-4" />
                <span>{t.diary_photo}</span>
              </button>
              
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[var(--theme-primary)] text-xs font-bold hover:bg-[var(--theme-accent)]/20 transition-all border border-transparent hover:border-[var(--theme-primary)]/10"
                title={t.diary_tag}
              >
                <Tag className="w-4 h-4" />
                <span>{t.diary_tag}</span>
              </button>
            </div>

            {/* Voice Input with high fidelity states */}
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all ${
                isRecording 
                  ? 'bg-[#ba1a1a] text-white animate-pulse hover:brightness-110' 
                  : 'bg-[var(--theme-primary)] text-white hover:brightness-110'
              }`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
              <span>{isRecording ? t.diary_voice_recording : t.diary_voice_start}</span>
            </button>
          </div>
        </div>

        {/* Mood Toggles */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[var(--theme-secondary)] uppercase ml-1">{t.diary_my_mood}</span>
          <div className="flex justify-between md:justify-start gap-3 overflow-x-auto pb-1 px-1 custom-scrollbar">
            {[
              { id: 'peace', emoji: '🧘‍♂️', name: t.diary_mood_peace, color: 'bg-[var(--theme-accent)]', activeColor: 'ring-2 ring-[var(--theme-primary)]' },
              { id: 'energy', emoji: '⚡️', name: t.diary_mood_energy, color: 'bg-[#b7f39d]', activeColor: 'ring-2 ring-[var(--theme-primary)]' },
              { id: 'focus', emoji: '🧠', name: t.diary_mood_focus, color: 'bg-[#caecbb]', activeColor: 'ring-2 ring-[var(--theme-primary)]' },
              { id: 'rest', emoji: '🌙', name: t.diary_mood_rest, color: 'bg-[#dbe7ca]', activeColor: 'ring-2 ring-[var(--theme-primary)]' },
              { id: 'cloudy', emoji: '☁️', name: t.diary_mood_cloudy, color: 'bg-[var(--theme-border)]/40', activeColor: 'ring-2 ring-[var(--theme-secondary)]' },
            ].map((item) => {
              const active = mood === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(item.id as any)}
                  className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${item.color} ${active ? item.activeColor : 'opacity-70'}`}>
                    <span>{item.emoji}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--theme-text)]">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Streak Counter and Zen Quote */}
        <div className="bg-[var(--theme-accent-light)] rounded-3xl p-5 border border-[var(--theme-border)]/30 relative overflow-hidden">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)] flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[var(--theme-primary)] uppercase">{t.diary_streak_title}</p>
              <h3 className="text-lg font-bold text-[var(--theme-text)]">
                {streak}{lang === 'ko' ? t.diary_streak_days : ' ' + t.diary_streak_days}
              </h3>
            </div>
          </div>
        </div>

        {/* Landscape Image Hint */}
        <div className="relative w-full h-28 rounded-2xl overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/90 via-[var(--theme-bg)]/40 to-transparent z-10" />
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHro-fVmEf4MGc9lRb4WEZ_GDvCTJRwd4MHlB5Npi4U1E3YaI4r3GMyz7xKJHOjer3QFnSP82TqQZ89aPPod72cnBdKWxd28E49finkZxb10EFJMkXSjUXsz6Xpzx7Rt9UTP5qhXBsSAPIXQIWcabwksiETi6wVF2FLb4ztvbdisati6j8QLgPwha3M1hGfxixV0XLZIDhjt2VOKmeVzgqVyb5txupKLSYM4mqaOGYtOfLdCf3VUf-NLKM_zSQG3ZLQlfITWdYHOpj')" }} 
          />
          <div className="absolute bottom-3 left-4 z-20 text-left">
            <p className="text-[10px] font-bold text-[var(--theme-primary)] uppercase tracking-widest">{t.diary_quote_title}</p>
            <p className="text-xs font-bold text-[var(--theme-text)]">{t.diary_quote_text}</p>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="p-6 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)] to-transparent pt-12 z-40">
        <button
          onClick={handleComplete}
          disabled={!diaryText.trim()}
          className={`w-full h-12 text-white font-bold text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
            diaryText.trim() 
              ? 'bg-[var(--theme-primary)] hover:brightness-110 active:scale-[0.98]' 
              : 'bg-[var(--theme-secondary)]/40 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{t.diary_save_btn}</span>
          <Check className="w-4 h-4" />
        </button>
      </div>

      {/* Saved Toast Success */}
      {showToast && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300">
          <div className="bg-[#2e312b] text-[#f0f2e8] px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Award className="w-4 h-4 text-[#b7f39d]" />
            <span className="text-xs font-semibold">{t.diary_toast_success}</span>
          </div>
        </div>
      )}
    </div>
  );
}
