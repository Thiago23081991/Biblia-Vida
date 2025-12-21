
import React, { useState } from 'react';
import { studyThemes } from '../data/studyThemes';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

interface StudySelectorProps {
  onSelectTopic: (topic: string) => void;
}

const StudySelector: React.FC<StudySelectorProps> = ({ onSelectTopic }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentCategory = studyThemes.find(c => c.id === activeCategory);

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    onSelectTopic(topic);
  };

  // Se estiver no mobile e uma categoria for selecionada, mostramos a lista de temas
  if (activeCategory && currentCategory) {
    return (
      <div className="animate-slide-up-fade">
        <button 
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold mb-6 transition-colors p-2 -ml-2 group"
        >
          <div className="bg-slate-100 p-1.5 rounded-full group-hover:bg-brand-100 transition-colors">
            <ChevronLeft size={18} />
          </div>
          Voltar para Categorias
        </button>

        <div className={`rounded-3xl p-6 mb-8 border ${currentCategory.color} shadow-sm overflow-hidden relative`}>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-1">{currentCategory.name}</h3>
            <p className="opacity-70 text-sm font-medium">Explore temas selecionados para seu crescimento.</p>
          </div>
          <currentCategory.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 -rotate-12" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
          {currentCategory.topics.map((topic, idx) => {
            const isSelected = selectedTopic === topic.title;
            return (
              <button
                key={idx}
                onClick={() => handleTopicClick(topic.title)}
                className={`text-left p-5 rounded-3xl border-2 transition-all flex items-center justify-between group active:scale-[0.98]
                  ${isSelected 
                    ? 'bg-brand-600 border-brand-600 text-white shadow-xl shadow-brand-100' 
                    : 'bg-white border-slate-100 text-slate-700 hover:border-brand-200 hover:shadow-md'
                  }
                `}
              >
                <div className="pr-4">
                  <div className="font-bold text-base leading-tight">{topic.title}</div>
                  {topic.ref && (
                    <div className={`text-xs mt-1.5 font-medium ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                      {topic.ref}
                    </div>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${isSelected ? 'bg-white/20' : 'bg-slate-50 text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500'}
                `}>
                  <ChevronRight size={18} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Visão Geral de Categorias (Cards)
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-800">Trilhas de Estudo</h2>
        <p className="text-sm text-slate-500">Escolha um foco para seu aprendizado bíblico hoje.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyThemes.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative overflow-hidden text-left p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] hover:shadow-xl
                ${category.color}
              `}
            >
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="bg-white/50 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
                
                <div>
                  <h3 className="text-lg font-black leading-tight mb-1">{category.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
                    {category.topics.length} temas <ArrowRight size={12} />
                  </div>
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StudySelector;
