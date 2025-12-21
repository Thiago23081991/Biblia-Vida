
import React, { useState, useEffect } from 'react';
import { AudienceType, HistoryItem, InputMode } from './types';
import { generateExplanation, getBibleText, searchBibleVerses, generateDevotional } from './services/geminiService';
import { bibleBooks } from './data/bibleBooks';
import AudienceSelector from './components/AudienceSelector';
import ResultCard from './components/ResultCard';
import BibleSelector from './components/BibleSelector';
import StudySelector from './components/StudySelector';
import ReadingPlanView from './components/ReadingPlanView';
import ThematicPlansView from './components/ThematicPlansView';
import DevotionalView from './components/DevotionalView';
import { Book, Sparkles, History as HistoryIcon, X, Type, BookOpen, Search, GraduationCap, CalendarDays, Library, Coffee, Eraser, Loader2, Key, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('devotional');
  const [inputText, setInputText] = useState('');
  const [pickerText, setPickerText] = useState('Gênesis 1');
  const [searchText, setSearchText] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [bibleSelectorKey] = useState(0);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(AudienceType.ADULT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentReference, setCurrentReference] = useState<string>('');
  const [isDevotionalResult, setIsDevotionalResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

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

  const handleOpenKeySelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    } else {
      alert("Ambiente sem suporte a seletor de chave. Configure a variável API_KEY nas configurações do seu projeto (Vercel/Local).");
    }
  };

  const processResponse = (response: string) => {
    if (response.startsWith("KEY_ERROR")) {
      setHasApiKey(false);
      return "⚠️ Sua chave de API parece não ter permissão para este modelo ou expirou. Por favor, clique em 'Ativar Agora' ou selecione uma chave válida.";
    }
    return response;
  };

  const handleGenerate = async (forcedInput?: string) => {
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
      
      if (!rawResponse.startsWith("KEY_ERROR") && !rawResponse.includes("😔")) {
        addToHistory(inputToUse, selectedAudience, finalResponse);
      }
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Erro crítico na requisição. Verifique sua chave de API.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDevotional = async (ref: string) => {
    setLoading(true);
    setResult(null);
    setIsReadingMode(false);
    setIsDevotionalResult(true);
    setCurrentReference(ref);
    try {
      const rawResponse = await generateDevotional(ref, selectedAudience);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      if (!rawResponse.startsWith("KEY_ERROR") && !rawResponse.includes("😔")) {
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
      const rawResponse = await getBibleText(inputToUse);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      setResult("Erro ao buscar o texto bíblico.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateReference = (direction: 'prev' | 'next') => {
    const refMatch = currentReference.match(/^(.+?)\s(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!refMatch) return;

    const [_, bookName, chapterStr, verseStartStr, verseEndStr] = refMatch;
    let chapter = parseInt(chapterStr);
    let verseStart = verseStartStr ? parseInt(verseStartStr) : null;
    let verseEnd = verseEndStr ? parseInt(verseEndStr) : null;

    const book = bibleBooks.find(b => b.name === bookName);
    if (!book) return;

    if (verseStart !== null) {
      if (direction === 'next') {
        const nextVerse = (verseEnd || verseStart) + 1;
        handleReadBible(`${bookName} ${chapter}:${nextVerse}`);
      } else {
        const prevVerse = Math.max(1, verseStart - 1);
        handleReadBible(`${bookName} ${chapter}:${prevVerse}`);
      }
    } else {
      if (direction === 'next') {
        if (chapter < book.chapters) handleReadBible(`${bookName} ${chapter + 1}`);
        else {
          const bookIndex = bibleBooks.findIndex(b => b.name === bookName);
          if (bookIndex < bibleBooks.length - 1) {
            handleReadBible(`${bibleBooks[bookIndex + 1].name} 1`);
          }
        }
      } else {
        if (chapter > 1) handleReadBible(`${bookName} ${chapter - 1}`);
        else {
          const bookIndex = bibleBooks.findIndex(b => b.name === bookName);
          if (bookIndex > 0) {
            const prevBook = bibleBooks[bookIndex - 1];
            handleReadBible(`${prevBook.name} ${prevBook.chapters}`);
          }
        }
      }
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setResult(null);
    setIsReadingMode(true);
    setIsDevotionalResult(false);
    try {
      const rawResponse = await searchBibleVerses(searchText);
      const finalResponse = processResponse(rawResponse);
      setResult(finalResponse);
    } catch (error) {
      setResult("Ocorreu um erro ao realizar a busca.");
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
              <button 
                onClick={handleOpenKeySelector}
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all border border-rose-500 shadow-lg animate-bounce"
              >
                <Key size={12} /> Selecionar Chave
              </button>
            )}
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 active:scale-95 rounded-full transition-all relative"
              aria-label="Ver Histórico"
            >
              <HistoryIcon size={20} className="md:w-6 md:h-6" />
              {history.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex-grow">
        {!hasApiKey && (
          <div className="mb-8 bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 flex flex-col items-center text-center gap-4 animate-fade-in shadow-xl shadow-rose-100/20">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-900 leading-tight">Chave de API Necessária</h2>
              <p className="text-sm text-rose-700 mt-2 max-w-sm">Para ativar os recursos de IA, você precisa selecionar uma chave do Google AI Studio ou configurar a variável API_KEY nas configurações do projeto.</p>
              <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase">Nota: Projetos na Vercel exigem redeploy após salvar variáveis.</p>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="px-6 h-12 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              <Key size={18} /> Ativar Agora
            </button>
          </div>
        )}

        {/* Navigation Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 -mx-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInputMode(item.id as InputMode)}
                className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all snap-start whitespace-nowrap active:scale-95
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}
                `}
              >
                <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                {item.label}
              </button>
            );
          })}
        </div>

        <section key={inputMode} className="animate-slide-up-fade">
          <div className={`bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 p-4 md:p-10 mb-8 overflow-hidden transition-all
            ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none !p-0' : ''}
          `}>
            {!['plan', 'thematic'].includes(inputMode) && (
              <div className="mb-4 md:mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {inputMode === 'free' ? "O que você deseja explorar?" : "Configurações"}
                </label>
              </div>
            )}

            <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[80px]'}>
              {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
              {inputMode === 'plan' && <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />}
              {inputMode === 'thematic' && <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />}
              {inputMode === 'free' && (
                <div className="relative group">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ex: Por que Deus permitiu o dilúvio? Ou: Explique a Graça em Romanos."
                    className="w-full p-5 md:p-8 rounded-3xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none resize-none h-40 md:h-56 text-base md:text-lg bg-slate-50/30 font-serif"
                  />
                  {inputText && (
                    <button 
                      onClick={() => setInputText('')}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm transition-all"
                    >
                      <Eraser size={16} />
                    </button>
                  )}
                </div>
              )}
              {inputMode === 'bible' && <BibleSelector key={bibleSelectorKey} onSelectionChange={setPickerText} />}
              {inputMode === 'study' && <StudySelector onSelectTopic={setStudyTopic} />}
              {inputMode === 'search' && (
                <div className="relative group">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Palavra ou frase..."
                    className="w-full pl-12 pr-4 h-14 md:h-16 rounded-2xl md:rounded-3xl border border-slate-300 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none text-base md:text-lg bg-slate-50/30"
                  />
                  <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-500" />
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
                      className="flex items-center justify-center gap-2.5 h-14 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-40"
                    >
                      <BookOpen size={20} />
                      <span className="text-sm">Ler</span>
                    </button>
                    <button
                      onClick={() => handleGenerate()}
                      disabled={loading || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-2.5 h-14 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-100 transition-all disabled:bg-slate-300"
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
                disabled={loading || !searchText.trim()}
                className="w-full mt-4 flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-md disabled:bg-slate-200"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span>Buscar na Bíblia</span>
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
        <p className="mt-4 opacity-50 max-w-sm mx-auto">Desenvolvido para edificação ministerial através de IA Generativa.</p>
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
              {history.length === 0 ? (
                <div className="py-20 flex flex-col items-center text-slate-400 opacity-60">
                   <HistoryIcon size={48} className="mb-4" />
                   <p className="font-bold uppercase tracking-widest text-[10px]">Sem registros</p>
                </div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleRestoreHistory(item)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white transition-all active:scale-[0.98] group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm line-clamp-1">{item.text}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap ml-2">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest
                      ${item.audience === AudienceType.CHILD ? 'bg-yellow-100 text-yellow-700' : 
                        item.audience === AudienceType.TEEN ? 'bg-purple-100 text-purple-700' : 
                        'bg-blue-100 text-blue-700'
                      }
                    `}>
                      {item.audience === AudienceType.CHILD ? 'Criança' : item.audience === AudienceType.TEEN ? 'Jovem' : 'Adulto'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
