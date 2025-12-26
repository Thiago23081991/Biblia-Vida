
import React, { useState, useMemo } from 'react';
import BibleSelector from './BibleSelector';
import { Coffee, Sparkles, BookOpen, Loader2, Quote, ChevronDown, ChevronUp, RefreshCw, Heart, Shield, Sun, Target, Wind, Anchor, Zap, Flame, Cloud, Compass, Key, Mountain, Star, Umbrella, Award, Bell, Briefcase, Camera, Eye, Gift, Moon, PenTool, Smile } from 'lucide-react';

interface DevotionalViewProps {
  onGenerate: (ref: string) => void;
  onRead: (ref: string) => void;
  isLoading: boolean;
}

interface DevotionalSuggestion {
  theme: string;
  ref: string;
  icon: any;
  color: string;
}

// Banco de dados expandido para rotação diária
const MASTER_THEMES: DevotionalSuggestion[] = [
  { theme: "Paz", ref: "Filipenses 4:6-7", icon: Wind, color: "from-blue-900/40 to-cyan-900/40" },
  { theme: "Identidade", ref: "1 Pedro 2:9", icon: Heart, color: "from-rose-900/40 to-pink-900/40" },
  { theme: "Coragem", ref: "Josué 1:9", icon: Shield, color: "from-orange-900/40 to-amber-900/40" },
  { theme: "Propósito", ref: "Jeremias 29:11", icon: Target, color: "from-purple-900/40 to-indigo-900/40" },
  { theme: "Esperança", ref: "Isaías 40:31", icon: Sun, color: "from-yellow-900/40 to-amber-900/40" },
  { theme: "Fé", ref: "Hebreus 11:1", icon: Anchor, color: "from-blue-900/40 to-indigo-900/40" },
  { theme: "Poder", ref: "Atos 1:8", icon: Zap, color: "from-yellow-900/40 to-orange-900/40" },
  { theme: "Avivamento", ref: "Habacuque 3:2", icon: Flame, color: "from-red-900/40 to-orange-900/40" },
  { theme: "Descanso", ref: "Mateus 11:28", icon: Cloud, color: "from-sky-900/40 to-blue-900/40" },
  { theme: "Direção", ref: "Provérbios 3:5-6", icon: Compass, color: "from-emerald-900/40 to-teal-900/40" },
  { theme: "Acesso", ref: "Efésios 2:18", icon: Key, color: "from-slate-800 to-slate-900" },
  { theme: "Firmez", ref: "Salmos 125:1", icon: Mountain, color: "from-stone-900/40 to-neutral-900/40" },
  { theme: "Luz", ref: "Mateus 5:14", icon: Star, color: "from-yellow-900/40 to-amber-800/40" },
  { theme: "Abrigo", ref: "Salmos 91:1", icon: Umbrella, color: "from-cyan-900/40 to-blue-900/40" },
  { theme: "Vitória", ref: "1 Coríntios 15:57", icon: Award, color: "from-amber-900/40 to-yellow-900/40" },
  { theme: "Oração", ref: "1 Tessalonicenses 5:17", icon: Bell, color: "from-indigo-900/40 to-violet-900/40" },
  { theme: "Trabalho", ref: "Colossenses 3:23", icon: Briefcase, color: "from-slate-900 to-black" },
  { theme: "Visão", ref: "Efésios 1:18", icon: Camera, color: "from-blue-900/40 to-indigo-900/40" },
  { theme: "Foco", ref: "Hebreus 12:2", icon: Eye, color: "from-teal-900/40 to-emerald-900/40" },
  { theme: "Graça", ref: "Efésios 2:8", icon: Gift, color: "from-rose-900/40 to-red-900/40" },
  { theme: "Reflexão", ref: "Salmos 1:2", icon: Moon, color: "from-slate-900 to-black" },
  { theme: "Escritura", ref: "2 Timóteo 3:16", icon: PenTool, color: "from-amber-900/40 to-orange-900/40" },
  { theme: "Alegria", ref: "Salmos 16:11", icon: Smile, color: "from-yellow-900/40 to-orange-900/40" },
  { theme: "Sabedoria", ref: "Tiago 1:5", icon: BookOpen, color: "from-indigo-900/40 to-blue-900/40" },
  { theme: "Amor", ref: "1 Coríntios 13:13", icon: Heart, color: "from-red-900/40 to-rose-900/40" },
  { theme: "Perdão", ref: "Colossenses 3:13", icon: Cloud, color: "from-slate-800 to-slate-900" },
  { theme: "Justiça", ref: "Amós 5:24", icon: Target, color: "from-blue-900/40 to-indigo-900/40" },
  { theme: "Santidade", ref: "1 Pedro 1:16", icon: Flame, color: "from-orange-900/40 to-red-900/40" },
  { theme: "Paciência", ref: "Tiago 1:4", icon: Wind, color: "from-emerald-900/40 to-teal-900/40" },
  { theme: "Bondade", ref: "Salmos 145:9", icon: Heart, color: "from-amber-900/40 to-yellow-900/40" },
];

