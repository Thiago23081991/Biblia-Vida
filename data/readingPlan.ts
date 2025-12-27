
import { ReadingPlanType } from '../types';
import { bibleBooks, BibleBook } from './bibleBooks';

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

// Lista de Livros em Ordem Cronológica Histórica Aproximada
const chronologicalOrderNames = [
  "Gênesis", "Jó", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Crônicas", "Salmos", "Cânticos", "Provérbios", "Eclesiastes", 
  "1 Reis", "2 Reis", "2 Crônicas", "Isaías", "Miqueias", "Oseias", "Amós", "Naum", "Sofonias", 
  "Jeremias", "Lamentações", "Habacuque", "Daniel", "Ezequiel", "Obadias", "Ageu", "Zacarias", 
  "Ester", "Esdras", "Neemias", "Malaquias", "Joel", "Jonas", 
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Tiago", "Gálatas", "1 Tessalonicenses", 
  "2 Tessalonicenses", "1 Coríntios", "2 Coríntios", "Romanos", "Efésios", "Filipenses", 
  "Colossenses", "Filemom", "1 Timóteo", "Tito", "1 Pedro", "2 Timóteo", "2 Pedro", "Hebreus", 
  "Judas", "1 João", "2 João", "3 João", "Apocalipse"
];

// Mapeia os nomes para os objetos completos com número de capítulos
const chronologicalBooks: BibleBook[] = chronologicalOrderNames
  .map(name => bibleBooks.find(b => b.name === name))
  .filter((b): b is BibleBook => !!b);

// Helper genérico para calcular referência baseada em uma lista de livros (Canônica ou Cronológica)
const getReferenceFromBookList = (startIndex: number, count: number, bookList: BibleBook[]): string => {
  let currentGlobal = 0;

  // Encontrar o início
  for (const book of bookList) {
    if (currentGlobal + book.chapters >= startIndex) {
      const chapterInBook = startIndex - currentGlobal;
      
      // Encontrar o fim (pode estar no mesmo livro ou no próximo)
      const endIndex = startIndex + count - 1;
      let tempGlobal = currentGlobal;
      
      for (const endBook of bookList.slice(bookList.indexOf(book))) {
        if (tempGlobal + endBook.chapters >= endIndex) {
          const endChapterInBook = endIndex - tempGlobal;
          
          if (endBook.name === book.name) {
             // Caso especial para livros de 1 capítulo (Obadias, Judas, etc)
             if (book.chapters === 1) return `${book.name} 1`;
             return chapterInBook === endChapterInBook 
              ? `${book.name} ${chapterInBook}`
              : `${book.name} ${chapterInBook}-${endChapterInBook}`;
          } else {
            return `${book.name} ${chapterInBook} - ${endBook.name} ${endChapterInBook}`;
          }
        }
        tempGlobal += endBook.chapters;
      }
      // Fallback seguro para o final da lista
      return `${book.name} ${chapterInBook} - Final`;
    }
    currentGlobal += book.chapters;
  }
  return "Leitura Concluída";
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
  const dayOfYear = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)) - 1);

  const TOTAL_CHAPTERS = 1189;
  const TOTAL_DAYS = 365;
  const chaptersPerDayRatio = TOTAL_CHAPTERS / TOTAL_DAYS; 

  // Cálculos comuns para planos lineares (Canônico e Cronológico)
  const startChapter = Math.floor(dayOfYear * chaptersPerDayRatio) + 1;
  const nextDayStart = Math.floor((dayOfYear + 1) * chaptersPerDayRatio) + 1;
  const count = Math.max(1, nextDayStart - startChapter);

  switch (type) {
    case ReadingPlanType.CANONICAL:
      return {
        day, month,
        reference: getReferenceFromBookList(startChapter, count, bibleBooks),
        title: "Caminho Linear",
        description: `Ordem da Bíblia (${count} capítulos)`,
        type,
        color: "bg-brand-900"
      };

    case ReadingPlanType.CHRONOLOGICAL:
      return {
        day, month,
        reference: getReferenceFromBookList(startChapter, count, chronologicalBooks),
        title: "Linha do Tempo",
        description: `Ordem Histórica (${count} capítulos)`,
        type,
        color: "bg-amber-700"
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
        description: "Antigo, Novo e Sabedoria",
        type,
        color: "bg-emerald-900"
      };

    case ReadingPlanType.REDEMPTIVE:
      const redemptiveRef = dayOfYear < 100 
        ? `${ntBooks[dayOfYear % 4]} ${(day % 5) + 1}`
        : `${vtBooks[dayOfYear % vtBooks.length]} ${(day % 5) + 1}`;
      
      return {
        day, month,
        reference: redemptiveRef,
        title: "Coração da Bíblia",
        description: "Foco em Cristo e Redenção",
        type,
        color: "bg-rose-800"
      };

    default:
      return getReadingForDate(date, ReadingPlanType.CANONICAL);
  }
};
