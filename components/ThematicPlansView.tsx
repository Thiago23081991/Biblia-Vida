
import React, { useState } from 'react';
import { thematicPlans, ThematicPlan } from '../data/thematicPlans';
import { BookOpen, Sparkles, ChevronLeft, Clock, ArrowRight, Loader2, Filter, Users, Heart, GraduationCap, Zap } from 'lucide-react';

interface ThematicPlansViewProps {
  onSelectAction: (ref: string, mode: 'read' | 'explain') => void;
  isLoading: boolean;
}

type CategoryFilter = 'Todos' | ThematicPlan['category'];

const ThematicPlansView: React.FC<ThematicPlansViewProps> = ({ onSelectAction, isLoading }) => {
  const [selectedPlan, setSelectedPlan] = useState<ThematicPlan | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('Todos');

  const categories: { label: CategoryFilter, icon: any }[] = [
    { label: 'Todos', icon: Filter },
    { label: 'Jovens', icon: Zap }, // Featured right after "All"
    { label: 'Vida Cristã', icon: Users },
    { label: 'Emoções', icon: Heart },
    { label: 'Doutrina', icon: GraduationCap },
    { label: 'Personagens', icon: BookOpen },
  ];

  const filteredPlans = filter === 'Todos' 
    ? thematicPlans 
    : thematicPlans.filter(p => p.category === filter);

  const handleAction = (ref: string, mode: 'read' | 'explain', id: string) => {
    setActiveActionId(id);
    onSelectAction(ref, mode);
  };

  if (selectedPlan) {
    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setSelectedPlan(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar para Planos
        </button>

        <div className={`rounded-3xl p-8 text-white bg-gradient-to-br ${selectedPlan.color} shadow-xl mb-8`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                {selectedPlan.category}
              </span>
              <h2 className="text-4xl font-serif font-bold mb-2">{selectedPlan.title}</h2>
              <p className="text-white/80 max-w-xl">{selectedPlan.description}</p>
            </div>
            <span className="text-6xl hidden md:block opacity-40">{selectedPlan.icon}</span>
          </div>
          
          <div className="mt-8 flex gap-6 text-sm font-bold">
            <div className="flex items-center gap-2">
              <Clock size={18} className="opacity-60" />
              {selectedPlan.duration} Dias
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="opacity-60" />
              NVI
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedPlan.days.map((day) => (
            <div key={day.day} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl
                  ${day.day === 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}
                `}>
                  {day.day}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{day.focus}</h4>
                  <p className="text-brand-600 font-serif font-medium">{day.reference}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(day.reference, 'read', `read-${day.day}`)}
                  disabled={isLoading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-all disabled:opacity-50"
                >
                  {isLoading && activeActionId === `read-${day.day}` ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                  Ler
                </button>
                <button 
                  onClick={() => handleAction(day.reference, 'explain', `explain-${day.day}`)}
                  disabled={isLoading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50"
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
      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${isActive ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <Icon size={14} className={isActive ? 'text-brand-500' : ''} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="group text-left bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`h-24 bg-gradient-to-r ${plan.color} p-6 flex items-end justify-between`}>
                <span className="text-4xl">{plan.icon}</span>
                <span className={`bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest ${plan.category === 'Jovens' ? 'ring-2 ring-white/50' : ''}`}>
                  {plan.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">{plan.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">{plan.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock size={14} />
                    {plan.duration} Dias
                  </div>
                  <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white border border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium italic">Nenhum plano encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThematicPlansView;
