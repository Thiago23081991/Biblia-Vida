
import React, { useState, useMemo } from 'react';
import BibleSelector from './BibleSelector';
import { AudienceType } from '../types';
import { Coffee, Sparkles, BookOpen, Loader2, Quote, ChevronDown, ChevronUp, Heart, Shield, Sun, Target, Wind, Anchor, Zap, Flame, Cloud, Compass, Key, Mountain, Star, Umbrella, Award, Bell, Briefcase, Camera, Eye, Gift, Moon, PenTool, Smile, Ghost, Crown, Music, Home, Dices } from 'lucide-react';

interface DevotionalViewProps {
  onGenerate: (ref: string) => void;
  onRead: (ref: string) => void;
  isLoading: boolean;
  audience: AudienceType;
}

interface DevotionalSuggestion {
  theme: string;
  ref: string;
  icon: any;
  color: string;
}

// Banco de dados expandido para rotação diária (Adultos/Jovens)
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

// Temas Lúdicos para Crianças
const KIDS_THEMES: DevotionalSuggestion[] = [
  { theme: "Super Herói", ref: "Filipenses 4:13", icon: Shield, color: "from-red-500/40 to-orange-500/40" },
  { theme: "Amigão", ref: "João 15:15", icon: Smile, color: "from-yellow-400/40 to-amber-500/40" },
  { theme: "Xô Medo!", ref: "Salmos 56:3", icon: Ghost, color: "from-purple-500/40 to-indigo-500/40" },
  { theme: "Criação", ref: "Gênesis 1:1", icon: Sun, color: "from-green-500/40 to-emerald-500/40" },
  { theme: "Presente", ref: "João 3:16", icon: Gift, color: "from-pink-500/40 to-rose-500/40" },
  { theme: "Rei Jesus", ref: "Apocalipse 19:16", icon: Crown, color: "from-amber-300/40 to-yellow-600/40" },
  { theme: "Música", ref: "Salmos 150", icon: Music, color: "from-blue-400/40 to-cyan-500/40" },
  { theme: "Família", ref: "Êxodo 20:12", icon: Home, color: "from-orange-400/40 to-red-400/40" },
  { theme: "Perdão", ref: "Efésios 4:32", icon: Heart, color: "from-red-500/40 to-rose-500/40" },
  { theme: "Coragem", ref: "Daniel 6", icon: Flame, color: "from-orange-500/40 to-red-600/40" },
  { theme: "Ovelhinha", ref: "Salmos 23", icon: Cloud, color: "from-slate-300/40 to-slate-500/40" },
  { theme: "Brilhar", ref: "Mateus 5:14", icon: Star, color: "from-yellow-300/40 to-amber-400/40" },
  { theme: "Amor", ref: "1 João 4:8", icon: Heart, color: "from-pink-600/40 to-rose-600/40" },
  { theme: "Obediência", ref: "Efésios 6:1", icon: Anchor, color: "from-blue-600/40 to-indigo-600/40" },
  { theme: "Vitória", ref: "1 Coríntios 15:57", icon: Award, color: "from-amber-400/40 to-yellow-500/40" },
];

