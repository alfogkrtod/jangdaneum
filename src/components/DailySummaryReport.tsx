import React from 'react';
import { Award, Timer, Brain, Moon, Download, Share2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DailySummaryReportProps {
  streak: number;
  eventsCount: number;
  diaryText: string;
}

export default function DailySummaryReport({ streak, eventsCount, diaryText }: DailySummaryReportProps) {
  // Dynamic completed tasks ratio simulation
  const completedTasks = eventsCount > 0 ? Math.max(1, eventsCount - 1) : 7;
  const totalTasks = eventsCount > 0 ? eventsCount + 1 : 9;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#f8faf0] relative overflow-y-auto custom-scrollbar pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#cfe9b9]/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="px-6 pt-4 space-y-6">
        
        {/* Banner Welcome */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-[#caecbb] text-[#1e510f] rounded-full text-xs font-bold animate-pulse">
            <Award className="w-4 h-4" />
            <span>오늘의 여정 완료</span>
          </div>
          <h2 className="text-xl font-bold text-[#191d17]">하루 일정 종합 보고서</h2>
          <p className="text-xs text-[#72796c]">2026년 6월 25일, 당신의 리듬이 아주 조화로웠습니다.</p>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Progress Card */}
          <div className="bg-white/80 border border-[#c1c9b9]/30 rounded-3xl p-4 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#72796c] uppercase">Tasks Progress</p>
                <h4 className="text-base font-bold text-[#191d17] mt-1">{completedTasks} / {totalTasks} 완료</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#c7e9b9] flex items-center justify-center text-[#346823]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="w-full bg-[#edefe5] rounded-full h-2 overflow-hidden">
                <div className="bg-[#346823] h-full rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="text-[10px] text-[#72796c]">목표의 {completionRate}%를 달성했습니다!</p>
            </div>
          </div>

          {/* Deep Focus Card */}
          <div className="bg-white/80 border border-[#c1c9b9]/30 rounded-3xl p-4 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#72796c] uppercase">Deep Focus</p>
                <h4 className="text-base font-bold text-[#191d17] mt-1">3h 20m</h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#c7e9b9] flex items-center justify-center text-[#346823]">
                <Timer className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-end gap-1 h-10 pt-1">
              <div className="bg-[#346823]/10 w-full h-2 rounded-t-sm" />
              <div className="bg-[#346823]/30 w-full h-4 rounded-t-sm" />
              <div className="bg-[#346823]/50 w-full h-8 rounded-t-sm animate-pulse" />
              <div className="bg-[#346823] w-full h-10 rounded-t-sm" />
              <div className="bg-[#346823]/20 w-full h-1.5 rounded-t-sm" />
            </div>
          </div>

          {/* Average Stress Level */}
          <div className="bg-white/80 border border-[#c1c9b9]/30 rounded-3xl p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#caecbb] flex items-center justify-center text-[#1e510f]">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#72796c] uppercase">Avg. Stress</p>
                <h4 className="text-sm font-bold text-[#191d17]">45 / 100</h4>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-[#edefe5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#346823] to-[#ba1a1a] h-full" style={{ width: '45%' }} />
              </div>
              <div className="flex justify-between text-[9px] text-[#72796c] font-bold">
                <span>Low</span>
                <span>Optimal</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="bg-white/80 border border-[#c1c9b9]/30 rounded-3xl p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#caecbb] flex items-center justify-center text-[#1e510f]">
                <Moon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#72796c] uppercase">Sleep Quality</p>
                <h4 className="text-sm font-bold text-[#191d17]">Excellent (88점)</h4>
              </div>
            </div>

            <div className="flex gap-1">
              <span className="bg-[#edefe5] text-[#42493d] px-2 py-0.5 rounded text-[9px] font-bold">7h 45m 수면</span>
              <span className="bg-[#edefe5] text-[#42493d] px-2 py-0.5 rounded text-[9px] font-bold">깊은수면 2h</span>
            </div>
          </div>
        </div>

        {/* AI Daily Insight Section */}
        <section className="space-y-3">
          <div className="bg-[#346823] text-[#f8ffef] p-5 rounded-[28px] shadow-md relative overflow-hidden flex flex-col md:flex-row gap-5 items-center">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
              <Sparkles className="w-full h-full text-white" />
            </div>

            {/* Dew drop leaf macro image */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white/20 shrink-0">
              <img 
                className="w-full h-full object-cover" 
                alt="Dew leaf" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaszF_k2QoGvQiKqXygOz3NTw8d6Qm74hZE8HD1V6FECVyLJb9OYhrGdHXsqQ1bq_WeSFjhE4k6kZhcCsVwfx0IPz3hKe_348QwJHc1Lj8Gv43fABZTfPGmfIQElg3s81B9Lxe_ekCdAz3AWJqAmu-5AOQ07bIWHTXzZrClN8PXbNeUH_si9kMz7GkLg5jkK0jEu28vDWN3t-YoG3xvaeW5hQ1NtUvEukOGmcFasW-cVGII4nlPvHaPNwlz8BxxFJ2pC23S7JwuBBm" 
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[#b7f39d] font-bold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Circadian Insight</span>
              </div>
              <p className="text-xs text-white/95 leading-relaxed italic">
                "오늘 오후 2시경의 깊은 집중(Deep Focus)이 전체 성과를 이끌었습니다. 창의적인 작업은 이 시간대에 고정하고, 오전에는 가벼운 체크리스트를 처리하는 것이 귀하의 바이오리듬에 가장 적합해 보입니다."
              </p>
            </div>
          </div>
        </section>

        {/* Saved Diary Reference */}
        {diaryText && (
          <div className="bg-white/60 border border-[#c1c9b9]/20 p-4 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-bold text-[#72796c] uppercase">오늘 기록한 일기</span>
            <p className="text-xs text-[#191d17] leading-relaxed line-clamp-3 italic">
              "{diaryText}"
            </p>
          </div>
        )}

        {/* Action triggers */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button 
            onClick={() => alert('PDF report download successfully started!')}
            className="w-full h-12 bg-[#346823] text-white font-bold text-xs rounded-full shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>보고서 다운로드 (PDF)</span>
          </button>
          
          <button 
            onClick={() => alert('Coaching report link copied to clipboard!')}
            className="w-full h-12 bg-transparent border-2 border-[#346823] text-[#346823] font-bold text-xs rounded-full hover:bg-[#346823]/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>성과 공유하기</span>
          </button>
        </div>

      </div>
    </div>
  );
}
