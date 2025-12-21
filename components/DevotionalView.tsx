
import React, { useState } from 'react';
import BibleSelector from './BibleSelector';
import { Coffee, Sparkles, BookOpen, Loader2, Quote, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface DevotionalViewProps {
  onGenerate: (ref: string) => void;
  onRead: (ref: string) => void;
  isLoading: boolean;
}

const DevotionalView: React.FC<DevotionalViewProps> = ({ onGenerate, onRead, isLoading }) => {
  const [selectedRef, setSelectedRef] = useState('Salmos 23');
  const [showSelector, setShowSelector] = useState(false);
  
  const suggestions = [
    "Jeremias 29:11", "Filipenses 4:13", "Isaías 40:31", "Salmos 46:1", 
    "João 14:27", "Mateus 11:28", "Romanos 8:28", "Salmos 121", 
    "Lamentações 3:22-23", "Josué 1:9", "1 Pedro 5:7", "Salmos 34:18"
  ];
  
  const handleRandomSuggestion = () => {
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSelectedRef(random);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4 md:gap-6">
      {/* Hero Devocional - Mais compacto no Mobile */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
              <Coffee size={18} className="md:w-5 md:h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Momento Devocional</span>
          </div>
          <h2 className="text-xl md:text-3xl font-serif font-bold mb-1 md:mb-2">Reflexão para sua Alma</h2>
          <p className="text-white/80 text-xs md:text-base max-w-md leading-relaxed">Pense, medite e cresça com a Palavra.</p>
        </div>
        <Quote className="absolute right-[-10px] bottom-[-10px] text-white/10 w-32 h-32 md:w-48 md:h-48 -rotate-12" />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-5 md:p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-tight">Passagem Selecionada</h3>
            <button 
              onClick={handleRandomSuggestion}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors active:rotate-180 duration-500"
              title="Nova Sugestão"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Card de Referência Ativa */}
          <button 
            onClick={() => setShowSelector(!showSelector)}
            className={`w-full flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all active:scale-[0.98]
              ${showSelector ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                <BookOpen size={18} className="text-indigo-600" />
              </div>
              <span className="font-serif font-black text-lg md:text-xl text-slate-800">{selectedRef}</span>
            </div>
            <div className="text-slate-400">
              {showSelector ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {/* Seletor Colapsável */}
          {showSelector && (
            <div className="mt-4 animate-slide-up-fade">
              <div className="p-1 bg-slate-50 rounded-2xl">
                <BibleSelector onSelectionChange={setSelectedRef} />
                <button 
                  onClick={() => setShowSelector(false)}
                  className="w-full py-3 text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:bg-indigo-50 transition-colors rounded-b-2xl"
                >
                  Confirmar Seleção
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação - Grid Otimizado */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onRead(selectedRef)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-14 md:h-16 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-indigo-300 active:scale-95 transition-all disabled:opacity-50"
          >
            <BookOpen size={20} />
            <span>Ler</span>
          </button>
          <button
            onClick={() => onGenerate(selectedRef)}
            disabled={isLoading}
            className="flex-[2] flex items-center justify-center gap-2 h-14 md:h-16 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />}
            <span>Gerar Devocional</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevotionalView;