const DevotionalView: React.FC<DevotionalViewProps> = ({ onGenerate, onRead, isLoading, audience }) => {
  const [selectedRef, setSelectedRef] = useState('Salmos 23');
  const [showSelector, setShowSelector] = useState(false);

  // Define qual lista usar baseada na audiência
  const currentThemeList = audience === AudienceType.CHILD ? KIDS_THEMES : MASTER_THEMES;

  // Calcula os 5 temas do dia baseados na data atual com rotação não-sequencial
  const dailyThemes = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const selected: DevotionalSuggestion[] = [];
    const total = currentThemeList.length;
    
    // Configuração para rotação pseudo-aleatória determinística:
    const DAY_STEP = 7; 
    const ITEM_STEP = 13; 

    for (let i = 0; i < 5; i++) {
      // Fórmula: (Salto do Dia + Salto do Item) % Total
      const index = ((dayOfYear * DAY_STEP) + (i * ITEM_STEP)) % total;
      selected.push(currentThemeList[index]);
    }
    
    return selected;
  }, [currentThemeList]); // Recalcula se a lista mudar (mudança de audiência)
  
  const handleSuggestionClick = (ref: string) => {
    setSelectedRef(ref);
    setShowSelector(false);
  };

  const handleRandomSuggestion = () => {
    // Seleciona um tema aleatório da lista de sugestões do dia
    const randomTheme = dailyThemes[Math.floor(Math.random() * dailyThemes.length)];
    setSelectedRef(randomTheme.ref);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Hero Devocional Atos */}
      <div className={`
        rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 text-white shadow-xl overflow-hidden relative border border-brand-400/20
        ${audience === AudienceType.CHILD 
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
          : 'bg-gradient-to-br from-brand-600 to-brand-900'
        }
      `}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 md:mb-5">
            <div className={`p-2 rounded-xl text-black ${audience === AudienceType.CHILD ? 'bg-yellow-300' : 'bg-brand-400'}`}>
              <Coffee size={16} className="md:w-6 md:h-6" />
            </div>
            <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] ${audience === AudienceType.CHILD ? 'text-yellow-300' : 'text-brand-400'}`}>
              {audience === AudienceType.CHILD ? 'Hora da História' : 'Pão de Cada Dia'}
            </span>
          </div>
          <h2 className="text-xl md:text-4xl font-serif font-bold leading-tight uppercase tracking-tighter">
            {audience === AudienceType.CHILD ? 'Aventura Bíblica' : 'Meditação Profunda'}
          </h2>
          <p className="text-white/60 text-xs md:text-base mt-2 font-medium max-w-[80%]">
            {audience === AudienceType.CHILD ? 'Histórias incríveis para hoje!' : 'Temas renovados hoje para edificar sua vida.'}
          </p>
        </div>
        <Quote className="absolute right-[-20px] bottom-[-20px] text-white/5 w-24 h-24 md:w-64 md:h-64 -rotate-12" />
      </div>

      <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 p-4 md:p-10 shadow-2xl">
        {/* Curadoria de Temas Diários */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-1">
              {audience === AudienceType.CHILD ? 'Escolha sua Aventura' : 'Curadoria para Hoje'}
            </h3>
            
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={handleRandomSuggestion}
                className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1 bg-slate-800 hover:bg-brand-400 hover:text-black text-slate-400 rounded-full transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-700 group active:scale-95"
              >
                <Dices size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Surpreenda-me</span>
                <span className="sm:hidden">Aleatório</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-brand-400/10 rounded-full border border-brand-400/20">
                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-brand-400 uppercase">Atualizado</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
            {dailyThemes.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedRef === cat.ref;
              return (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(cat.ref)}
                  className={`flex flex-col items-center justify-center gap-2 md:gap-3 px-2 py-4 md:px-3 md:py-5 rounded-2xl border-2 transition-all active:scale-95 group relative overflow-hidden
                    ${isSelected 
                      ? 'border-brand-400 bg-brand-400/10 text-brand-400 shadow-lg shadow-brand-400/10 scale-[1.02] z-10' 
                      : `bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300`
                    }
                  `}
                >
                  <div className={`p-2.5 md:p-3 rounded-xl transition-all ${isSelected ? 'bg-brand-400 text-black shadow-lg' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                    <Icon size={18} className="md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-center leading-tight truncate w-full">{cat.theme}</span>
                  
                  {/* Subtle Background Glow for each theme */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referência Ativa</h3>
          </div>

          {/* Card de Referência Ativa - Versão Compacta Mobile */}
          <button 
            onClick={() => setShowSelector(!showSelector)}
            className={`w-full flex items-center justify-between p-3 md:p-6 rounded-2xl border-2 transition-all active:scale-[0.98]
              ${showSelector ? 'border-brand-400 bg-brand-400/5' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}
            `}
          >
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="bg-slate-900 p-2 md:p-2.5 rounded-xl border border-slate-800 flex-shrink-0">
                <BookOpen size={16} className="text-brand-400 md:w-5 md:h-5" />
              </div>
              <span className="font-serif font-black text-base md:text-2xl text-white tracking-tight truncate">{selectedRef}</span>
            </div>
            <div className="text-slate-600 flex-shrink-0 ml-2">
              {showSelector ? <ChevronUp size={18} className="md:w-6 md:h-6" /> : <ChevronDown size={18} className="md:w-6 md:h-6" />}
            </div>
          </button>

          {/* Seletor Colapsável Integrado ao Tema Dark */}
          {showSelector && (
            <div className="mt-3 md:mt-4 animate-slide-up-fade relative z-20">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="max-h-[350px] overflow-y-auto p-2 md:p-3 no-scrollbar">
                  <BibleSelector onSelectionChange={setSelectedRef} />
                </div>
                <button 
                  onClick={() => setShowSelector(false)}
                  className="w-full py-3 md:py-4 text-[10px] font-black uppercase text-black bg-brand-400 tracking-[0.2em] hover:bg-brand-500 transition-colors shadow-lg"
                >
                  Confirmar Estudo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação Dark/Amarelo - Grid 2 colunas no mobile também */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <button
            onClick={() => onRead(selectedRef)}
            disabled={isLoading}
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 h-20 md:h-20 rounded-2xl font-black uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 transition-all disabled:opacity-30"
          >
            <BookOpen size={20} className="md:w-6 md:h-6" />
            <span className="text-[10px] md:text-xs text-center leading-tight">Ler<br className="md:hidden"/> Passagem</span>
          </button>
          <button
            onClick={() => onGenerate(selectedRef)}
            disabled={isLoading}
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 h-20 md:h-20 rounded-2xl font-black uppercase tracking-widest text-black bg-brand-400 hover:bg-brand-500 shadow-xl shadow-brand-400/5 active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin md:w-6 md:h-6" /> : <Sparkles size={20} className="md:w-6 md:h-6" />}
            <span className="text-[10px] md:text-xs text-center leading-tight">Gerar<br className="md:hidden"/> Devocional</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevotionalView;
