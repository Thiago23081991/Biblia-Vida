
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
      return "⚠️ Sua chave de API parece inválida ou sem permissão. Por favor, ative-a novamente para usar a IA.";
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
    { id: 'plan', label: 'Anual', icon: CalendarDays },
    { id: 'thematic', label: 'Temas', icon: Library },
    { id: 'free', label: 'Explorar', icon: Type },
    { id: 'bible', label: 'Bíblia', icon: BookOpen },
    { id: 'study', label: 'Estudos', icon: GraduationCap },
    { id: 'search', label: 'Busca', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-24 md:pb-0 font-sans selection:bg-brand-100 selection:text-brand-900">
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2.5 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-brand-600 p-1.5 rounded-lg text-white shadow-md transition-transform group-hover:scale-105">
              <Book size={18} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-black text-slate-900 tracking-tight leading-none">Bíblia Viva</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">Teologia NVI & IA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasApiKey && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                 <AlertCircle size={12} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Apenas Leitura</span>
              </div>
            )}
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 active:scale-95 rounded-full transition-all relative"
            >
              <HistoryIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex-grow">
        
        {!hasApiKey && (
          <div className="mb-8 bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 flex flex-col items-center text-center gap-4 animate-fade-in shadow-lg">
            <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-blue-900 leading-tight">Modo de Leitura Ativo</h2>
              <p className="text-sm text-blue-700 mt-2 max-w-sm">A leitura de capítulos é ilimitada e gratuita! Para usar buscas e explicações por IA, ative sua chave.</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-6 h-12 bg-white text-blue-600 border-2 border-blue-200 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-2"
            >
              <Key size={18} /> Ativar IA
            </button>
          </div>
        )}

        {quotaWaitTime > 0 && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 flex items-center gap-4 animate-fade-in shadow-lg">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <Timer size={24} />
            </div>
            <div className="flex-grow">
              <h3 className="font-black text-amber-900 text-sm">IA em Repouso</h3>
              <p className="text-xs text-amber-700">Limite atingido. **A leitura na aba Bíblia e Planos continua liberada.**</p>
            </div>
            <div className="bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm">
              {quotaWaitTime}s
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 -mx-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInputMode(item.id as InputMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all snap-start whitespace-nowrap active:scale-95
                  ${isActive ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}
                `}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <section key={inputMode} className="animate-slide-up-fade">
          <div className={`bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 p-4 md:p-10 mb-8 overflow-hidden transition-all
            ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none !p-0' : ''}
          `}>
            
            <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[80px]'}>
              {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
              {inputMode === 'plan' && <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />}
              {inputMode === 'thematic' && <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />}
              {inputMode === 'free' && (
                <div className="relative group">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ex: Explique a Graça em Romanos."
                    className="w-full p-5 md:p-8 rounded-3xl border border-slate-300 focus:border-brand-500 outline-none resize-none h-40 md:h-56 text-base md:text-lg bg-slate-50/30 font-serif"
                  />
                  {inputText && (
                    <button onClick={() => setInputText('')} className="absolute top-3 right-3 p-2 bg-white/80 text-slate-400 hover:text-rose-500 rounded-full shadow-sm"><Eraser size={16} /></button>
                  )}
                </div>
              )}
              {inputMode === 'bible' && <BibleSelector onSelectionChange={setPickerText} />}
              {inputMode === 'study' && <StudySelector onSelectTopic={setStudyTopic} />}
              {inputMode === 'search' && (
                <div className="relative flex flex-col gap-3">
                   <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} /> Busca Inteligente via IA
                  </p>
                  <div className="relative group">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Busca por palavra ou tema..."
                      className="w-full pl-12 pr-4 h-14 md:h-16 rounded-2xl md:rounded-3xl border border-slate-300 focus:border-brand-500 outline-none text-base md:text-lg bg-slate-50/30"
                    />
                    <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed">
                    A IA encontrará os versículos mais relevantes para o seu tema.
                  </p>
                </div>
              )}
            </div>

            {!['plan', 'thematic', 'search'].includes(inputMode) && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-6 animate-fade-in">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Público da Explicação</p>
                  <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
                </div>

                {inputMode !== 'devotional' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleReadBible()}
                      disabled={loading || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-2.5 h-14 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      <BookOpen size={20} />
                      <span className="text-sm">Ler</span>
                    </button>
                    <button
                      onClick={() => handleGenerate()}
                      disabled={loading || quotaWaitTime > 0 || !hasApiKey || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-2.5 h-14 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md transition-all disabled:bg-slate-300 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                      <span className="text-sm">Explicar</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'search' && (
              <button
                onClick={handleSearch}
                disabled={loading || quotaWaitTime > 0 || !searchText.trim() || !hasApiKey}
                className="w-full mt-4 flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-md disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span>Buscar com IA</span>
              </button>
            )}
          </div>
        </section>

        {result && (
          <div id="result-section" className="scroll-mt-24 mb-12 animate-slide-up-fade">
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

      <footer className="w-full py-10 px-4 text-center text-slate-400 text-[10px] border-t border-slate-200 bg-white">
        <p className="font-bold text-slate-600 uppercase tracking-widest mb-2">Bíblia Viva & Adaptada</p>
        <p>Base Teológica NVI - Nova Versão Internacional</p>
        <p className="mt-4 opacity-50 max-w-sm mx-auto">Leitura pública gratuita. Explicações e buscas via Gemini IA.</p>
      </footer>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="font-black text-slate-900 uppercase tracking-tight text-sm">Histórico</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="p-3 space-y-3">
              {history.map((item) => (
                <button key={item.id} onClick={() => handleRestoreHistory(item)} className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white transition-all">
                  <div className="font-bold text-slate-800 text-sm">{item.text}</div>
                  <div className="text-[9px] text-slate-400 mt-1 uppercase font-black">{item.audience}</div>
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
