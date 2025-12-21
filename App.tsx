
import React, { useState } from 'react';
import { AudienceType, HistoryItem, InputMode } from './types';
import { generateExplanation, getBibleText, searchBibleVerses, generateDevotional } from './services/geminiService';
import AudienceSelector from './components/AudienceSelector';
import ResultCard from './components/ResultCard';
import BibleSelector from './components/BibleSelector';
import StudySelector from './components/StudySelector';
import ReadingPlanView from './components/ReadingPlanView';
import ThematicPlansView from './components/ThematicPlansView';
import DevotionalView from './components/DevotionalView';
import { Book, Sparkles, Send, History as HistoryIcon, X, Type, BookOpen, Search, GraduationCap, CalendarDays, Library, Coffee } from 'lucide-react';

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

    try {
      const generatedText = await generateExplanation(inputToUse, selectedAudience);
      setResult(generatedText);
      addToHistory(inputToUse, selectedAudience, generatedText);
      if (inputMode === 'free' && !forcedInput) setInputText('');
      if (inputMode === 'bible' && !forcedInput) setBibleSelectorKey(prev => prev + 1);
      if (inputMode === 'study' && !forcedInput) setStudyTopic('');
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    try {
      const devotional = await generateDevotional(ref, selectedAudience);
      setResult(devotional);
      addToHistory(ref, selectedAudience, devotional);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    try {
      const bibleText = await getBibleText(inputToUse);
      setResult(bibleText);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      setResult("Erro ao buscar o texto bíblico.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20 md:pb-0">
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-600 p-1.5 rounded-lg text-white shadow-md shadow-brand-200">
              <Book size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-black text-slate-900 tracking-tight leading-none">Bíblia Viva</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">Teologia NVI & IA</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors relative"
          >
            <HistoryIcon size={22} />
            {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>}
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 flex-grow">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = inputMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInputMode(item.id as InputMode)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all snap-start whitespace-nowrap
                  ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-100 scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}
                `}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        <section className={`bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-8 mb-8 ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none p-0' : ''}`}>
          {!['plan', 'thematic'].includes(inputMode) && (
            <div className="mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {inputMode === 'free' ? "O que explorar hoje?" : "Configurações de busca"}
              </label>
            </div>
          )}

          <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[100px]'}>
            {inputMode === 'devotional' && <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />}
            {inputMode === 'plan' && <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />}
            {inputMode === 'thematic' && <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />}
            {inputMode === 'free' && (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: O perdão em Mateus ou Tema: Ansiedade"
                className="w-full p-4 rounded-2xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none h-32 text-lg shadow-inner"
              />
            )}
            {inputMode === 'bible' && <BibleSelector key={bibleSelectorKey} onSelectionChange={setPickerText} />}
            {inputMode === 'study' && <StudySelector onSelectTopic={setStudyTopic} />}
            {inputMode === 'search' && (
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Palavra ou frase..."
                  className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-300 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-lg shadow-inner"
                />
                <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            )}
          </div>

          {!['plan', 'thematic', 'search'].includes(inputMode) && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-6">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Público da Explicação</p>
                 <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
              </div>

              {inputMode !== 'devotional' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReadBible()}
                    disabled={loading || (inputMode === 'free' && !inputText.trim())}
                    className="flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <BookOpen size={20} />
                    <span>Ler</span>
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={loading || (inputMode === 'free' && !inputText.trim())}
                    className="flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-100 transition-all disabled:bg-slate-300"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={20} />}
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
              className="w-full mt-4 flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-white bg-brand-600 active:scale-95 transition-all disabled:bg-slate-200"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={20} />}
              <span>Buscar na Bíblia</span>
            </button>
          )}
        </section>

        {result && (
          <div id="result-section" className="scroll-mt-24 mb-10">
            <ResultCard content={result} audience={isReadingMode ? AudienceType.ADULT : selectedAudience} isDevotional={isDevotionalResult} />
          </div>
        )}
      </main>

      <footer className="w-full py-10 px-4 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        <p className="font-bold text-slate-600 uppercase tracking-widest mb-1">Bíblia Viva & Adaptada</p>
        <p>Base Teológica NVI - Nova Versão Internacional</p>
        <p className="mt-4 opacity-50">© 2024 - Criado para edificação cristã individual e ministerial</p>
      </footer>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="font-black text-slate-900 uppercase tracking-tight">Histórico</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-3 flex-grow">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                   <HistoryIcon size={48} className="mb-4" />
                   <p className="font-medium">Nenhum registro ainda.</p>
                </div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleRestoreHistory(item)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-200 hover:shadow-lg transition-all active:scale-95 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 line-clamp-1">{item.text}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap ml-2">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest
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
