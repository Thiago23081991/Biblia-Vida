
import { ReadingPlanType } from '../types';
import { bibleBooks } from './bibleBooks';

export interface DailyReading {
  day: number;
  month: number;
  reference: string;
  references?: { part1: string; part2: string; part3: string };
  title: string;
  description: string;
  type: ReadingPlanType;
  color: string;
}

// Helper para encontrar a referência baseada no índice global de capítulos (1-1189)
const getReferenceFromGlobalIndex = (startIndex: number, count: number): string => {
  let currentGlobal = 0;

  // Encontrar o início
  for (const book of bibleBooks) {
    if (currentGlobal + book.chapters >= startIndex) {
      const chapterInBook = startIndex - currentGlobal;
      
      // Encontrar o fim (pode estar no mesmo livro ou no próximo)
      const endIndex = startIndex + count - 1;
      let tempGlobal = currentGlobal;
      
      for (const endBook of bibleBooks.slice(bibleBooks.indexOf(book))) {
        if (tempGlobal + endBook.chapters >= endIndex) {
          const endChapterInBook = endIndex - tempGlobal;
          if (endBook.name === book.name) {
            return `${book.name} ${chapterInBook}-${endChapterInBook}`;
          } else {
            return `${book.name} ${chapterInBook} - ${endBook.name} ${endChapterInBook}`;
          }
        }
        tempGlobal += endBook.chapters;
      }
      // Se estourar o Apocalipse, trava no último
      return `${book.name} ${chapterInBook} - Apocalipse 22`;
    }
    currentGlobal += book.chapters;
  }
  return "Apocalipse 20-22";
};

const vtBooks = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Isaías", "Jeremias", "Ezequiel"];
const ntBooks = ["Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses", "1 Tessalonicenses", "2 Tessalonicenses", "Hebreus", "Apocalipse"];
const poeticBooks = ["Salmos", "Provérbios", "Eclesiastes", "Jó"];

export const getReadingForDate = (date: Date, type: ReadingPlanType): DailyReading => {
  const day = date.getDate();
  const month = date.getMonth();
  
  // Cálculo do dia do ano (1 de Jan = 0)
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) - 1;

  switch (type) {
    case ReadingPlanType.CANONICAL:
      // Começa no capítulo 1 no dia 0 (1º de Jan)
      // Cada dia avança 3 capítulos
      const globalStartChapter = (dayOfYear * 3) + 1;
      const ref = getReferenceFromGlobalIndex(globalStartChapter, 3);
      
      return {
        day, month,
        reference: ref,
        title: "Caminho Linear",
        description: "A Bíblia de Gênesis a Apocalipse (3 capítulos por dia)",
        type,
        color: "bg-brand-900"
      };

    case ReadingPlanType.COMBINED:
      const p1 = `${vtBooks[dayOfYear % vtBooks.length]} ${(day % 5) + 1}`;
      const p2 = `${ntBooks[dayOfYear % ntBooks.length]} ${(day % 3) + 1}`;
      const p3 = `${poeticBooks[dayOfYear % poeticBooks.length]} ${(day % 10) + 1}`;
      
      return {
        day, month,
        reference: `${p1}, ${p2} e ${p3}`,
        references: {
          part1: p1,
          part2: p2,
          part3: p3
        },
        title: "Mesa Farta",
        description: "Nutrição diária em toda a Escritura",
        type,
        color: "bg-emerald-900"
      };

    case ReadingPlanType.CHRONOLOGICAL:
      const chronoRef = dayOfYear < 30 ? `Gênesis e Jó` : `1 Crônicas e Profetas`;
      return {
        day, month,
        reference: `${chronoRef} (Cap. ${day % 15 + 1})`,
        title: "Linha do Tempo",
        description: "Os eventos na ordem histórica",
        type,
        color: "bg-amber-700"
      };

    case ReadingPlanType.REDEMPTIVE:
      const redemptiveRef = dayOfYear < 100 
        ? `${ntBooks[dayOfYear % 4]} ${(day % 5) + 1}`
        : `${vtBooks[dayOfYear % vtBooks.length]} ${(day % 5) + 1}`;
      
      return {
        day, month,
        reference: redemptiveRef,
        title: "Coração da Bíblia",
        description: "Cristo como o centro da história",
        type,
        color: "bg-rose-800"
      };

    default:
      return getReadingForDate(date, ReadingPlanType.CANONICAL);
  }
};
