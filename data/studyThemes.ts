
import { BookOpen, Users, Heart, Crown, Anchor, Zap } from 'lucide-react';

export interface StudyTopic {
  title: string;
  ref: string; // Opcional, para referência
}

export interface StudyCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  topics: StudyTopic[];
}

export const studyThemes: StudyCategory[] = [
  {
    id: 'parables',
    name: 'Parábolas de Jesus',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    topics: [
      { title: 'O Filho Pródigo', ref: 'Lucas 15:11-32' },
      { title: 'O Bom Samaritano', ref: 'Lucas 10:25-37' },
      { title: 'O Semeador', ref: 'Mateus 13:1-23' },
      { title: 'A Ovelha Perdida', ref: 'Lucas 15:1-7' },
      { title: 'O Trigo e o Joio', ref: 'Mateus 13:24-30' },
      { title: 'Os Talentos', ref: 'Mateus 25:14-30' },
      { title: 'A Casa na Rocha', ref: 'Mateus 7:24-27' },
    ]
  },
  {
    id: 'characters',
    name: 'Grandes Personagens',
    icon: Users,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    topics: [
      { title: 'A Vida de Davi', ref: '' },
      { title: 'Moisés e o Êxodo', ref: '' },
      { title: 'A Jornada de Paulo', ref: '' },
      { title: 'A Fé de Abraão', ref: '' },
      { title: 'História de José do Egito', ref: '' },
      { title: 'Pedro, o Apóstolo', ref: '' },
      { title: 'Rute e Noemi', ref: '' },
      { title: 'A Rainha Ester', ref: '' },
    ]
  },
  {
    id: 'emotions',
    name: 'Emoções e Vida',
    icon: Heart,
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    topics: [
      { title: 'Lidando com a Ansiedade', ref: 'Filipenses 4:6-7' },
      { title: 'O Poder do Perdão', ref: 'Mateus 18:21-22' },
      { title: 'Vencendo o Medo', ref: 'Isaías 41:10' },
      { title: 'Consolo no Luto', ref: 'Salmos 23' },
      { title: 'Gratidão', ref: '1 Tessalonicenses 5:18' },
      { title: 'Paciência na Provação', ref: 'Tiago 1' },
      { title: 'Controle da Ira', ref: 'Efésios 4:26' },
    ]
  },
  {
    id: 'miracles',
    name: 'Milagres',
    icon: Zap,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    topics: [
      { title: 'A Ressurreição de Lázaro', ref: 'João 11' },
      { title: 'A Abertura do Mar Vermelho', ref: 'Êxodo 14' },
      { title: 'Jesus Acalma a Tempestade', ref: 'Marcos 4:35-41' },
      { title: 'A Cura do Cego de Nascença', ref: 'João 9' },
      { title: 'Daniel na Cova dos Leões', ref: 'Daniel 6' },
      { title: 'Multiplicação dos Pães', ref: 'João 6' },
    ]
  },
  {
    id: 'doctrines',
    name: 'Doutrinas Básicas',
    icon: Anchor,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    topics: [
      { title: 'A Trindade', ref: '' },
      { title: 'Salvação pela Graça', ref: 'Efésios 2:8-9' },
      { title: 'A Divindade de Cristo', ref: '' },
      { title: 'O Fruto do Espírito', ref: 'Gálatas 5:22-23' },
      { title: 'A Importância da Oração', ref: '' },
      { title: 'O Batismo', ref: '' },
    ]
  },
  {
    id: 'eschatology',
    name: 'Escatologia: Daniel e Apocalipse',
    icon: Crown,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    topics: [
      { title: 'A Estátua de Nabucodonosor', ref: 'Daniel 2' },
      { title: 'As 70 Semanas', ref: 'Daniel 9' },
      { title: 'As Quatro Bestas', ref: 'Daniel 7' },
      { title: 'As 7 Cartas às Igrejas', ref: 'Apocalipse 2-3' },
      { title: 'Os Quatro Cavaleiros', ref: 'Apocalipse 6' },
      { title: 'A Marca da Besta (666)', ref: 'Apocalipse 13' },
      { title: 'O Arrebatamento da Igreja', ref: '1 Tess 4:16-17' },
      { title: 'A Grande Tribulação', ref: 'Mateus 24' },
      { title: 'O Milênio', ref: 'Apocalipse 20' },
      { title: 'O Juízo Final', ref: 'Apocalipse 20:11-15' },
      { title: 'A Nova Jerusalém', ref: 'Apocalipse 21' },
    ]
  }
];
