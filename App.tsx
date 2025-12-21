
import React, { useState } from 'react';
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
import { Book, Sparkles, History as HistoryIcon, X, Type, BookOpen, Search, GraduationCap, CalendarDays, Library, Coffee, Eraser } from 'lucide-react';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('devotional');
  const [inputText, setInputText] = useState('');
  const [pickerText, setPickerText] = useState('Gênesis 1');
  const [searchText, setSearchText] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [bibleSelectorKey, setBibleSelectorKey] = useState(0);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(AudienceType.ADULT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentReference, setCurrentReference] = useState<string>('');
  const [isDevotionalResult, setIsDevotionalResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
      const generatedText = await generateExplanation(inputToUse, selectedAudience);
      setResult(generatedText);
      addToHistory(inputToUse, selectedAudience, generatedText);
      if (inputMode === 'free' && !forcedInput) setInputText('');
      if (inputMode === 'study' && !forcedInput) setStudyTopic('');
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      console.error(error);
      setResult("Ocorreu um erro ao gerar a explicação. Tente novamente em instantes.");
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
      const devotional = await generateDevotional(ref, selectedAudience);
      setResult(devotional);
      addToHistory(ref, selectedAudience, devotional);
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
      const bibleText = await getBibleText(inputToUse);
      setResult(bibleText);
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
      const searchResults = await searchBibleVerses(searchText);
      setResult(searchResults);
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20 md:pb-0 font-sans">
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="bg-brand-600 p-1.5 rounded-lg text-white shadow-md shadow-brand-200 transition-transform group-hover:scale-110">
              <Book size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-black text-slate-900 tracking-tight leading-none">Bíblia Viva</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">Teologia NVI & IA</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2.5 text-slate-500 hover:bg-slate-100 active:scale-90 rounded-full transition-all relative"
          >
            <HistoryIcon size={22} />
            {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white animate-pulse"></span>}
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 flex-grow">
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInputMode(item.id as InputMode)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all snap-start whitespace-nowrap active:scale-95
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-200 scale-105 z-10' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                `}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        <section key={inputMode} className="animate-slide-up-fade">
          <div className={`bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-5 md:p-10 mb-8 overflow-hidden transition-all duration-500
            ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none !p-0' : 'hover:shadow-xl hover:border-slate-300'}
          `}>
            {!['plan', 'thematic'].includes(inputMode) && (
              <div className="mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 animate-fade-in">
                  {inputMode === 'free' ? "O que você deseja explorar?" : "Configurações"}
                </label>
              </div>
            )}

            <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[100px]'}>
              {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
              {inputMode === 'plan' && <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />}
              {inputMode === 'thematic' && <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />}
              {inputMode === 'free' && (
                <div className="relative group">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ex: Por que Deus permitiu o dilúvio? Ou: Explique a Graça em Romanos."
                    className="w-full p-6 md:p-8 rounded-[2rem] border border-slate-300 focus:border-brand-500 focus:ring-8 focus:ring-brand-500/5 transition-all outline-none resize-none h-48 md:h-56 text-lg shadow-inner bg-slate-50/30 font-serif"
                  />
                  {inputText && (
                    <button 
                      onClick={() => setInputText('')}
                      className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm transition-all"
                    >
                      <Eraser size={18} />
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
                    className="w-full pl-14 pr-4 h-16 rounded-3xl border border-slate-300 focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 outline-none text-lg shadow-inner transition-all bg-slate-50/30 group-hover:border-slate-400"
                  />
                  <Search size={26} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-500" />
                </div>
              )}
            </div>

            {!['plan', 'thematic', 'search'].includes(inputMode) && (
              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col gap-8 animate-fade-in">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Público da Explicação</p>
                  <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
                </div>

                {inputMode !== 'devotional' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleReadBible()}
                      disabled={loading || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-3 h-16 rounded-3xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all disabled:opacity-40"
                    >
                      <BookOpen size={22} />
                      <span>Ler</span>
                    </button>
                    <button
                      onClick={() => handleGenerate()}
                      disabled={loading || (inputMode === 'free' && !inputText.trim())}
                      className="flex items-center justify-center gap-3 h-16 rounded-3xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-100 transition-all disabled:bg-slate-300"
                    >
                      {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={22} />}
                      <span>Explicar</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'search' && (
              <button
                onClick={handleSearch}
                disabled={loading || !searchText.trim()}
                className="w-full mt-6 flex items-center justify-center gap-3 h-16 rounded-3xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-lg shadow-brand-100 disabled:bg-slate-200"
              >
                {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={22} />}
                <span>Buscar na Bíblia</span>
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

      <footer className="w-full py-12 px-4 text-center text-slate-400 text-xs border-t border-slate-200 bg-white transition-colors hover:text-slate-500">
        <p className="font-bold text-slate-600 uppercase tracking-widest mb-2">Bíblia Viva & Adaptada</p>
        <p>Base Teológica NVI - Nova Versão Internacional</p>
        <p className="mt-6 opacity-50 max-w-sm mx-auto">© 2024 - Criado para edificação cristã individual e ministerial através de Inteligência Artificial Generativa.</p>
      </footer>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="font-black text-slate-900 uppercase tracking-tight">Histórico de Estudos</h2>
              <button onClick={() => setShowHistory(false)} className="p-2.5 hover:bg-slate-100 active:scale-90 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4 flex-grow">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 animate-fade-in">
                   <HistoryIcon size={56} className="mb-6 stroke-[1.5]" />
                   <p className="font-bold uppercase tracking-widest text-[10px]">Nenhum registro ainda</p>
                </div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleRestoreHistory(item)}
                    className="w-full text-left p-5 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-200 hover:shadow-xl transition-all active:scale-[0.98] group animate-scale-in"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">{item.text}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap ml-3">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest transition-colors
                        ${item.audience === AudienceType.CHILD ? 'bg-yellow-100 text-yellow-700' : 
                          item.audience === AudienceType.TEEN ? 'bg-purple-100 text-purple-700' : 
                          'bg-blue-100 text-blue-700'
                        }
                      `}>
                        {item.audience === AudienceType.CHILD ? 'Criança' : item.audience === AudienceType.TEEN ? 'Jovem' : 'Adulto'}
                      </span>
                    </div>
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
