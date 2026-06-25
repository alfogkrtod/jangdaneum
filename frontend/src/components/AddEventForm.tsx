import React, { useState } from 'react';
import { Calendar, Clock, Lock, Sparkles, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { CalendarEvent, EventType } from '../types';

interface AddEventFormProps {
  onAddEvent: (event: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  currentDay: string;
}

export default function AddEventForm({ onAddEvent, onCancel, currentDay }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('fixed');
  const [date, setDate] = useState(currentDay);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('60');
  const [description, setDescription] = useState('');
  const [repeatDays, setRepeatDays] = useState<string[]>(['Wed']);
  const [category, setCategory] = useState<'hardworking' | 'learning' | 'break'>('hardworking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title,
      type,
      date,
      time,
      duration: parseInt(duration) || 60,
      description,
      category
    });
  };

  const toggleRepeatDay = (day: string) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#f8faf0] relative overflow-y-auto custom-scrollbar pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#346823]/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="px-6 pt-4 flex justify-between items-center h-12">
        <button 
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#edefe5]/50 transition-colors active:scale-90"
        >
          <ArrowLeft className="w-5 h-5 text-[#346823]" />
        </button>
        <h2 className="text-base font-bold text-[#346823]">일정 추가</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-4 space-y-5">
        
        {/* Visual Hero Block */}
        <div className="relative h-28 rounded-2xl overflow-hidden bg-white/60 border border-[#346823]/10 shadow-sm flex items-center px-5 gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c7e9b9] flex items-center justify-center text-[#346823] shrink-0 shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#346823]">New Event Entry</p>
            <h3 className="text-sm font-bold text-[#191d17]">당신의 하루에 리듬을 더하세요.</h3>
          </div>
        </div>

        {/* Event Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#42493d] ml-1">일정 이름</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-[#c1c9b9]/50 rounded-xl text-xs outline-none focus:border-[#346823] focus:ring-4 focus:ring-[#346823]/5 transition-all text-[#191d17]" 
            placeholder="예: 매주 수학 공부, 요가 세션"
            required
          />
        </div>

        {/* Event Type Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#42493d] ml-1">일정 유형</label>
          <div className="grid grid-cols-2 gap-2 bg-[#edefe5] border border-[#c1c9b9]/30 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('fixed')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'fixed' 
                  ? 'bg-white shadow-sm text-[#346823]' 
                  : 'text-[#42493d]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>고정 일정</span>
            </button>
            <button
              type="button"
              onClick={() => setType('flexible')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'flexible' 
                  ? 'bg-white shadow-sm text-[#346823]' 
                  : 'text-[#42493d]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>유동 일정</span>
            </button>
          </div>
          <div className="px-1 pt-1 flex items-start gap-1.5 text-[10px] text-[#72796c] leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 text-[#346823]/60 shrink-0 mt-0.5" />
            <p>
              {type === 'fixed' 
                ? '고정 일정은 AI가 시간 조정을 건드리지 않습니다. 시험, 면접 등 고정된 과업에 선택하세요.'
                : '유동 일정은 AI 분석에 따라 번아웃을 최소화하도록 유동적인 시간대 조정을 추천해 줍니다.'
              }
            </p>
          </div>
        </div>

        {/* Event Category Choice */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#42493d] ml-1">일정 성격 (뇌파 웰빙 구분)</label>
          <div className="grid grid-cols-3 gap-2 bg-[#edefe5] border border-[#c1c9b9]/30 p-1 rounded-xl">
            {[
              { id: 'hardworking', label: '🔥 집중 시간' },
              { id: 'learning', label: '📚 배움 시간' },
              { id: 'break', label: '🍃 휴식 시간' }
            ].map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    active 
                      ? 'bg-white shadow-sm text-[#346823]' 
                      : 'text-[#42493d]'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#42493d] ml-1">날짜</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c1c9b9]/50 rounded-xl text-xs outline-none focus:border-[#346823] text-[#191d17]" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#42493d] ml-1">시작 시간</label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#c1c9b9]/50 rounded-xl text-xs outline-none focus:border-[#346823] text-[#191d17]" 
            />
          </div>
        </div>

        {/* Event Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#42493d] ml-1">소요 시간 (분 단위)</label>
          <div className="grid grid-cols-4 gap-2">
            {['30', '60', '90', '120'].map((dur) => {
              const active = duration === dur;
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    active 
                      ? 'border-[#346823] bg-[#346823]/5 text-[#346823]' 
                      : 'border-[#c1c9b9]/20 bg-white hover:bg-[#edefe5]'
                  }`}
                >
                  {dur}분
                </button>
              );
            })}
          </div>
        </div>

        {/* Recurrence Repeat Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#42493d] ml-1">반복 설정 (요일 선택)</label>
          <div className="bg-white/80 border border-[#c1c9b9]/30 rounded-2xl p-4 flex justify-between gap-1.5">
            {[
              { id: 'Mon', name: '월' },
              { id: 'Tue', name: '화' },
              { id: 'Wed', name: '수' },
              { id: 'Thu', name: '목' },
              { id: 'Fri', name: '금' },
              { id: 'Sat', name: '토' },
              { id: 'Sun', name: '일' },
            ].map((day) => {
              const active = repeatDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleRepeatDay(day.id)}
                  className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    active 
                      ? 'bg-[#346823] text-white shadow-sm' 
                      : 'border border-[#c1c9b9]/30 text-[#72796c] hover:bg-[#edefe5]'
                  }`}
                >
                  {day.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Memo Notes Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#42493d] ml-1">메모 (선택)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-3.5 bg-white border border-[#c1c9b9]/50 rounded-xl text-xs outline-none focus:border-[#346823] focus:ring-4 focus:ring-[#346823]/5 transition-all text-[#191d17] resize-none" 
            placeholder="일정에 대한 추가 메모나 장소를 적어보세요..."
          />
        </div>

      </form>

      {/* Save Button */}
      <div className="p-6 bg-gradient-to-t from-[#f8faf0] via-[#f8faf0] to-transparent pt-12 z-40">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={`w-full h-12 text-white font-bold text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
            title.trim() 
              ? 'bg-[#346823] hover:brightness-110 active:scale-[0.98]' 
              : 'bg-[#72796c]/40 cursor-not-allowed shadow-none'
          }`}
        >
          <span>저장하기</span>
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
