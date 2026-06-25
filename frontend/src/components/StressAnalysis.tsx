import React, { useState } from 'react';
import { Sparkles, TrendingUp, Info, Activity, ShieldAlert, Zap, Coffee, HelpCircle, HeartPulse, Check } from 'lucide-react';
import { RebalanceProposal } from '../types';

interface StressAnalysisProps {
  onApplyProposal: (proposal: RebalanceProposal) => void;
  activeProposal: RebalanceProposal;
  eventsCount: number;
  fixedCount: number;
}

export default function StressAnalysis({ onApplyProposal, activeProposal, eventsCount, fixedCount }: StressAnalysisProps) {
  const [selectedProp, setSelectedProp] = useState<RebalanceProposal>(activeProposal);
  const [showAppliedToast, setShowAppliedToast] = useState(false);

  // Dynamic values depending on current events ratio
  const densityPercent = eventsCount > 8 ? 85 : eventsCount > 5 ? 65 : 45;
  const fixedPercent = eventsCount > 0 ? Math.round((fixedCount / eventsCount) * 100) : 40;
  
  // Calculate stress score based on active proposal and event density
  let burnoutScore = 68;
  if (activeProposal === 'balanced') burnoutScore = 42;
  if (activeProposal === 'recovery') burnoutScore = 28;
  if (activeProposal === 'sprint') burnoutScore = 55;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyProposal(selectedProp);
    setShowAppliedToast(true);
    setTimeout(() => {
      setShowAppliedToast(true);
      // Wait a moment and fade toast
      setTimeout(() => setShowAppliedToast(false), 2000);
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#f8faf0] relative overflow-y-auto custom-scrollbar pb-24">
      <div className="px-6 pt-4 space-y-6">
        
        {/* Title Block */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#346823] tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Prediction Engine
          </p>
          <h2 className="text-xl font-bold text-[#191d17]">미래 일정 스트레스 지수</h2>
          <p className="text-xs text-[#72796c] leading-relaxed">
            향후 7일간의 일정을 분석하여 예측한 스트레스 흐름입니다. 급격한 상승이 예상되는 구간에 유의하세요.
          </p>
        </div>

        {/* Future Stress Graph (Smooth SVG curve) */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#346823]/10 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <span className="bg-[#346823] text-white px-2.5 py-1 rounded-full text-[10px] font-bold">7일 전망</span>
              <span className="bg-[#edefe5] text-[#72796c] px-2.5 py-1 rounded-full text-[10px] font-bold">24시간 상세</span>
            </div>
            <div className="flex gap-3 text-[10px] text-[#72796c] font-bold">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#346823]" /> 예측치</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" /> 피크 구간</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-44 w-full relative">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="stressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.15" />
                  <stop offset="60%" stopColor="#346823" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#346823" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#346823" />
                  <stop offset="45%" stopColor="#346823" />
                  <stop offset="65%" stopColor="#ba1a1a" />
                  <stop offset="85%" stopColor="#346823" />
                  <stop offset="100%" stopColor="#346823" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="#d4e0c3" strokeDasharray="4 4" x1="0" x2="400" y1="30" y2="30" opacity="0.5" />
              <line stroke="#d4e0c3" strokeDasharray="4 4" x1="0" x2="400" y1="80" y2="80" opacity="0.5" />
              <line stroke="#d4e0c3" strokeDasharray="4 4" x1="0" x2="400" y1="130" y2="130" opacity="0.5" />

              {/* Stress Curve Fill Area */}
              <path d="M 0,110 C 50,105 80,125 120,115 C 160,105 200,45 240,35 C 280,25 320,95 360,85 L 400,75 L 400,150 L 0,150 Z" fill="url(#stressGrad)" />
              
              {/* Stress Curve Line */}
              <path d="M 0,110 C 50,105 80,125 120,115 C 160,105 200,45 240,35 C 280,25 320,95 360,85 L 400,75" fill="none" stroke="url(#chartLineGrad)" strokeWidth="3.5" strokeLinecap="round" />

              {/* Peak Highlight Circle */}
              <circle cx="240" cy="35" r="5" fill="#ba1a1a" className="animate-ping" />
              <circle cx="240" cy="35" r="4" fill="#ba1a1a" />

              {/* Peak Annotation Label */}
              <g transform="translate(240, 20)">
                <rect x="-35" y="-18" width="70" height="15" rx="7" fill="#ba1a1a" />
                <text x="0" y="-8" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">목요일 Peak</text>
              </g>
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 text-[10px] text-[#72796c] font-bold px-1">
              <span>오늘</span>
              <span>내일</span>
              <span>수</span>
              <span className="text-[#ba1a1a]">목</span>
              <span>금</span>
              <span>토</span>
              <span>일</span>
            </div>
          </div>

          {/* Stress Warning Banner */}
          <div className="mt-4 p-3 bg-[#f3f5eb] rounded-2xl border border-[#c1c9b9]/30 flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-[#346823] mt-0.5" />
            <p className="text-[11px] text-[#42493d] leading-relaxed">
              목요일 오후 2시경 집중 일정이 조밀해지며 피크 스트레스(<span className="font-bold text-[#ba1a1a]">82%</span>)가 예상됩니다. 일정을 분산할 것을 권장합니다.
            </p>
          </div>
        </div>

        {/* Burnout Risk & Risk Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Burnout Radial Gauge */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#346823]/10 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-[10px] font-bold text-[#72796c] uppercase">AI Burnout Risk</span>
            
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Radial Circle */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" fill="transparent" stroke="#edefe5" strokeWidth="7" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  fill="transparent" 
                  stroke={burnoutScore > 50 ? '#ba1a1a' : '#346823'} 
                  strokeWidth="7" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 - (301.6 * burnoutScore) / 100}
                  strokeLinecap="round" 
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${burnoutScore > 50 ? 'text-[#ba1a1a]' : 'text-[#346823]'}`}>
                  {burnoutScore}%
                </span>
                <span className="text-[8px] text-[#72796c] font-semibold">위험 지수</span>
              </div>
            </div>

            <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${
              burnoutScore > 60 
                ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse' 
                : 'bg-[#caecbb] text-[#1e510f]'
            }`}>
              {burnoutScore > 60 ? 'Elevated Risk' : 'Healthy Rhythm'}
            </span>
          </div>

          {/* Risk Factors Breakdown */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#346823]/10 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-[#72796c] uppercase">Rhythm Breakdown</span>
            
            <div className="space-y-2 text-xs">
              {[
                { name: '수면 부족 (Sleep Debt)', value: 'High', color: 'text-[#ba1a1a] font-bold' },
                { name: '일정 밀도 (Schedule Density)', value: `${densityPercent}%`, color: 'text-[#42493d]' },
                { name: '고정 일정 비중 (Fixed Ratio)', value: `${fixedPercent}%`, color: 'text-[#42493d]' },
                { name: '회복 지연 (Rest Deficiency)', value: 'Moderate', color: 'text-[#346823] font-bold' },
              ].map((factor, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-[#f3f5eb]/50 rounded-xl border border-[#c1c9b9]/20">
                  <span className="text-[#42493d]">{factor.name}</span>
                  <span className={factor.color}>{factor.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Choose Your Rhythm (Proposal Panel) */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#191d17]">Choose Your Rhythm (AI 최적화 플랜)</h3>
            <p className="text-[11px] text-[#72796c]">스트레스 구간을 재배치할 플랜을 선택하고 적용해 보세요.</p>
          </div>

          <form onSubmit={handleApply} className="space-y-3">
            {[
              { 
                id: 'balanced', 
                title: 'Balanced Focus', 
                desc: '스트레스를 고르게 분산하여 최적화합니다.', 
                tag: 'Recommended', 
                tagStyle: 'bg-[#346823] text-white',
                moves: '2개 일정 분산',
                bonus: '15분 브레이크 확보',
                icon: <Activity className="w-4 h-4 text-[#346823]" />
              },
              { 
                id: 'sprint', 
                title: 'Morning Sprint', 
                desc: '오전에 중요 집중 일정을 몰아 오후를 비웁니다.', 
                tag: 'Efficient', 
                tagStyle: 'bg-[#caecbb] text-[#1e510f]',
                moves: '오전 고밀도 처리',
                bonus: '오후 3시간 휴식',
                icon: <Zap className="w-4 h-4 text-[#346823]" />
              },
              { 
                id: 'recovery', 
                title: 'Calm Recovery', 
                desc: '휴식 세션을 추가하고 과제를 내일로 연기합니다.', 
                tag: 'Restorative', 
                tagStyle: 'bg-[#dbe7ca] text-[#404a35]',
                moves: '과제 연기 제안',
                bonus: '5개 힐링 브레이크',
                icon: <Coffee className="w-4 h-4 text-[#346823]" />
              },
            ].map((prop) => {
              const checked = selectedProp === prop.id;
              const applied = activeProposal === prop.id;
              return (
                <label key={prop.id} className="block relative cursor-pointer">
                  <input 
                    type="radio" 
                    name="proposal" 
                    checked={checked}
                    onChange={() => setSelectedProp(prop.id as any)}
                    className="sr-only" 
                  />
                  <div className={`p-4.5 rounded-[22px] border-2 transition-all ${
                    checked 
                      ? 'border-[#346823] bg-[#346823]/5' 
                      : 'border-[#c1c9b9]/20 bg-white hover:bg-[#edefe5]/50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${prop.tagStyle}`}>
                        {prop.tag}
                      </span>
                      {prop.icon}
                    </div>
                    <h4 className="text-sm font-bold text-[#191d17]">{prop.title}</h4>
                    <p className="text-[11px] text-[#72796c] mt-1 leading-relaxed">{prop.desc}</p>
                    
                    <div className="flex gap-4 mt-3 text-[10px] text-[#346823] font-bold">
                      <span className="flex items-center gap-1">⏱ {prop.moves}</span>
                      <span className="flex items-center gap-1">☕️ {prop.bonus}</span>
                    </div>

                    {applied && (
                      <div className="absolute top-4 right-4 text-[#346823] flex items-center gap-1">
                        <span className="text-[9px] font-bold">적용됨</span>
                        <Check className="w-4 h-4 fill-[#346823] text-white" />
                      </div>
                    )}
                  </div>
                </label>
              );
            })}

            {/* Plan apply trigger button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#346823] text-white font-bold text-sm rounded-full shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>이 리듬 플랜으로 최적화 적용</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Applied Success Toast */}
      {showAppliedToast && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300">
          <div className="bg-[#2e312b] text-[#f0f2e8] px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b7f39d] animate-spin" />
            <span className="text-xs font-semibold">일정 리듬이 최적화되었습니다!</span>
          </div>
        </div>
      )}
    </div>
  );
}
