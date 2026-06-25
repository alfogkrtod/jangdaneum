import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, Sparkles, Smile, RefreshCw, Moon } from 'lucide-react';
import { ChatMessage } from '../types';

interface CoachChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOptimizeSchedule: () => void;
}

export default function CoachChat({ messages, onSendMessage, onOptimizeSchedule }: CoachChatProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText('');

    // Simulate AI Coaching response based on query keywords
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "당신의 생체 리듬 분석에 따르면 목요일 오후 2시~4시가 집중력이 최고조인 구간입니다. 이때 복잡한 작업을 배치하고, 4시 반에는 15분 스트레칭 휴식을 취하는 것이 피로 누적을 막는 데 매우 효과적입니다.";
      const textLower = inputText.toLowerCase();
      
      if (textLower.includes('sleep') || textLower.includes('잠') || textLower.includes('수면')) {
        replyText = "지난밤 수면 시간이 4.5시간으로 매우 부족한 상태입니다. 오늘 오후 3시 경 뇌 인지 부하가 급증하여 스트레스 지수가 82%까지 오를 수 있으니, 무리한 집중보다 15분 명상 산책을 적용하시는 걸 추천해요.";
      } else if (textLower.includes('stress') || textLower.includes('스트레스') || textLower.includes('일정')) {
        replyText = "목요일의 전략 기말시험 일정은 중요한 고정 일과입니다. 이를 건드리지 않는 선에서, 저녁의 유동 세미나 일정을 금요일 오후로 연기하면 번아웃 위험도가 68%에서 32%로 안전하게 하락합니다. 스케줄을 최적화해 드릴까요?";
      }

      onSendMessage(replyText);
    }, 1500);
  };

  const handleChipClick = (text: string) => {
    onSendMessage(text);
    if (text.includes('최적화') || text.includes('Yes')) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage("좋습니다! 목요일 저녁 세미나를 금요일 오후로 최적화 연동하였습니다. 일정 화면에서 재조정된 Rhythmic Schedule을 확인하실 수 있습니다. ✨");
        onOptimizeSchedule();
      }, 1200);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage("무엇이든 물어보세요! 당신의 캘린더, 수면 패턴, 일기 감정 분석 결과를 결합하여 최상의 에너지 가이드를 준비해 두었습니다.");
      }, 1200);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#f8faf0] relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-12 left-[-60px] w-48 h-48 bg-[#346823]/5 rounded-full filter blur-[40px] pointer-events-none" />

      {/* Messages Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar pb-32"
      >
        <div className="flex justify-center">
          <span className="bg-[#edefe5] border border-[#c1c9b9]/20 px-3.5 py-1 rounded-full text-[10px] font-bold text-[#72796c] uppercase">
            Today, June 25
          </span>
        </div>

        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-1 max-w-[85%] ${isAI ? 'items-start mr-auto' : 'items-end ml-auto'}`}
            >
              {isAI && (
                <div className="flex items-center gap-1.5 ml-1 mb-0.5">
                  <div className="w-5.5 h-5.5 rounded-lg bg-[#346823] flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-[#346823] uppercase">장단 AI 코치</span>
                </div>
              )}

              <div className={`px-4.5 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                isAI 
                  ? 'bg-white text-[#191d17] rounded-tl-none border border-[#c1c9b9]/20' 
                  : 'bg-[#346823] text-white rounded-tr-none'
              }`}>
                <p>{msg.text}</p>
              </div>
              <span className="text-[9px] text-[#72796c] px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Embedded Sleep Metric Card inside message stream for high realism */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-[#346823]/10 shadow-sm space-y-3 z-10 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#42493d]">
              <Moon className="w-4 h-4 text-[#346823]" />
              <span>수면 분석 (Sleep Rhythm)</span>
            </div>
            <span className="text-[10px] font-bold text-[#ba1a1a]">-45% 수면 빚 경고</span>
          </div>

          <div className="h-16 w-full flex items-end gap-1 px-1">
            {[75, 80, 90, 42, 0, 0, 0].map((val, i) => (
              <div key={i} className="flex-1 bg-[#edefe5] h-full rounded-t-md relative overflow-hidden">
                {val > 0 && (
                  <div 
                    className={`absolute bottom-0 w-full transition-all duration-1000 ${val < 50 ? 'bg-[#ba1a1a] animate-pulse' : 'bg-[#346823]/40'}`} 
                    style={{ height: `${val}%` }} 
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[9px] text-[#72796c] px-1 font-bold">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span className="text-[#346823]">Thu (오늘)</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex items-center gap-2 max-w-[85%]">
            <div className="w-5.5 h-5.5 rounded-lg bg-[#346823] flex items-center justify-center">
              <Bot className="w-3 h-3 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-[#c1c9b9]/20 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center justify-center h-8">
              <span className="w-1.5 h-1.5 bg-[#72796c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[#72796c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[#72796c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Preset Action Toggles */}
      <div className="absolute bottom-[80px] left-0 w-full px-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar z-30 bg-gradient-to-t from-[#f8faf0] via-[#f8faf0]/90 to-transparent pt-4">
        {[
          '예, 일정을 최적화해 주세요.',
          '이대로 고정하겠습니다.',
          '추가 스트레스 완화 팁 보기',
          '오늘 수면 분석 리포트 확인'
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="flex-shrink-0 bg-white/95 border border-[#c1c9b9] hover:bg-[#edefe5] text-[11px] font-bold text-[#42493d] px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#346823]" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="absolute bottom-4 left-0 w-full px-6 z-40">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="flex-grow flex items-center bg-white border border-[#c1c9b9] rounded-2xl px-4 py-2 shadow-sm">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-[#191d17] placeholder:text-[#72796c]/60 p-1.5"
              placeholder="코치에게 고민이나 일과 피로도를 말해 보세요..."
            />
            <button type="button" className="text-[#72796c] hover:text-[#346823] p-1">
              <Smile className="w-4.5 h-4.5" />
            </button>
          </div>

          <button 
            type="submit"
            className="w-11 h-11 bg-[#346823] text-white rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
