
import React, { useState } from 'react';
import { thematicPlans, ThematicPlan } from '../data/thematicPlans';
import { BookOpen, Sparkles, ChevronLeft, Clock, ArrowRight, Loader2, Filter, Users, Heart, GraduationCap, Zap, Trophy, Search, Smile } from 'lucide-react';

interface ThematicPlansViewProps {
  onSelectAction: (ref: string, mode: 'read' | 'explain') => void;
  isLoading: boolean;
}

type CategoryFilter = 'Todos' | ThematicPlan['category'];

const ThematicPlansView: React.FC<ThematicPlansViewProps> = ({ onSelectAction, isLoading }) => {
  const [selectedPlan, setSelectedPlan] = useState<ThematicPlan | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('Todos');
  const [daySearch, setDaySearch] = useState('');

  const categories: { label: CategoryFilter, icon: any }[] = [
    { label: 'Todos', icon: Filter },
    { label: 'Crianças', icon: Smile },
    { label: 'Desafios', icon: Trophy },
    { label: 'Jovens', icon: Zap },
    { label: 'Vida Cristã', icon: Users },
    { label: 'Emoções', icon: Heart },
    { label: 'Doutrina', icon: GraduationCap },
  ];

  const filteredPlans = filter === 'Todos' 
    ? thematicPlans 
    : thematicPlans.filter(p => p.category === filter);

  const handleAction = (ref: string, mode: 'read' | 'explain', id: string) => {
    setActiveActionId(id);
    onSelectAction(ref, mode);
  };

  const filteredDays = selectedPlan?.days.filter(d => 
    daySearch === '' || d.day.toString() === daySearch || d.focus.toLowerCase().includes(daySearch.toLowerCase())
  ) || [];

  if (selectedPlan) {
    return (
      <div className="animate-fade-in flex flex-col h-full max-h-[80vh] md:max-h-none">
        <button 
          onClick={() => { setSelectedPlan(null); setDaySearch(''); }}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-400 font-bold mb-4 md:mb-6 transition-colors p-2 -ml-2"
        >
          <ChevronLeft size={20} /> Voltar para Planos
        </button>

        <div className={`rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br ${selectedPlan.color} shadow-xl mb-6 relative overflow-hidden flex-shrink-0`}>
          <div className="relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block border border-white/10">
              {selectedPlan.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight">{selectedPlan.title}</h2>
            <p className="text-white/80 text-sm md:text-base max-w-xl">{selectedPlan.description}</p>
            
            <div className="mt-6 flex gap-4 text-xs font-black uppercase tracking-widest opacity-80">
              <div className="flex items-center gap-1.5"><Clock size={16} /> {selectedPlan.duration} Dias</div>
              <div className="flex items-center gap-1.5 text-brand-400"><Trophy size={16} /> Desafio Atos</div>
            </div>
          </div>
          <span className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12">{selectedPlan.icon}</span>
        </div>

        {/* Busca de Dia para Planos Longos */}
        {selectedPlan.duration > 7 && (
          <div className="relative mb-6 flex-shrink-0">
            <input 
              type="text" 
              placeholder="Ir para o dia ou buscar tema..."
              value={daySearch}
              onChange={(e) => setDaySearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-brand-400 outline-none"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>
        )}

        <div className="space-y-4 overflow-y-auto no-scrollbar pb-10">
          {filteredDays.length === 0 ? (
            <div className="py-20 text-center text-slate-600">
               <p className="text-xs uppercase font-black tracking-widest">Nenhum dia encontrado</p>
            </div>
          ) : filteredDays.map((day) => (
            <div key={day.day} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-5 hover:border-slate-700 shadow-sm transition-all animate-scale-in">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg
                  ${day.day === 1 ? 'bg-brand-400 text-black shadow-lg shadow-brand-400/20' : 'bg-slate-800 text-slate-500'}
                `}>
                  {day.day}
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-slate-200 text-base leading-tight mb-1">{day.focus}</h4>
                  <p className="text-brand-400 font-serif font-bold text-sm tracking-tight">{day.reference}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAction(day.reference, 'read', `read-${day.day}`)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 h-12 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-slate-400 hover:text-white active:scale-95 transition-all disabled:opacity-40"
                >
                  {isLoading && activeActionId === `read-${day.day}` ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                  Ler
                </button>
                <button 
                  onClick={() => handleAction(day.reference, 'explain', `explain-${day.day}`)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 h-12 bg-brand-400 text-black rounded-2xl text-xs font-bold active:scale-95 transition-all disabled:opacity-40"
                >
                  {isLoading && activeActionId === `explain-${day.day}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Explicar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth snap-x border border-slate-800">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.label)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all snap-start whitespace-nowrap
                ${isActive ? 'bg-brand-400 text-black shadow-lg shadow-brand-400/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {filteredPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className="group text-left bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-brand-400/30 active:scale-[0.98] transition-all duration-300 flex flex-col h-full"
          >
            <div className={`h-24 bg-gradient-to-r ${plan.color} p-5 flex items-end justify-between relative`}>
              <span className="text-4xl relative z-10">{plan.icon}</span>
              <span className="bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-tighter border border-white/10 z-10">
                {plan.category}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-black text-white mb-1 leading-tight group-hover:text-brand-400 transition-colors">{plan.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{plan.description}</p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={12} /> {plan.duration} Dias
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-brand-400 group-hover:bg-brand-400 group-hover:text-black transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThematicPlansView;
