
import React, { useState, useEffect } from 'react';
import { AudienceType, HistoryItem, InputMode } from './types';
import { generateExplanation, searchBibleVerses, generateDevotional, getNviText } from './services/geminiService';
import { bibleBooks } from './data/bibleBooks';
import AudienceSelector from './components/AudienceSelector';
import ResultCard from './components/ResultCard';
import BibleSelector from './components/BibleSelector';
import StudySelector from './components/StudySelector';
import ReadingPlanView from './components/ReadingPlanView';
import ThematicPlansView from './components/ThematicPlansView';
import DevotionalView from './components/DevotionalView';
import { 
  Book, Sparkles, History as HistoryIcon, X, Type, BookOpen, 
  Search, GraduationCap, CalendarDays, Library, Coffee, 
  Loader2, Key, MoreHorizontal 
} from 'lucide-react';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('devotional');
  const [inputText, setInputText] = useState('');
  const [pickerText, setPickerText] = useState('Gênesis 1');
  const [searchText, setSearchText] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(AudienceType.ADULT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentReference, setCurrentReference] = useState<string>('');
  const [isDevotionalResult, setIsDevotionalResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [quotaWaitTime, setQuotaWaitTime] = useState(0);

  const checkApiKey = async () => {
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    } else {
      const envKey = process.env.API_KEY;
      setHasApiKey(!!(envKey && envKey !== "undefined" && envKey !== ""));
    }
  };

  useEffect(() => {
    checkApiKey();
    const interval = setInterval(checkApiKey, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (quotaWaitTime > 0) {
      const timer = setInterval(() => {
        setQuotaWaitTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quotaWaitTime]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const processResponse = (response: string) => {
    if (response === "KEY_ERROR") {
      setHasApiKey(false);
      return "### 🔑 Acesso Necessário\n\nSua chave de API parece inválida ou expirou. Por favor, clique no botão **Ativar IA Agora** acima para reconectar sua conta Google e continuar usando a Bíblia Atos.";
    }
    if (response === "QUOTA_ERROR") {
      setQuotaWaitTime(60);
      return "### ⏳ Pausa para Café\n\nO limite de uso gratuito foi atingido temporariamente. A inteligência artificial precisa de **60 segundos** para recarregar. Agradecemos sua paciência enquanto preparamos a próxima resposta!";
    }
    return response;
  };

  const handleGenerate = async (forcedInput?: string) => {
    if (quotaWaitTime > 0 || !hasApiKey) return;
    let inputToUse = forcedInput || '';
    if (!forcedInput) {
      if (inputMode === 'free') inputToUse = inputText;
      else if (inputMode === 'bible') inputToUse = pickerText;
      else if (inputMode === 'study') inputToUse = studyTopic;
    }
    if (!inputToUse.trim()) return;

    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(false);
    setCurrentReference(inputToUse);

    try {
      const rawResponse = await generateExplanation(inputToUse, selectedAudience);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      if (rawResponse !== "KEY_ERROR" && rawResponse !== "QUOTA_ERROR" && !rawResponse.includes("🛑")) {
        addToHistory(inputToUse, selectedAudience, finalResponse);
      }
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (error) {
      setResult("### 🛑 Erro inesperado\n\nOcorreu um erro ao tentar gerar a explicação. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDevotional = async (ref: string) => {
    if (quotaWaitTime > 0 || !hasApiKey) return;
    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(true);
    setCurrentReference(ref);
    try {
      const rawResponse = await generateDevotional(ref, selectedAudience);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      if (rawResponse !== "KEY_ERROR" && rawResponse !== "QUOTA_ERROR" && !rawResponse.includes("🛑")) {
        addToHistory(ref, selectedAudience, finalResponse);
      }
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (error) {
      setResult("### 🛑 Erro inesperado\n\nOcorreu um erro ao tentar gerar o devocional. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReadBible = async (forcedInput?: string) => {
    if (!hasApiKey) {
      setResult("### ⚠️ Acesso Restrito\n\nPara ler a Bíblia NVI em Português na íntegra, é necessário ativar sua chave de IA gratuita no botão acima.");
      return;
    }
    let inputToUse = forcedInput || (inputMode === 'bible' ? pickerText : inputText);
    if (!inputToUse.trim()) return;
    setLoading(true);
    setResult(null);
    setIsReadingMode(true);
    setIsDevotionalResult(false);
    setCurrentReference(inputToUse);
    try {
      const rawResponse = await getNviText(inputToUse);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (error) {
      setResult("### 🛑 Erro de Leitura\n\nNão foi possível carregar o texto bíblico neste momento. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateReference = (direction: 'prev' | 'next') => {
    const match = currentReference.match(/^(.+?)\s+(\d+)/);
    if (!match) return;
    const bookName = match[1];
    const chapter = parseInt(match[2]);
    const bookIndex = bibleBooks.findIndex(b => b.name === bookName);
    if (bookIndex === -1) return;
    const book = bibleBooks[bookIndex];
    let newBookIndex = bookIndex;
    let newChapter = chapter;
    if (direction === 'next') {
      newChapter++;
      if (newChapter > book.chapters) {
        if (bookIndex < bibleBooks.length - 1) { newBookIndex++; newChapter = 1; }
        else { newChapter = book.chapters; }
      }
    } else {
      newChapter--;
      if (newChapter < 1) {
        if (bookIndex > 0) { newBookIndex--; newChapter = bibleBooks[newBookIndex].chapters; }
        else { newChapter = 1; }
      }
    }
    handleReadBible(`${bibleBooks[newBookIndex].name} ${newChapter}`);
  };

  const handleSearch = async () => {
    if (quotaWaitTime > 0 || !searchText.trim() || !hasApiKey) return;
    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(false);
    setCurrentReference(searchText);
    try {
      const rawResponse = await searchBibleVerses(searchText);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (error) {
      setResult("### 🔍 Erro na Busca\n\nNão conseguimos realizar a pesquisa no momento. Tente reformular seu termo de busca.");
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (text: string, audience: AudienceType, response: string) => {
    const newItem: HistoryItem = { id: Date.now().toString(), text, audience, response, timestamp: Date.now() };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setInputMode('free');
    setInputText(item.text);
    setSelectedAudience(item.audience);
    setResult(item.response);
    setIsReadingMode(false);
    setIsDevotionalResult(false);
    setShowHistory(false);
  };

  const primaryNavItems = [
    { id: 'devotional', label: 'Devocional', icon: Coffee },
    { id: 'plan', label: 'Planos', icon: CalendarDays },
    { id: 'bible', label: 'Bíblia', icon: BookOpen },
    { id: 'search', label: 'Busca', icon: Search },
  ];

  const secondaryNavItems = [
    { id: 'thematic', label: 'Temas', icon: Library },
    { id: 'free', label: 'Explorar', icon: Type },
    { id: 'study', label: 'Estudos', icon: GraduationCap },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center pb-24 md:pb-12 font-sans selection:bg-brand-400 selection:text-black overflow-x-hidden">
      
      {/* HEADER DESKTOP & MOBILE */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-brand-400 p-2 rounded-xl text-black shadow-lg shadow-brand-400/20 transition-transform group-hover:scale-105">
              <Book size={20} className="md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-base md:text-2xl font-black text-white tracking-tight leading-none uppercase">Bíblia Atos</h1>
              <p className="text-[10px] text-brand-400 font-black uppercase tracking-widest mt-1">NVI Brasileira & IA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop Full Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = inputMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setInputMode(item.id as InputMode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${isActive ? 'bg-brand-400 text-black shadow-lg' : 'text-slate-400 hover:text-slate-200'}
                    `}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2.5 text-slate-400 hover:bg-slate-800 hover:text-brand-400 active:scale-95 rounded-full transition-all"
            >
              <HistoryIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex items-center justify-between">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setInputMode(item.id as InputMode); setShowMobileMore(false); }}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all relative
                  ${isActive ? 'text-brand-400 bg-brand-400/10' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                <Icon size={22} />
                <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">{item.label}</span>
                {isActive && <div className="absolute -top-1 w-1 h-1 bg-brand-400 rounded-full shadow-[0_0_8px_#fbbf24]"></div>}
              </button>
            );
          })}
          <button
            onClick={() => setShowMobileMore(!showMobileMore)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all
              ${showMobileMore ? 'text-brand-400 bg-brand-400/10' : 'text-slate-500'}
            `}
          >
            <MoreHorizontal size={22} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">Mais</span>
          </button>
        </div>

        {/* Mobile More Drawer */}
        {showMobileMore && (
          <div className="absolute bottom-20 left-0 right-0 animate-slide-up-fade">
            <div className="bg-slate-900/98 backdrop-blur-2xl border border-slate-800 rounded-3xl p-4 shadow-2xl grid grid-cols-3 gap-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = inputMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setInputMode(item.id as InputMode); setShowMobileMore(false); }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all
                      ${isActive ? 'bg-brand-400 text-black shadow-lg' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}
                    `}
                  >
                    <Icon size={20} />
                    <span className="text-[9px] font-black uppercase mt-2 tracking-tighter text-center leading-none">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex-grow">
        
        {!hasApiKey && (
          <div className="mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center gap-5 animate-fade-in shadow-2xl">
            <div className="w-16 h-16 bg-brand-400 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-brand-400/20">
              <Key size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">Edificação Integral</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">Para ler a Bíblia NVI em Português e gerar estudos personalizados, ative sua chave gratuita do Google.</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-8 h-12 bg-brand-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-brand-500 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              <Key size={18} /> Ativar IA Agora
            </button>
          </div>
        )}

        <section key={inputMode} className="animate-slide-up-fade">
          <div className={`bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 p-5 md:p-12 mb-10 overflow-hidden
            ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none !p-0' : ''}
          `}>
            
            <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[100px]'}>
              {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
              {inputMode === 'plan' && <ReadingPlanView onSelectReference={(ref, mode) => mode === 'read' ? handleReadBible(ref) : handleGenerate(ref)} isLoading={loading} />}
              {inputMode === 'thematic' && <ThematicPlansView onSelectAction={(ref, mode) => mode === 'read' ? handleReadBible(ref) : handleGenerate(ref)} isLoading={loading} />}
              {inputMode === 'free' && (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Sobre o que você quer aprender hoje? Digite um tema ou sentimento..."
                  className="w-full p-6 md:p-10 rounded-3xl border border-slate-800 focus:border-brand-400 outline-none resize-none h-48 md:h-64 text-base md:text-xl bg-slate-950 text-slate-200 font-serif"
                />
              )}
              {inputMode === 'bible' && <BibleSelector onSelectionChange={setPickerText} />}
              {inputMode === 'study' && <StudySelector onSelectTopic={setStudyTopic} />}
              {inputMode === 'search' && (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Busque temas: 'paz', 'família', 'Jesus'..."
                    className="w-full px-6 h-16 rounded-2xl border border-slate-800 focus:border-brand-400 outline-none bg-slate-950 text-slate-200"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={loading || !hasApiKey}
                    className="w-full h-14 bg-brand-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-brand-500 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    Pesquisar na Bíblia
                  </button>
                </div>
              )}
            </div>

            {!['plan', 'thematic', 'search'].includes(inputMode) && (
              <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col gap-8">
                <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleReadBible()}
                    disabled={loading || !hasApiKey}
                    className="flex items-center justify-center gap-3 h-16 rounded-2xl font-black uppercase tracking-widest text-slate-400 bg-slate-800/50 border border-slate-700 hover:text-white transition-all disabled:opacity-20"
                  >
                    <BookOpen size={22} /> Ler Texto
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={loading || !hasApiKey || quotaWaitTime > 0}
                    className="flex items-center justify-center gap-3 h-16 rounded-2xl font-black uppercase tracking-widest text-black bg-brand-400 hover:bg-brand-500 transition-all disabled:opacity-20 shadow-lg"
                  >
                    {loading ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />} Explicação
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {result && (
          <div id="result-section" className="scroll-mt-24 mb-16 animate-slide-up-fade">
            <ResultCard 
              content={result} 
              audience={isReadingMode ? AudienceType.ADULT : selectedAudience} 
              isDevotional={isDevotionalResult}
              isReadingMode={isReadingMode}
              onNavigate={isReadingMode ? handleNavigateReference : undefined}
              isLoading={loading}
              currentReference={currentReference}
            />
          </div>
        )}
      </main>

      <footer className="w-full py-12 pb-24 md:pb-12 text-center text-slate-600 text-[10px] bg-slate-950 border-t border-slate-900">
        <p className="font-black text-white uppercase tracking-[0.2em] mb-2">Bíblia Atos</p>
        <p>Bíblia Sagrada NVI em Português Brasileiro • Edificação via IA</p>
      </footer>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col border-l border-slate-800">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <h2 className="font-black text-white uppercase tracking-widest text-xs">Histórico</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full transition-all"><X size={22} /></button>
            </div>
            <div className="p-4 space-y-4">
              {history.length === 0 ? (
                <div className="py-20 text-center text-slate-600">
                   <p className="text-xs uppercase font-black tracking-widest">Vazio</p>
                </div>
              ) : history.map((item) => (
                <button key={item.id} onClick={() => handleRestoreHistory(item)} className="w-full text-left p-5 rounded-3xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/30 transition-all group">
                  <div className="font-bold text-slate-200 text-sm truncate">{item.text}</div>
                  <div className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest">
                    {item.audience === AudienceType.CHILD ? "Crianças" : item.audience === AudienceType.TEEN ? "Jovens" : "Adultos"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
