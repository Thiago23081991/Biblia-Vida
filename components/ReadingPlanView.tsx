
import React, { useState } from 'react';
import { getReadingForDate } from '../data/readingPlan';
import { ReadingPlanType } from '../types';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Sparkles, LayoutList, Layers, History, Heart, Loader2 } from 'lucide-react';

interface ReadingPlanViewProps {
  onSelectReference: (ref: string, mode: 'read' | 'explain') => void;
  isLoading: boolean;
}

const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({ onSelectReference, isLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planType, setPlanType] = useState<ReadingPlanType>(ReadingPlanType.COMBINED);
  const [activeRef, setActiveRef] = useState<string | null>(null);
  
  const reading = getReadingForDate(selectedDate, planType);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const handleAction = (ref: string, mode: 'read' | 'explain') => {
    setActiveRef(ref + mode);
    onSelectReference(ref, mode);
  };

  const start = new Date(selectedDate.getFullYear(), 0, 0);
  const diff = (selectedDate.getTime() - start.getTime()) + ((start.getTimezoneOffset() - selectedDate.getTimezoneOffset()) * 60 * 1000);
  const progress = Math.round((Math.floor(diff / (1000 * 60 * 60 * 24)) / 365) * 100);

  const plans = [
    { id: ReadingPlanType.COMBINED, label: 'Mesa Farta', icon: Layers, color: 'emerald' },
    { id: ReadingPlanType.CANONICAL, label: 'Linear', icon: LayoutList, color: 'brand' },
    { id: ReadingPlanType.CHRONOLOGICAL, label: 'Cronologia', icon: History, color: 'amber' },
    { id: ReadingPlanType.REDEMPTIVE, label: 'Coração', icon: Heart, color: 'rose' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in mb-6">
      {/* Date Header Block */}
      <div className={`${reading.color} p-4 md:p-6 text-white transition-colors duration-500`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Calendar size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Leitura Diária</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => changeDate(-1)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
              aria-label="Dia Anterior"
            >
              <ChevronLeft size={24} className="md:w-7 md:h-7" />
            </button>
            <div className="text-center">
              <h2 className="text-xl md:text-3xl font-serif font-bold leading-tight">{formatDate(selectedDate)}</h2>
              <p className="text-white/60 text-[10px] md:text-sm font-medium mt-0.5">{reading.description}</p>
            </div>
            <button 
              onClick={() => changeDate(1)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
              aria-label="Próximo Dia"
            >
              <ChevronRight size={24} className="md:w-7 md:h-7" />
            </button>
          </div>

          {/* Plan Type Selector */}
          <div className="grid grid-cols-4 bg-black/20 p-1 rounded-xl backdrop-blur-sm">
            {plans.map((p) => (
              <button 
                key={p.id}
                onClick={() => setPlanType(p.id)}
                className={`flex flex-col md:flex-row items-center gap-1 py-1.5 md:py-2 rounded-lg text-[8px] md:text-xs font-bold transition-all
                  ${planType === p.id ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                <p.icon size={12} className="md:w-[14px] md:h-[14px]" />
                <span className="hidden xs:inline">{p.label}</span>
                <span className="xs:hidden">{p.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="flex flex-col items-center">
          <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 
            ${planType === ReadingPlanType.COMBINED ? 'bg-emerald-50 text-emerald-700' : 
              planType === ReadingPlanType.CANONICAL ? 'bg-brand-50 text-brand-700' :
              planType === ReadingPlanType.CHRONOLOGICAL ? 'bg-amber-50 text-amber-700' :
              'bg-rose-50 text-rose-700'}`}>
            {reading.title}
          </div>

          {reading.references ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-6">
              {[
                { label: 'História/Lei', ref: reading.references.part1, icon: '📜' },
                { label: 'Graça/Evangelho', ref: reading.references.part2, icon: '✝️' },
                { label: 'Sabedoria', ref: reading.references.part3, icon: '💎' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex md:flex-col items-center justify-between md:justify-center gap-3">
                  <div className="flex items-center md:flex-col gap-3 text-left md:text-center">
                    <span className="text-2xl md:text-3xl md:mb-2">{item.icon}</span>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest md:mb-1">{item.label}</p>
                      <p className="text-sm md:text-lg font-serif font-bold text-slate-800">{item.ref}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(item.ref, 'read')} 
                      disabled={isLoading}
                      className="p-2 bg-white rounded-xl shadow-sm text-slate-500 hover:text-brand-600 border border-slate-100 active:scale-90 transition-all"
                      title="Ler Passagem"
                    >
                      {isLoading && activeRef === item.ref + 'read' ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                    </button>
                    <button 
                      onClick={() => handleAction(item.ref, 'explain')} 
                      disabled={isLoading}
                      className="p-2 bg-white rounded-xl shadow-sm text-slate-500 hover:text-brand-600 border border-slate-100 active:scale-90 transition-all"
                      title="Explicar Passagem"
                    >
                      {isLoading && activeRef === item.ref + 'explain' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-6 w-full">
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-6 md:p-10 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Leitura Recomendada</p>
                <h3 className="text-2xl md:text-4xl font-serif text-slate-900 font-bold mb-6">{reading.reference}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleAction(reading.reference, 'read')} 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 h-12 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-sm"
                  >
                    {isLoading && activeRef === reading.reference + 'read' ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                    <span>Ler</span>
                  </button>
                  <button 
                    onClick={() => handleAction(reading.reference, 'explain')} 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 h-12 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-all shadow-md text-sm"
                  >
                    {isLoading && activeRef === reading.reference + 'explain' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    <span>Explicar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="w-full pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progresso no Plano {reading.title}</span>
              <span className="text-[10px] font-bold text-slate-600">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${reading.color}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPlanView;
