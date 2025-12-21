
import React, { useState, useEffect } from 'react';
import { bibleBooks } from '../data/bibleBooks';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  return (
    <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 animate-fade-in flex flex-col gap-4 shadow-inner">
      <div className="flex flex-col gap-4">
        {/* Row 1: Book and Chapter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Livro</label>
            <div className="relative">
              <select
                value={selectedBookIndex}
                onChange={handleBookChange}
                className="w-full h-12 appearance-none bg-white border border-slate-300 text-slate-800 px-4 pr-10 rounded-xl text-base focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm"
              >
                <optgroup label="Antigo Testamento">
                  {bibleBooks.map((book, index) => book.testament === 'VT' && <option key={book.name} value={index}>{book.name}</option>)}
                </optgroup>
                <optgroup label="Novo Testamento">
                  {bibleBooks.map((book, index) => book.testament === 'NT' && <option key={book.name} value={index}>{book.name}</option>)}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capítulo</label>
            <div className="relative">
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                className="w-full h-12 appearance-none bg-white border border-slate-300 text-slate-800 px-4 pr-10 rounded-xl text-base focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm"
              >
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Row 2: Verses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Início</label>
            <input
              type="number"
              min="1"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value)}
              placeholder="Vers."
              className="w-full h-12 bg-white border border-slate-300 text-slate-800 px-4 rounded-xl text-base focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fim</label>
            <input
              type="number"
              min={verseStart || "1"}
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
              placeholder="Vers."
              className="w-full h-12 bg-white border border-slate-300 text-slate-800 px-4 rounded-xl text-base focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="flex items-center justify-between bg-white/50 p-2 rounded-xl gap-2 border border-slate-200">
        <button 
          onClick={goToPrevChapter}
          disabled={selectedBookIndex === 0 && selectedChapter === 1}
          className="flex-1 flex items-center justify-center h-10 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-600 active:scale-95 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronsLeft size={20} />
        </button>
        
        <div className="flex-[2] text-center">
          <span className="text-xs font-bold text-brand-900 truncate px-2 block">
            {selectedBook.name} {selectedChapter}
          </span>
        </div>

        <button 
          onClick={goToNextChapter}
          disabled={selectedBookIndex === bibleBooks.length - 1 && selectedChapter === selectedBook.chapters}
          className="flex-1 flex items-center justify-center h-10 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-600 active:scale-95 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BibleSelector;
