import React, { useState, useEffect } from 'react';
import { bibleBooks } from '../data/bibleBooks';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface BibleSelectorProps {
  onSelectionChange: (text: string) => void;
}

const BibleSelector: React.FC<BibleSelectorProps> = ({ onSelectionChange }) => {
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  
  // Verse selection states
  const [verseStart, setVerseStart] = useState<string>('');
  const [verseEnd, setVerseEnd] = useState<string>('');

  const selectedBook = bibleBooks[selectedBookIndex];

  // Reset verses when chapter changes
  useEffect(() => {
    setVerseStart('');
    setVerseEnd('');
  }, [selectedChapter, selectedBookIndex]);

  // Update parent whenever selection changes
  useEffect(() => {
    let verseText = '';
    
    if (verseStart && verseEnd) {
      verseText = `:${verseStart}-${verseEnd}`;
    } else if (verseStart) {
      verseText = `:${verseStart}`;
    }

    const fullReference = `${selectedBook.name} ${selectedChapter}${verseText}`;
    onSelectionChange(fullReference);
  }, [selectedBookIndex, selectedChapter, verseStart, verseEnd, onSelectionChange]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookIndex(Number(e.target.value));
    setSelectedChapter(1);
    setVerseStart('');
    setVerseEnd('');
  };

  // --- Navigation Logic ---

  const goToPrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else if (selectedBookIndex > 0) {
      // Go to previous book, last chapter
      const newBookIndex = selectedBookIndex - 1;
      setSelectedBookIndex(newBookIndex);
      setSelectedChapter(bibleBooks[newBookIndex].chapters);
    }
  };

  const goToNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(prev => prev + 1);
    } else if (selectedBookIndex < bibleBooks.length - 1) {
      // Go to next book, first chapter
      setSelectedBookIndex(prev => prev + 1);
      setSelectedChapter(1);
    }
  };

  const goToPrevVerse = () => {
    if (!verseStart) return;
    
    const start = parseInt(verseStart);
    if (isNaN(start) || start <= 1) return;

    const newStart = start - 1;
    setVerseStart(newStart.toString());

    // If there is a range, shift the end verse too
    if (verseEnd) {
      const end = parseInt(verseEnd);
      if (!isNaN(end)) {
        setVerseEnd((end - 1).toString());
      }
    }
  };

  const goToNextVerse = () => {
    // If no verse selected, start at 1
    if (!verseStart) {
      setVerseStart('1');
      return;
    }

    const start = parseInt(verseStart);
    if (isNaN(start)) return;

    const newStart = start + 1;
    setVerseStart(newStart.toString());

    // If there is a range, shift the end verse too
    if (verseEnd) {
      const end = parseInt(verseEnd);
      if (!isNaN(end)) {
        setVerseEnd((end + 1).toString());
      }
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Book Selector */}
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Livro</label>
          <div className="relative">
            <select
              value={selectedBookIndex}
              onChange={handleBookChange}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <optgroup label="Antigo Testamento">
                {bibleBooks.map((book, index) => (
                  book.testament === 'VT' && (
                    <option key={book.name} value={index}>{book.name}</option>
                  )
                ))}
              </optgroup>
              <optgroup label="Novo Testamento">
                {bibleBooks.map((book, index) => (
                  book.testament === 'NT' && (
                    <option key={book.name} value={index}>{book.name}</option>
                  )
                ))}
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Chapter Selector */}
        <div className="md:col-span-3 relative">
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Capítulo</label>
          <div className="relative">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Verse Selection */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Vers. Início</label>
            <input
              type="number"
              min="1"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value)}
              placeholder="1"
              className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Vers. Fim</label>
            <input
              type="number"
              min={verseStart || "1"}
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
              placeholder="Fim"
              className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-100 rounded-lg p-2 gap-3 border border-slate-200">
        
        {/* Chapter Nav */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={goToPrevChapter}
            disabled={selectedBookIndex === 0 && selectedChapter === 1}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Capítulo Anterior"
          >
            <ChevronsLeft size={16} />
            <span className="md:hidden lg:inline">Cap. Ant.</span>
          </button>
          
          <button 
            onClick={goToNextChapter}
            disabled={selectedBookIndex === bibleBooks.length - 1 && selectedChapter === selectedBook.chapters}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Próximo Capítulo"
          >
            <span className="md:hidden lg:inline">Próx. Cap.</span>
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Current Selection Display */}
        <div className="text-sm font-semibold text-brand-800 hidden md:block">
           {selectedBook.name} {selectedChapter}
           {verseStart ? `:${verseStart}` : ''}
           {verseStart && verseEnd ? `-${verseEnd}` : ''}
        </div>

        {/* Verse Nav */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={goToPrevVerse}
            disabled={!verseStart || parseInt(verseStart) <= 1}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Versículo Anterior"
          >
            <ChevronLeft size={16} />
            <span className="md:hidden lg:inline">Vers. Ant.</span>
          </button>
          
          <button 
            onClick={goToNextVerse}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-colors"
            title="Próximo Versículo"
          >
            <span className="md:hidden lg:inline">Próx. Vers.</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BibleSelector;