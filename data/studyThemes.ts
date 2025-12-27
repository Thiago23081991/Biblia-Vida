
import { BookOpen, Users, Heart, Crown, Anchor, Zap, Shield, Sun, Gem, Home, Flame, Star } from 'lucide-react';

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
    id: 'sermon_mount',
    name: 'O Sermão do Monte',
    icon: Sun,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    topics: [
      { title: 'As Bem-Aventuranças', ref: 'Mateus 5:3-12' },
      { title: 'Sal da Terra e Luz do Mundo', ref: 'Mateus 5:13-16' },
      { title: 'A Lei e os Profetas', ref: 'Mateus 5:17-20' },
      { title: 'Sobre a Ira e Reconciliação', ref: 'Mateus 5:21-26' },
      { title: 'Amor aos Inimigos', ref: 'Mateus 5:43-48' },
      { title: 'Como Dar Esmolas', ref: 'Mateus 6:1-4' },
      { title: 'A Oração do Pai Nosso', ref: 'Mateus 6:9-13' },
      { title: 'O Tesouro no Céu', ref: 'Mateus 6:19-24' },
      { title: 'A Ansiedade e o Cuidado de Deus', ref: 'Mateus 6:25-34' },
      { title: 'Julgar os Outros', ref: 'Mateus 7:1-6' },
      { title: 'A Porta Estreita', ref: 'Mateus 7:13-14' },
      { title: 'Os Dois Fundamentos', ref: 'Mateus 7:24-27' },
    ]
  },
  {
    id: 'names_god',
    name: 'Os Nomes de Deus',
    icon: Gem,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    topics: [
      { title: 'Elohim (O Criador)', ref: 'Gênesis 1:1' },
      { title: 'El Shaddai (Todo-Poderoso)', ref: 'Gênesis 17:1' },
      { title: 'Jeová Jireh (Deus Proverá)', ref: 'Gênesis 22:14' },
      { title: 'Jeová Rapha (O Senhor que Cura)', ref: 'Êxodo 15:26' },
      { title: 'Jeová Nissi (O Senhor é Minha Bandeira)', ref: 'Êxodo 17:15' },
      { title: 'Jeová Shalom (O Senhor é Paz)', ref: 'Juízes 6:24' },
      { title: 'Jeová Raah (O Senhor é meu Pastor)', ref: 'Salmos 23:1' },
      { title: 'Jeová Tsidkenu (Justiça Nossa)', ref: 'Jeremias 23:6' },
      { title: 'Jeová Shammah (O Senhor Está Ali)', ref: 'Ezequiel 48:35' },
      { title: 'Emanuel (Deus Conosco)', ref: 'Isaías 7:14' },
    ]
  },
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
      { title: 'O Rico Insensato', ref: 'Lucas 12:13-21' },
      { title: 'O Fariseu e o Publicano', ref: 'Lucas 18:9-14' },
    ]
  },
  {
    id: 'spiritual_warfare',
    name: 'Batalha Espiritual',
    icon: Shield,
    color: 'bg-slate-200 text-slate-800 border-slate-300',
    topics: [
      { title: 'A Armadura de Deus', ref: 'Efésios 6:10-18' },
      { title: 'Nossa Luta não é contra Carne', ref: 'Efésios 6:12' },
      { title: 'Resistindo ao Diabo', ref: 'Tiago 4:7' },
      { title: 'As Armas da Nossa Milícia', ref: '2 Coríntios 10:3-5' },
      { title: 'A Autoridade do Crente', ref: 'Lucas 10:19' },
      { title: 'Vencendo pelo Sangue do Cordeiro', ref: 'Apocalipse 12:11' },
      { title: 'O Leão que Ruge', ref: '1 Pedro 5:8-9' },
    ]
  },
  {
    id: 'family',
    name: 'Família e Relacionamentos',
    icon: Home,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    topics: [
      { title: 'O Casamento Cristão', ref: 'Efésios 5:22-33' },
      { title: 'Pais e Filhos', ref: 'Efésios 6:1-4' },
      { title: 'A Importância da Amizade', ref: 'Provérbios 17:17' },
      { title: 'Jugo Desigual', ref: '2 Coríntios 6:14' },
      { title: 'Unidade entre Irmãos', ref: 'Salmos 133' },
      { title: 'Cuidando dos Idosos/Viúvas', ref: '1 Timóteo 5' },
      { title: 'O Amor na Prática', ref: '1 Coríntios 13' },
    ]
  },
  {
    id: 'characters',
    name: 'Grandes Personagens',
    icon: Users,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    topics: [
      { title: 'A Vida de Davi', ref: '1 Samuel 16' },
      { title: 'Moisés e o Êxodo', ref: 'Êxodo 3' },
      { title: 'A Jornada de Paulo', ref: 'Atos 9' },
      { title: 'A Fé de Abraão', ref: 'Gênesis 12' },
      { title: 'História de José do Egito', ref: 'Gênesis 37' },
      { title: 'Pedro, o Apóstolo', ref: 'Mateus 16:18' },
      { title: 'Rute e Noemi', ref: 'Rute 1' },
      { title: 'A Rainha Ester', ref: 'Ester 4' },
      { title: 'Elias, o Profeta', ref: '1 Reis 17' },
    ]
  },
  {
    id: 'wisdom',
    name: 'Sabedoria Prática',
    icon: Anchor,
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    topics: [
      { title: 'Uso do Dinheiro', ref: '1 Timóteo 6:10' },
      { title: 'O Poder da Língua/Palavras', ref: 'Tiago 3' },
      { title: 'Preguiça vs Diligência', ref: 'Provérbios 6:6-11' },
      { title: 'Humildade vs Orgulho', ref: 'Provérbios 16:18' },
      { title: 'Planejamento e Futuro', ref: 'Tiago 4:13-15' },
      { title: 'Integridade nos Negócios', ref: 'Provérbios 11:1' },
      { title: 'Más Companhias', ref: '1 Coríntios 15:33' },
    ]
  },
  {
    id: 'promises',
    name: 'Promessas de Deus',
    icon: Star,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    topics: [
      { title: 'Vida Eterna', ref: 'João 3:16' },
      { title: 'Perdão dos Pecados', ref: '1 João 1:9' },
      { title: 'Presença Constante', ref: 'Mateus 28:20' },
      { title: 'Provisão de Necessidades', ref: 'Filipenses 4:19' },
      { title: 'Paz Interior', ref: 'João 14:27' },
      { title: 'Força na Fraqueza', ref: '2 Coríntios 12:9' },
      { title: 'Nenhuma Condenação', ref: 'Romanos 8:1' },
      { title: 'O Espírito Santo', ref: 'Atos 1:8' },
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
      { title: 'Solidão', ref: 'Salmos 68:6' },
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
      { title: 'Cura da Mulher do Fluxo de Sangue', ref: 'Marcos 5:25-34' },
    ]
  },
  {
    id: 'doctrines',
    name: 'Doutrinas Básicas',
    icon: Flame,
    color: 'bg-red-100 text-red-700 border-red-200',
    topics: [
      { title: 'A Trindade', ref: 'Mateus 28:19' },
      { title: 'Salvação pela Graça', ref: 'Efésios 2:8-9' },
      { title: 'A Divindade de Cristo', ref: 'João 1:1' },
      { title: 'O Fruto do Espírito', ref: 'Gálatas 5:22-23' },
      { title: 'A Importância da Oração', ref: 'Lucas 11' },
      { title: 'O Batismo', ref: 'Romanos 6:3-4' },
      { title: 'A Ceia do Senhor', ref: '1 Coríntios 11:23-26' },
    ]
  },
  {
    id: 'eschatology',
    name: 'Escatologia: Fim dos Tempos',
    icon: Crown,
    color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
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
