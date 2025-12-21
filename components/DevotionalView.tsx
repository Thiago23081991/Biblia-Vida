
import React, { useState } from 'react';
import BibleSelector from './BibleSelector';
import { Coffee, Sparkles, BookOpen, Loader2, Quote } from 'lucide-react';

interface DevotionalViewProps {
  onGenerate: (ref: string) => void;
  onRead: (ref: string) => void;
  isLoading: boolean;
}

const DevotionalView: React.FC<DevotionalViewProps> = ({ onGenerate, onRead, isLoading }) => {
  const [selectedRef, setSelectedRef] = useState('Salmos 23');
  
  // Sugestões de versículos inspiradores baseados no dia do mês
  const suggestions = [
    "Jeremias 29:11", "Filipenses 4:13", "Isaías 40:31", "Salmos 46:1", 
    "João 14:27", "Mateus 11:28", "Romanos 8:28", "Salmos 121", 
    "Lamentações 3:22-23", "Josué 1:9", "1 Pedro 5:7", "Salmos 34:18"
  ];
  const dailySuggestion = suggestions[new Date().getDate() % suggestions.length];

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Hero Devocional */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Coffee size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Momento Devocional</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">Reflexão para sua Alma</h2>
          <p className="text-white/80 max-w-md">Escolha uma passagem e receba um pensamento encorajador para iluminar o seu dia.</p>
        </div>
        <Quote className="absolute right-[-20px] bottom-[-20px] text-white/10 w-48 h-48 -rotate-12" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Selecione a Passagem</h3>
            <p className="text-sm text-slate-500">Qual texto você deseja meditar hoje?</p>
          </div>
          <button 
            onClick={() => setSelectedRef(dailySuggestion)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
          >
            Sugestão do Dia: {dailySuggestion}
          </button>
        </div>

        <BibleSelector onSelectionChange={setSelectedRef} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onRead(selectedRef)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-indigo-300 transition-all disabled:opacity-50"
          >
            <BookOpen size={20} />
            Ler Versículo
          </button>
          <button
            onClick={() => onGenerate(selectedRef)}
            disabled={isLoading}
            className="flex-[2] flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:bg-slate-300"
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
