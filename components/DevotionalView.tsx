
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
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Hero Devocional - Ultra compacto no Mobile */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl md:rounded-[2.5rem] p-4 md:p-8 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 md:mb-4">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Coffee size={14} className="md:w-5 md:h-5" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80">Momento Devocional</span>
          </div>
          <h2 className="text-lg md:text-3xl font-serif font-bold leading-tight">Reflexão Diária</h2>
        </div>
        <Quote className="absolute right-[-20px] bottom-[-20px] text-white/10 w-24 h-24 md:w-48 md:h-48 -rotate-12" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passagem de Hoje</h3>
            <button 
              onClick={handleRandomSuggestion}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors active:rotate-180 duration-500"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Card de Referência Ativa - Mais Compacto */}
          <button 
            onClick={() => setShowSelector(!showSelector)}
            className={`w-full flex items-center justify-between p-3 md:p-5 rounded-2xl border-2 transition-all active:scale-[0.98]
              ${showSelector ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                <BookOpen size={16} className="text-indigo-600" />
              </div>
              <span className="font-serif font-black text-base md:text-xl text-slate-800">{selectedRef}</span>
            </div>
            <div className="text-slate-400">
              {showSelector ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {/* Seletor Colapsável */}
          {showSelector && (
            <div className="mt-3 animate-slide-up-fade">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                <div className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
                  <BibleSelector onSelectionChange={setSelectedRef} />
                </div>
                <button 
                  onClick={() => setShowSelector(false)}
                  className="w-full py-2.5 text-[10px] font-black uppercase text-white bg-indigo-600 tracking-widest hover:bg-indigo-700 transition-colors"
                >
                  Confirmar Referência
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação - Grid Otimizado para Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => onRead(selectedRef)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-12 md:h-16 rounded-2xl font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 active:scale-95 transition-all disabled:opacity-50"
          >
            <BookOpen size={18} />
            <span className="text-sm">Apenas Ler</span>
          </button>
          <button
            onClick={() => onGenerate(selectedRef)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-12 md:h-16 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span className="text-sm">Criar Devocional</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevotionalView;
