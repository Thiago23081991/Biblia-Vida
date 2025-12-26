
import React, { useState, useEffect } from 'react';
import { bibleBooks } from '../data/bibleBooks';
import { ChevronDown, ChevronsLeft, ChevronsRight, Plus, Minus } from 'lucide-react';

interface BibleSelectorProps {
  onSelectionChange: (text: string) => void;
}

const BibleSelector: React.FC<BibleSelectorProps> = ({ onSelectionChange }) => {
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verseStart, setVerseStart] = useState<string>('');
  const [verseEnd, setVerseEnd] = useState<string>('');

  const selectedBook = bibleBooks[selectedBookIndex];

  useEffect(() => {
    setVerseStart('');
    setVerseEnd('');
  }, [selectedChapter, selectedBookIndex]);

  useEffect(() => {
    let verseText = '';
    if (verseStart && verseEnd) verseText = `:${verseStart}-${verseEnd}`;
    else if (verseStart) verseText = `:${verseStart}`;
    const fullReference = `${selectedBook.name} ${selectedChapter}${verseText}`;
    onSelectionChange(fullReference);
  }, [selectedBookIndex, selectedChapter, verseStart, verseEnd, onSelectionChange]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookIndex(Number(e.target.value));
    setSelectedChapter(1);
  };

  const goToPrevChapter = () => {
    if (selectedChapter > 1) setSelectedChapter(prev => prev - 1);
    else if (selectedBookIndex > 0) {
      const newBookIndex = selectedBookIndex - 1;
      setSelectedBookIndex(newBookIndex);
      setSelectedChapter(bibleBooks[newBookIndex].chapters);
    }
  };

  const goToNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) setSelectedChapter(prev => prev + 1);
    else if (selectedBookIndex < bibleBooks.length - 1) {
      setSelectedBookIndex(prev => prev + 1);
      setSelectedChapter(1);
    }
  };

  const adjustVerse = (type: 'start' | 'end', delta: number) => {
    if (type === 'start') {
      const val = parseInt(verseStart || '0') + delta;
      setVerseStart(val > 0 ? val.toString() : '');
    } else {
      const val = parseInt(verseEnd || (verseStart || '0')) + delta;
      setVerseEnd(val > 0 ? val.toString() : '');
    }
  };

  return (
    <div className="bg-slate-50 p-4 md:p-6 rounded-[1.5rem] border border-slate-200 animate-fade-in flex flex-col gap-5 shadow-sm">
      
      {/* Row 1: Book and Chapter Selection */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Book Select - Full width on mobile, 2/3 on desktop */}
        <div className="flex-1 md:flex-[2] flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Livro</label>
          <div className="relative group">
            <select
              value={selectedBookIndex}
              onChange={handleBookChange}
              className="w-full h-14 appearance-none bg-white border border-slate-300 text-slate-800 px-4 pr-10 rounded-2xl text-base md:text-lg font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm cursor-pointer group-hover:border-brand-300"
            >
              <optgroup label="Antigo Testamento" className="font-sans">
                {bibleBooks.map((book, index) => book.testament === 'VT' && <option key={book.name} value={index}>{book.name}</option>)}
              </optgroup>
              <optgroup label="Novo Testamento" className="font-sans">
                {bibleBooks.map((book, index) => book.testament === 'NT' && <option key={book.name} value={index}>{book.name}</option>)}
              </optgroup>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-brand-500 transition-colors" size={20} />
          </div>
        </div>

        {/* Chapter Select - Full width on mobile, 1/3 on desktop */}
        <div className="flex-1 md:flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capítulo</label>
          <div className="relative group">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="w-full h-14 appearance-none bg-white border border-slate-300 text-slate-800 px-4 pr-10 rounded-2xl text-base md:text-lg font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm cursor-pointer group-hover:border-brand-300"
            >
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-brand-500 transition-colors" size={20} />
          </div>
        </div>
      </div>

      {/* Row 2: Verses Selection - Side by side on mobile for efficiency */}
      <div className="grid grid-cols-2 gap-3 md:gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 truncate">Versículo Início</label>
          <div className="flex h-12 md:h-14 bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500 transition-all">
            <button 
              onClick={() => adjustVerse('start', -1)}
              className="w-10 md:w-12 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 active:bg-slate-100 transition-colors border-r border-slate-100"
            >
              <Minus size={18} />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value.replace(/\D/g, ''))}
              placeholder="1"
              className="flex-grow w-full text-center text-slate-900 font-bold outline-none placeholder:text-slate-300"
            />
            <button 
              onClick={() => adjustVerse('start', 1)}
              className="w-10 md:w-12 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 active:bg-slate-100 transition-colors border-l border-slate-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 truncate">Versículo Fim</label>
          <div className="flex h-12 md:h-14 bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500 transition-all">
            <button 
              onClick={() => adjustVerse('end', -1)}
              className="w-10 md:w-12 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 active:bg-slate-100 transition-colors border-r border-slate-100"
            >
              <Minus size={18} />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value.replace(/\D/g, ''))}
              placeholder="-"
              className="flex-grow w-full text-center text-slate-900 font-bold outline-none placeholder:text-slate-300"
            />
            <button 
              onClick={() => adjustVerse('end', 1)}
              className="w-10 md:w-12 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 active:bg-slate-100 transition-colors border-l border-slate-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="flex items-center justify-between bg-slate-100/50 p-2 rounded-2xl gap-2 border border-slate-200/50 mt-1">
        <button 
          onClick={goToPrevChapter}
          disabled={selectedBookIndex === 0 && selectedChapter === 1}
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-600 active:scale-95 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronsLeft size={22} />
        </button>
        
        <div className="flex-grow text-center px-2">
          <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-tight block leading-tight">
            {selectedBook.name}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Capítulo {selectedChapter}
          </span>
        </div>

        <button 
          onClick={goToNextChapter}
          disabled={selectedBookIndex === bibleBooks.length - 1 && selectedChapter === selectedBook.chapters}
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-600 active:scale-95 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronsRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default BibleSelector;