const DevotionalView: React.FC<DevotionalViewProps> = ({ onGenerate, onRead, isLoading }) => {
  const [selectedRef, setSelectedRef] = useState('Salmos 23');
  const [showSelector, setShowSelector] = useState(false);

  // Calcula os 5 temas do dia baseados na data atual com rotação não-sequencial
  const dailyThemes = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const selected: DevotionalSuggestion[] = [];
    const total = MASTER_THEMES.length;
    
    // Configuração para rotação pseudo-aleatória determinística:
    // DAY_STEP (7): Garante que a "janela" inicial mude a cada dia de forma não linear.
    // ITEM_STEP (13): Garante que os itens dentro do mesmo dia não sejam vizinhos imediatos na lista.
    // Ambos são primos relativos ao tamanho da lista (30) para maximizar a distribuição.
    const DAY_STEP = 7; 
    const ITEM_STEP = 13; 

    for (let i = 0; i < 5; i++) {
      // Fórmula: (Salto do Dia + Salto do Item) % Total
      const index = ((dayOfYear * DAY_STEP) + (i * ITEM_STEP)) % total;
      selected.push(MASTER_THEMES[index]);
    }
    
    return selected;
  }, []);
  
  const handleSuggestionClick = (ref: string) => {
    setSelectedRef(ref);
    setShowSelector(false);
  };

  const handleRandomSuggestion = () => {
    const randoms = ["Mateus 11:28", "Romanos 8:28", "Salmos 121", "João 14:27", "2 Timóteo 1:7", "Apocalipse 21:4", "Salmos 46:1", "Isaías 41:10"];
    const random = randoms[Math.floor(Math.random() * randoms.length)];
    setSelectedRef(random);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Hero Devocional Atos */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-900 rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 text-white shadow-xl overflow-hidden relative border border-brand-400/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 md:mb-5">
            <div className="p-2 bg-brand-400 text-black rounded-xl">
              <Coffee size={16} className="md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-brand-400">Pão de Cada Dia</span>
          </div>
          <h2 className="text-xl md:text-4xl font-serif font-bold leading-tight uppercase tracking-tighter">Meditação Profunda</h2>
          <p className="text-white/60 text-xs md:text-base mt-2 font-medium">Temas renovados hoje para edificar sua vida.</p>
        </div>
        <Quote className="absolute right-[-30px] bottom-[-30px] text-white/5 w-32 h-32 md:w-64 md:h-64 -rotate-12" />
      </div>

      <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 p-5 md:p-10 shadow-2xl">
        {/* Curadoria de Temas Diários */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-1">Curadoria para Hoje</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-400/10 rounded-full border border-brand-400/20">
               <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
               <span className="text-[9px] font-black text-brand-400 uppercase">Atualizado</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {dailyThemes.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedRef === cat.ref;
              return (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(cat.ref)}
                  className={`flex flex-col items-center justify-center gap-3 px-3 py-5 rounded-2xl border-2 transition-all active:scale-95 group relative overflow-hidden
                    ${isSelected 
                      ? 'border-brand-400 bg-brand-400/10 text-brand-400 shadow-lg shadow-brand-400/10 scale-105 z-10' 
                      : `bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300`
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-brand-400 text-black shadow-lg' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                    <Icon size={20} className="md:w-5 md:h-5" />
                  </div>
                  <span className="text-xs font-black tracking-widest uppercase">{cat.theme}</span>
                  
                  {/* Subtle Background Glow for each theme */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referência Ativa</h3>
            <button 
              onClick={handleRandomSuggestion}
              className="p-2 text-brand-400 hover:bg-brand-400/10 rounded-full transition-all active:rotate-180 duration-700"
              title="Passagem Aleatória"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Card de Referência Ativa com Estilo Atos */}
          <button 
            onClick={() => setShowSelector(!showSelector)}
            className={`w-full flex items-center justify-between p-4 md:p-6 rounded-2xl border-2 transition-all active:scale-[0.98]
              ${showSelector ? 'border-brand-400 bg-brand-400/5' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <BookOpen size={20} className="text-brand-400" />
              </div>
              <span className="font-serif font-black text-lg md:text-2xl text-white tracking-tight">{selectedRef}</span>
            </div>
            <div className="text-slate-600">
              {showSelector ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>
          </button>

          {/* Seletor Colapsável Integrado ao Tema Dark */}
          {showSelector && (
            <div className="mt-4 animate-slide-up-fade">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="max-h-[350px] overflow-y-auto p-3 no-scrollbar">
                  <BibleSelector onSelectionChange={setSelectedRef} />
                </div>
                <button 
                  onClick={() => setShowSelector(false)}
                  className="w-full py-4 text-[10px] font-black uppercase text-black bg-brand-400 tracking-[0.2em] hover:bg-brand-500 transition-colors shadow-lg"
                >
                  Confirmar Estudo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação Dark/Amarelo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onRead(selectedRef)}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 h-14 md:h-20 rounded-2xl font-black uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 transition-all disabled:opacity-30"
          >
            <BookOpen size={22} />
            <span className="text-xs">Ler Passagem</span>
          </button>
          <button
            onClick={() => onGenerate(selectedRef)}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 h-14 md:h-20 rounded-2xl font-black uppercase tracking-widest text-black bg-brand-400 hover:bg-brand-500 shadow-xl shadow-brand-400/5 active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />}
            <span className="text-xs">Gerar Devocional</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevotionalView;
