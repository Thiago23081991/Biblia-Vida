
import React, { useState, useEffect } from 'react';
import { AudienceType, HistoryItem, InputMode } from './types';
import { generateExplanation, searchBibleVerses, generateDevotional } from './services/geminiService';
import { fetchPublicBibleText } from './services/bibleService';
import { bibleBooks } from './data/bibleBooks';
import AudienceSelector from './components/AudienceSelector';
import ResultCard from './components/ResultCard';
import BibleSelector from './components/BibleSelector';
import StudySelector from './components/StudySelector';
import ReadingPlanView from './components/ReadingPlanView';
import ThematicPlansView from './components/ThematicPlansView';
import DevotionalView from './components/DevotionalView';
import { Book, Sparkles, History as HistoryIcon, X, Type, BookOpen, Search, GraduationCap, CalendarDays, Library, Coffee, Eraser, Loader2, Key, AlertCircle, Timer } from 'lucide-react';

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
    if (response.startsWith("KEY_ERROR")) {
      setHasApiKey(false);
      return "⚠️ Sua chave de API parece inválida. Por favor, ative-a novamente.";
    }
    if (response.startsWith("QUOTA_ERROR")) {
      setQuotaWaitTime(60);
      return response.replace("QUOTA_ERROR: ", "⏳ ");
    }
    return response;
  };

  const handleGenerate = async (forcedInput?: string) => {
    if (quotaWaitTime > 0) return;
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
      
      if (!rawResponse.includes("ERROR") && !rawResponse.includes("😔")) {
        addToHistory(inputToUse, selectedAudience, finalResponse);
      }
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Erro crítico na requisição de IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDevotional = async (ref: string) => {
    if (quotaWaitTime > 0) return;
    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(true);
    setCurrentReference(ref);
    try {
      const rawResponse = await generateDevotional(ref, selectedAudience);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      if (!rawResponse.includes("ERROR") && !rawResponse.includes("😔")) {
        addToHistory(ref, selectedAudience, finalResponse);
      }
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Erro ao gerar o devocional.");
    } finally {
      setLoading(false);
    }
  };

  const handleReadBible = async (forcedInput?: string) => {
    let inputToUse = forcedInput || (inputMode === 'bible' ? pickerText : inputText);
    if (!inputToUse.trim()) return;
    
    setLoading(true);
    setResult(null);
    setIsReadingMode(true);
    setIsDevotionalResult(false);
    setCurrentReference(inputToUse);
    
    try {
      const bibleText = await fetchPublicBibleText(inputToUse);
      setResult(bibleText);
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Erro ao buscar o texto bíblico na base pública.");
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
        if (bookIndex < bibleBooks.length - 1) {
          newBookIndex++;
          newChapter = 1;
        } else {
          newChapter = book.chapters;
        }
      }
    } else {
      newChapter--;
      if (newChapter < 1) {
        if (bookIndex > 0) {
          newBookIndex--;
          newChapter = bibleBooks[newBookIndex].chapters;
        } else {
          newChapter = 1;
        }
      }
    }

    const nextRef = `${bibleBooks[newBookIndex].name} ${newChapter}`;
    handleReadBible(nextRef);
  };

  const handleSearch = async () => {
    if (quotaWaitTime > 0 || !searchText.trim()) return;
    if (!hasApiKey) {
      setResult("⚠️ A busca inteligente requer uma chave de API ativa.");
      return;
    }

    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(false);
    setCurrentReference(searchText);
    
    try {
      const rawResponse = await searchBibleVerses(searchText);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Ocorreu um erro ao realizar a busca por IA.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanAction = (ref: string, mode: 'read' | 'explain') => {
    if (mode === 'read') handleReadBible(ref);
    else handleGenerate(ref);
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

  const navItems = [
    { id: 'devotional', label: 'Devocional', icon: Coffee },
    { id: 'plan', label: 'Planos', icon: CalendarDays },
    { id: 'thematic', label: 'Temas', icon: Library },
    { id: 'free', label: 'Explorar', icon: Type },
    { id: 'bible', label: 'Bíblia', icon: BookOpen },
    { id: 'study', label: 'Estudos', icon: GraduationCap },
    { id: 'search', label: 'Busca', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center pb-24 md:pb-0 font-sans selection:bg-brand-400 selection:text-black">
      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-brand-400 p-2 rounded-xl text-black shadow-lg shadow-brand-400/20 transition-transform group-hover:scale-105">
              <Book size={20} className="md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-base md:text-2xl font-black text-white tracking-tight leading-none uppercase">Bíblia Atos</h1>
              <p className="text-[10px] text-brand-400 font-black uppercase tracking-widest mt-1">Teologia NVI & IA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!hasApiKey && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black rounded-full border border-amber-500 shadow-sm">
                 <AlertCircle size={12} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Apenas Leitura</span>
              </div>
            )}
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2.5 text-slate-400 hover:bg-slate-800 hover:text-brand-400 active:scale-95 rounded-full transition-all relative"
            >
              <HistoryIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex-grow">
        
        {!hasApiKey && (
          <div className="mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center gap-5 animate-fade-in shadow-2xl">
            <div className="w-16 h-16 bg-brand-400 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-brand-400/20">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">Bíblia Atos: Modo Leitura</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">A leitura é ilimitada! Para usar a inteligência artificial nas explicações, ative sua chave.</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-8 h-12 bg-brand-400 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-brand-500 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              <Key size={18} /> Ativar IA agora
            </button>
          </div>
        )}

        {quotaWaitTime > 0 && (
          <div className="mb-8 bg-amber-400/10 border border-amber-400/30 rounded-3xl p-6 flex items-center gap-4 animate-fade-in shadow-lg">
            <div className="w-12 h-12 bg-amber-400 text-black rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <Timer size={24} />
            </div>
            <div className="flex-grow">
              <h3 className="font-black text-amber-400 text-sm">IA em Repouso</h3>
              <p className="text-xs text-slate-400">Limite de uso atingido. A leitura bíblica continua disponível.</p>
            </div>
            <div className="bg-amber-400 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-sm">
              {quotaWaitTime}s
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mb-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 -mx-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInputMode(item.id as InputMode)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all snap-start whitespace-nowrap active:scale-95
                  ${isActive ? 'bg-brand-400 text-black shadow-lg shadow-brand-400/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}
                `}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <section key={inputMode} className="animate-slide-up-fade">
          <div className={`bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 p-5 md:p-12 mb-10 overflow-hidden transition-all
            ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none !p-0' : ''}
          `}>
            
            <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[100px]'}>
              {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
              {inputMode === 'plan' && <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />}
              {inputMode === 'thematic' && <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />}
              {inputMode === 'free' && (
                <div className="relative group">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ex: Explique o que é a Salvação em Efésios 2."
                    className="w-full p-6 md:p-10 rounded-3xl border border-slate-800 focus:border-brand-400 outline-none resize-none h-48 md:h-64 text-base md:text-xl bg-slate-950 text-slate-200 font-serif"
                  />
                  {inputText && (
                    <button onClick={() => setInputText('')} className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-brand-400 rounded-full shadow-sm"><Eraser size={18} /></button>
                  )}
                </div>
              )}
              {inputMode === 'bible' && <BibleSelector onSelectionChange={setPickerText} />}
              {inputMode === 'study' && <StudySelector onSelectTopic={setStudyTopic} />}
              {inputMode === 'search' && (
                <div className="relative flex flex-col gap-4">
                   <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-2">
                    <Sparkles size={14} /> Busca Inteligente Bíblia Atos
                  </p>
                  <div className="relative group">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Busca por palavra, tema ou sentimento..."
                      className="w-full pl-14 pr-6 h-16 md:h-20 rounded-2xl md:rounded-3xl border border-slate-800 focus:border-brand-400 outline-none text-base md:text-xl bg-slate-950 text-slate-200"
                    />
                    <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center px-6 leading-relaxed">
                    A IA filtrará as melhores passagens NVI para a sua busca.
                  </p>
                </div>
              )}
            </div>

            {!['plan', 'thematic', 'search'].includes(inputMode) && (
              <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col gap-8 animate-fade-in">
                <div>
                  <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-4 ml-1">Público da Explicação</p>
                  <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
                </div>

                {inputMode !== 'devotional' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleReadBible()}
                      disabled={loading || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-3 h-16 rounded-2xl font-black uppercase tracking-widest text-slate-400 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
                    >
                      <BookOpen size={22} />
                      <span className="text-xs">Ler Texto</span>
                    </button>
                    <button
                      onClick={() => handleGenerate()}
                      disabled={loading || quotaWaitTime > 0 || !hasApiKey || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-3 h-16 rounded-2xl font-black uppercase tracking-widest text-black bg-brand-400 hover:bg-brand-500 active:scale-95 shadow-lg shadow-brand-400/10 transition-all disabled:bg-slate-800 disabled:text-slate-600"
                    >
                      {loading ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />}
                      <span className="text-xs">Explicar</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'search' && (
              <button
                onClick={handleSearch}
                disabled={loading || quotaWaitTime > 0 || !searchText.trim() || !hasApiKey}
                className="w-full mt-6 flex items-center justify-center gap-4 h-16 rounded-2xl font-black uppercase tracking-widest text-black bg-brand-400 hover:bg-brand-500 active:scale-95 transition-all shadow-xl disabled:bg-slate-800 disabled:text-slate-600"
              >
                {loading ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
                <span>Buscar Agora</span>
              </button>
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

      <footer className="w-full py-12 px-6 text-center text-slate-600 text-[10px] border-t border-slate-900 bg-slate-950">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <Book size={14} className="text-brand-400" />
          <p className="font-black text-white uppercase tracking-[0.2em]">Bíblia Atos</p>
        </div>
        <p className="max-w-sm mx-auto leading-relaxed">Base Teológica NVI. Leitura bíblica ilimitada via API Pública. Explicações e buscas via Inteligência Artificial.</p>
        <p className="mt-6 font-bold text-slate-800">&copy; {new Date().getFullYear()} Desenvolvido com IA para Edificação.</p>
      </footer>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col border-l border-slate-800">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <h2 className="font-black text-white uppercase tracking-widest text-xs">Histórico Recente</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full transition-all"><X size={22} /></button>
            </div>
            <div className="p-4 space-y-4">
              {history.length === 0 ? (
                <div className="py-20 text-center text-slate-600">
                   <p className="text-xs uppercase font-black tracking-widest">Nenhuma atividade ainda</p>
                </div>
              ) : history.map((item) => (
                <button key={item.id} onClick={() => handleRestoreHistory(item)} className="w-full text-left p-5 rounded-3xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/30 transition-all group">
                  <div className="font-bold text-slate-200 text-sm group-hover:text-brand-400 transition-colors">{item.text}</div>
                  <div className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest flex justify-between">
                    <span>{item.audience}</span>
                    <span className="opacity-50">#{item.id.slice(-4)}</span>
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
