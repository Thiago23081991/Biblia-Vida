
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
  
  // Inputs for different modes
  const [inputText, setInputText] = useState(''); // Free Text
  const [pickerText, setPickerText] = useState('Gênesis 1'); // Bible Navigation
  const [searchText, setSearchText] = useState(''); // Search Mode
  const [studyTopic, setStudyTopic] = useState(''); // Study Mode
  
  // Key to force reset of BibleSelector
  const [bibleSelectorKey, setBibleSelectorKey] = useState(0);

  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(AudienceType.ADULT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // State to track if the current result is a pure reading/search or an explanation
  const [isReadingMode, setIsReadingMode] = useState(false);
  // State to track if current result is a devotional
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
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error(error);
      setResult("Ocorreu um erro ao gerar a explicação. Verifique sua conexão ou tente novamente mais tarde.");
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
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
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
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      setResult("Ocorreu um erro ao buscar o texto bíblico.");
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
      setSearchText('');
    } catch (error) {
      console.error(error);
      setResult("Ocorreu um erro ao realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanAction = (ref: string, mode: 'read' | 'explain') => {
    if (mode === 'read') {
      handleReadBible(ref);
    } else {
      handleGenerate(ref);
    }
  };

  const addToHistory = (text: string, audience: AudienceType, response: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text: text,
      audience: audience,
      response: response,
      timestamp: Date.now()
    };
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

  const renderInputSection = () => {
    switch (inputMode) {
      case 'devotional':
        return <DevotionalView onGenerate={handleGenerateDevotional} onRead={handleReadBible} isLoading={loading} />;
      case 'plan':
        return <ReadingPlanView onSelectReference={handlePlanAction} isLoading={loading} />;
      case 'thematic':
        return <ThematicPlansView onSelectAction={handlePlanAction} isLoading={loading} />;
      case 'free':
        return (
          <div className="relative animate-fade-in">
            <textarea
              id="bible-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite um tema (ex: Perdão, Graça) ou uma passagem (ex: João 3:16)"
              className="w-full p-4 pr-12 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none h-[120px] text-lg"
            />
            <div className="absolute bottom-3 right-3 text-slate-400">
              <Sparkles size={20} className={loading ? "animate-pulse text-brand-500" : ""} />
            </div>
          </div>
        );
      case 'bible':
        return <BibleSelector key={bibleSelectorKey} onSelectionChange={setPickerText} />;
      case 'study':
        return <StudySelector onSelectTopic={setStudyTopic} />;
      case 'search':
        return (
          <div className="relative animate-fade-in py-4">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Digite uma palavra ou frase (ex: amor, dízimo, fé)"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search size={24} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2 ml-1">
              * A busca encontrará os versículos mais relevantes na NVI.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <Book size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bíblia Viva & Adaptada</h1>
              <p className="text-xs text-slate-500">Teologia e didática para todas as idades</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
            title="Histórico"
          >
            <HistoryIcon size={24} />
            {history.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 py-8 flex-grow">
        
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setInputMode('devotional')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'devotional' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Coffee size={18} />
            Devocional
          </button>
          <button
            onClick={() => setInputMode('plan')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'plan' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <CalendarDays size={18} />
            Anual
          </button>
          <button
            onClick={() => setInputMode('thematic')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'thematic' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Library size={18} />
            Temas
          </button>
          <button
            onClick={() => setInputMode('free')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'free' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Type size={18} />
            Explorar
          </button>
          <button
            onClick={() => setInputMode('bible')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'bible' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={18} />
            Bíblia
          </button>
          <button
            onClick={() => setInputMode('study')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'study' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <GraduationCap size={18} />
            Estudos
          </button>
          <button
            onClick={() => setInputMode('search')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${
              inputMode === 'search' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Search size={18} />
            Busca
          </button>
        </div>

        {/* Input Section */}
        <section className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 ${['plan', 'thematic'].includes(inputMode) ? 'bg-transparent border-none shadow-none p-0' : ''}`}>
          
          {!['plan', 'thematic'].includes(inputMode) && (
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <label className="block text-sm font-semibold text-slate-700">
                {inputMode === 'free' && "O que você quer explorar hoje?"}
                {inputMode === 'bible' && "Escolha uma passagem para ler ou explicar"}
                {inputMode === 'study' && "Selecione um tema de estudo guiado"}
                {inputMode === 'search' && "Busque versículos específicos"}
                {inputMode === 'devotional' && "Prepare seu coração para meditação"}
              </label>
            </div>
          )}

          <div className={['plan', 'thematic'].includes(inputMode) ? '' : 'min-h-[120px]'}>
            {renderInputSection()}
          </div>

          {/* Action Buttons Area (Hidden for Plan and Search) */}
          {!['plan', 'thematic', 'search'].includes(inputMode) && (
            <div className="mt-8 flex flex-col md:flex-row items-center gap-6 justify-between border-t border-slate-100 pt-6">
              <div className="w-full md:w-auto">
                 <p className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Público para {inputMode === 'devotional' ? 'Devocional' : 'Explicação'}</p>
                 <AudienceSelector selected={selectedAudience} onChange={setSelectedAudience} />
              </div>

              {/* Botões extras apenas se NÃO for modo devocional (pois ele tem botões internos) */}
              {inputMode !== 'devotional' && (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleReadBible()}
                    disabled={loading || (inputMode === 'free' && !inputText.trim()) || (inputMode === 'study' && !studyTopic)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    <BookOpen size={18} />
                    <span>Ler Bíblia</span>
                  </button>

                  <button
                    onClick={() => handleGenerate()}
                    disabled={loading || (inputMode === 'free' && !inputText.trim()) || (inputMode === 'study' && !studyTopic)}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 hover:shadow-lg transition-all disabled:bg-slate-300"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={18} />}
                    <span>{loading ? "Processando..." : "Explicar"}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Button Special Case */}
          {inputMode === 'search' && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={loading || !searchText.trim()}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all disabled:bg-slate-300"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={18} />}
                <span>{loading ? "Buscando..." : "Buscar na Bíblia"}</span>
              </button>
            </div>
          )}

        </section>

        {/* Output Section */}
        {result && (
          <div id="result-section" className="scroll-mt-24">
            <ResultCard 
              content={result} 
              audience={isReadingMode ? AudienceType.ADULT : selectedAudience} 
              isDevotional={isDevotionalResult}
            />
          </div>
        )}
        
        {!result && !loading && !['plan', 'thematic', 'devotional'].includes(inputMode) && (
          <div className="text-center py-12 text-slate-400">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
              <Sparkles size={32} className="opacity-50" />
            </div>
            <p className="text-lg">Comece sua jornada bíblica selecionando uma opção acima.</p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white mt-12">
        <p className="font-semibold text-slate-600">Bíblia Viva & Adaptada</p>
        <p className="mt-1">Fidelidade teológica baseada na Nova Versão Internacional (NVI)</p>
        <p className="mt-4 opacity-70">© 2024 - Desenvolvido para Edificação Cristã</p>
      </footer>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="font-bold text-lg text-slate-800">Histórico de Explicações</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {history.length === 0 ? (
                <p className="text-center text-slate-500 mt-10">Nenhum histórico ainda.</p>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleRestoreHistory(item)}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-200 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-700 line-clamp-1">{item.text}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${item.audience === AudienceType.CHILD ? 'bg-yellow-100 text-yellow-700' : 
                          item.audience === AudienceType.TEEN ? 'bg-purple-100 text-purple-700' : 
                          'bg-blue-100 text-blue-700'
                        }
                      `}>
                        {item.audience === AudienceType.CHILD ? 'Crianças' : item.audience === AudienceType.TEEN ? 'Adolescentes' : 'Adultos'}
                      </span>
                    </div>
                  </div>
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
