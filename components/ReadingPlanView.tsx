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
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl animate-fade-in mb-8">
      {/* Dynamic Header */}
      <div className={`${reading.color} p-6 text-white transition-colors duration-500`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Calendar size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Plano de Edificação Anual</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft size={28} />
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold mb-1">{formatDate(selectedDate)}</h2>
              <p className="text-white/60 text-sm font-medium">{reading.description}</p>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="flex bg-black/20 p-1 rounded-2xl backdrop-blur-md overflow-x-auto no-scrollbar">
            {plans.map((p) => (
              <button 
                key={p.id}
                onClick={() => setPlanType(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center
                  ${planType === p.id ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                <p.icon size={14} />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col items-center">
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-8 
            ${planType === ReadingPlanType.COMBINED ? 'bg-emerald-50 text-emerald-700' : 
              planType === ReadingPlanType.CANONICAL ? 'bg-brand-50 text-brand-700' :
              planType === ReadingPlanType.CHRONOLOGICAL ? 'bg-amber-50 text-amber-700' :
              'bg-rose-50 text-rose-700'}`}>
            {reading.title}
          </div>

          {reading.references ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
              {[
                { label: 'História/Lei', ref: reading.references.part1, icon: '📜' },
                { label: 'Graça/Evangelho', ref: reading.references.part2, icon: '✝️' },
                { label: 'Sabedoria', ref: reading.references.part3, icon: '💎' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center hover:border-slate-300 transition-all group">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-lg font-serif font-bold text-slate-800 mb-4">{item.ref}</p>
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => handleAction(item.ref, 'read')} 
                      disabled={isLoading}
                      className="p-2 bg-white rounded-lg shadow-sm text-slate-500 hover:text-brand-600 border border-slate-100 disabled:opacity-50"
                    >
                      {isLoading && activeRef === item.ref + 'read' ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                    </button>
                    <button 
                      onClick={() => handleAction(item.ref, 'explain')} 
                      disabled={isLoading}
                      className="p-2 bg-white rounded-lg shadow-sm text-slate-500 hover:text-brand-600 border border-slate-100 disabled:opacity-50"
                    >
                      {isLoading && activeRef === item.ref + 'explain' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-10 w-full">
              <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-10 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Leitura de Hoje</p>
                <h3 className="text-4xl font-serif text-slate-900 font-bold mb-8">{reading.reference}</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={() => handleAction(reading.reference, 'read')} 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-slate-300 transition-all disabled:opacity-50"
                  >
                    {isLoading && activeRef === reading.reference + 'read' ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                    Ler
                  </button>
                  <button 
                    onClick={() => handleAction(reading.reference, 'explain')} 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading && activeRef === reading.reference + 'explain' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Explicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jornada Anual</span>
            <span className="text-xs font-bold text-slate-600">{progress}% Concluído</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${reading.color.replace('bg-', 'bg-opacity-80 bg-')}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPlanView;