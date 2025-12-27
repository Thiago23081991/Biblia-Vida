
import React, { useState } from 'react';
import { getReadingForDate } from '../data/readingPlan';
import { ReadingPlanType } from '../types';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Sparkles, LayoutList, Layers, History, Heart, Loader2, CalendarCheck, Scroll, Cross, Star } from 'lucide-react';

interface ReadingPlanViewProps {
  onSelectReference: (ref: string, mode: 'read' | 'explain') => void;
  isLoading: boolean;
}

const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({ onSelectReference, isLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planType, setPlanType] = useState<ReadingPlanType>(ReadingPlanType.COMBINED);
  const [activeRef, setActiveRef] = useState<string | null>(null);
  
  const reading = getReadingForDate(selectedDate, planType);
  const today = new Date();
  const isToday = selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth();

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const handleAction = (ref: string, mode: 'read' | 'explain') => {
    setActiveRef(ref + mode);
    onSelectReference(ref, mode);
  };

  // Cálculo de progresso
  const start = new Date(selectedDate.getFullYear(), 0, 0);
  const diff = (selectedDate.getTime() - start.getTime()) + ((start.getTimezoneOffset() - selectedDate.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const progress = Math.round((dayOfYear / 365) * 100);

  const plans = [
    { id: ReadingPlanType.COMBINED, label: 'Mesa Farta', icon: Layers },
    { id: ReadingPlanType.CANONICAL, label: 'Linear', icon: LayoutList },
    { id: ReadingPlanType.CHRONOLOGICAL, label: 'Cronologia', icon: History },
    { id: ReadingPlanType.REDEMPTIVE, label: 'Redenção', icon: Heart },
  ];

  return (
    <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-fade-in flex flex-col relative">
      
      {/* Header com Data e Navegação */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-slate-800/50 to-slate-900 border-b border-slate-800">
        <div className="flex flex-col gap-6">
          {/* Top Row: Label e Botão Hoje */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-400">
              <Calendar size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Leitura Diária</span>
            </div>
            {!isToday && (
              <button 
                onClick={goToToday}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-400/10 text-brand-400 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-brand-400/20 transition-all animate-scale-in"
              >
                <CalendarCheck size={14} /> Voltar para Hoje
              </button>
            )}
          </div>

          {/* Navegador de Data */}
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => changeDate(-1)} 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 active:scale-95 transition-all border border-slate-700"
              aria-label="Dia Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center flex-grow">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">{formatDate(selectedDate)}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                 <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Dia {dayOfYear} de 365</span>
              </div>
            </div>

            <button 
              onClick={() => changeDate(1)} 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 active:scale-95 transition-all border border-slate-700"
              aria-label="Próximo Dia"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Seletor de Tipo de Plano */}
          <div className="flex p-1 bg-slate-950/50 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            {plans.map((p) => {
              const isActive = planType === p.id;
              return (
                <button 
                  key={p.id}
                  onClick={() => setPlanType(p.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-slate-800 text-white shadow-lg shadow-black/20 border border-slate-700' 
                      : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <p.icon size={14} className={isActive ? 'text-brand-400' : ''} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8">
        {/* Conteúdo do Plano */}
        <div className="flex flex-col gap-2">
           <h3 className="text-center text-slate-400 text-xs font-medium max-w-lg mx-auto mb-4">{reading.description}</h3>
           
           {reading.references ? (
             /* Layout "Mesa Farta" - Grid de Cards */
             <div className="grid grid-cols-1 gap-4">
                {/* Antigo Testamento */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-6 group hover:border-slate-700 transition-colors">
                   <div className="w-12 h-12 rounded-2xl bg-blue-900/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-900/30">
                      <Scroll size={24} />
                   </div>
                   <div className="text-center md:text-left flex-grow">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">História & Lei</p>
                      <h4 className="text-xl text-white font-serif font-bold">{reading.references.part1}</h4>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleAction(reading.references!.part1, 'read')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part1 + 'read' ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
                      </button>
                      <button 
                        onClick={() => handleAction(reading.references!.part1, 'explain')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part1 + 'explain' ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                      </button>
                   </div>
                </div>

                {/* Novo Testamento */}
                <div className="bg-slate-950 border border-brand-900/30 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-500/30 transition-colors relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand-500/5 pointer-events-none"></div>
                   <div className="w-12 h-12 rounded-2xl bg-brand-400/20 text-brand-400 flex items-center justify-center shrink-0 border border-brand-400/30 relative z-10">
                      <Cross size={24} />
                   </div>
                   <div className="text-center md:text-left flex-grow relative z-10">
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Evangelho</p>
                      <h4 className="text-xl text-white font-serif font-bold">{reading.references.part2}</h4>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto relative z-10">
                      <button 
                        onClick={() => handleAction(reading.references!.part2, 'read')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part2 + 'read' ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
                      </button>
                      <button 
                        onClick={() => handleAction(reading.references!.part2, 'explain')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-brand-400 text-black hover:bg-brand-500 transition-all shadow-lg shadow-brand-400/20 active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part2 + 'explain' ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                      </button>
                   </div>
                </div>

                {/* Sabedoria */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-6 group hover:border-slate-700 transition-colors">
                   <div className="w-12 h-12 rounded-2xl bg-purple-900/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-900/30">
                      <Star size={24} />
                   </div>
                   <div className="text-center md:text-left flex-grow">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Sabedoria</p>
                      <h4 className="text-xl text-white font-serif font-bold">{reading.references.part3}</h4>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleAction(reading.references!.part3, 'read')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part3 + 'read' ? <Loader2 size={20} className="animate-spin" /> : <BookOpen size={20} />}
                      </button>
                      <button 
                        onClick={() => handleAction(reading.references!.part3, 'explain')}
                        disabled={isLoading}
                        className="flex-1 md:w-12 h-12 flex items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                      >
                         {isLoading && activeRef === reading.references!.part3 + 'explain' ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             /* Layout Padrão (Hero) */
             <div className="bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-50"></div>
                <BookOpen className="absolute -right-6 -bottom-6 text-slate-800/50 w-32 h-32 -rotate-12" />
                
                <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">Leitura de Hoje</p>
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white mb-8 drop-shadow-lg">{reading.reference}</h3>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto relative z-10">
                   <button 
                     onClick={() => handleAction(reading.reference, 'read')}
                     disabled={isLoading}
                     className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs hover:text-white hover:border-brand-400 active:scale-95 transition-all"
                   >
                     {isLoading && activeRef === reading.reference + 'read' ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                     Ler
                   </button>
                   <button 
                     onClick={() => handleAction(reading.reference, 'explain')}
                     disabled={isLoading}
                     className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-brand-400 text-black font-black uppercase tracking-wider text-xs hover:bg-brand-500 shadow-lg shadow-brand-400/20 active:scale-95 transition-all"
                   >
                     {isLoading && activeRef === reading.reference + 'explain' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                     Explicar
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* Barra de Progresso Anual */}
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progresso Anual</span>
              <span className="text-[10px] font-black text-brand-400">{progress}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-400 rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPlanView;
