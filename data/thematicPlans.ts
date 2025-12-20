
export interface StudyDay {
  day: number;
  reference: string;
  focus: string;
}

export interface ThematicPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // em dias
  category: 'Vida Cristã' | 'Emoções' | 'Doutrina' | 'Personagens';
  icon: string;
  color: string;
  days: StudyDay[];
}

export const thematicPlans: ThematicPlan[] = [
  {
    id: 'ansiedade',
    title: 'Vencendo a Ansiedade',
    description: 'Encontre a paz que excede todo o entendimento em momentos de aflição.',
    duration: 7,
    category: 'Emoções',
    icon: '🍃',
    color: 'from-teal-500 to-emerald-600',
    days: [
      { day: 1, reference: 'Filipenses 4:4-7', focus: 'A Paz de Deus' },
      { day: 2, reference: 'Mateus 6:25-34', focus: 'Buscando o Reino Primeiro' },
      { day: 3, reference: '1 Pedro 5:6-7', focus: 'Lançando Ansiedades' },
      { day: 4, reference: 'Salmos 23', focus: 'O Bom Pastor' },
      { day: 5, reference: 'Salmos 42', focus: 'Esperança na Alma' },
      { day: 6, reference: 'Isaías 41:10', focus: 'Não Temas' },
      { day: 7, reference: '2 Timóteo 1:7', focus: 'Espírito de Poder e Equilíbrio' },
    ]
  },
  {
    id: 'lideranca-impacto',
    title: 'Liderança de Impacto',
    description: 'Aprenda a liderar como Jesus, servindo e inspirando com integridade.',
    duration: 7,
    category: 'Vida Cristã',
    icon: '👑',
    color: 'from-slate-700 to-slate-900',
    days: [
      { day: 1, reference: 'João 13:1-17', focus: 'O Líder que Serve' },
      { day: 2, reference: 'Filipenses 2:1-11', focus: 'A Mente de Cristo' },
      { day: 3, reference: 'Neemias 1', focus: 'Liderança e Oração' },
      { day: 4, reference: 'Êxodo 18:13-27', focus: 'O Poder da Delegação' },
      { day: 5, reference: '1 Timóteo 3', focus: 'O Caráter do Líder' },
      { day: 6, reference: 'Josué 1', focus: 'Coragem e Obediência' },
      { day: 7, reference: '2 Timóteo 4:1-8', focus: 'O Legado Final' },
    ]
  },
  {
    id: 'coracao-davi',
    title: 'O Coração de Davi',
    description: 'Uma jornada pela vida do pastor que se tornou rei e amigo de Deus.',
    duration: 7,
    category: 'Personagens',
    icon: '🛡️',
    color: 'from-amber-600 to-yellow-700',
    days: [
      { day: 1, reference: '1 Samuel 16:1-13', focus: 'Escolhido por Deus' },
      { day: 2, reference: '1 Samuel 17', focus: 'Enfrentando Gigantes' },
      { day: 3, reference: '1 Samuel 24', focus: 'Respeito à Autoridade' },
      { day: 4, reference: '2 Samuel 11', focus: 'O Perigo da Queda' },
      { day: 5, reference: 'Salmos 51', focus: 'Um Coração Contrito' },
      { day: 6, reference: 'Salmos 23', focus: 'O Pastor e o Rei' },
      { day: 7, reference: 'Atos 13:22', focus: 'O Testemunho de Deus' },
    ]
  },
  {
    id: 'novos-convertidos',
    title: 'Primeiros Passos',
    description: 'Um guia essencial para quem acabou de decidir seguir a Jesus.',
    duration: 5,
    category: 'Vida Cristã',
    icon: '🌱',
    color: 'from-blue-500 to-indigo-600',
    days: [
      { day: 1, reference: 'João 3:1-16', focus: 'O Novo Nascimento' },
      { day: 2, reference: 'Efésios 2:1-10', focus: 'Salvos pela Graça' },
      { day: 3, reference: 'Romanos 12:1-2', focus: 'Transformação da Mente' },
      { day: 4, reference: 'Mateus 28:18-20', focus: 'A Grande Comissão' },
      { day: 5, reference: '2 Coríntios 5:17-21', focus: 'Nova Criatura' },
    ]
  },
  {
    id: 'identidade-cristo',
    title: 'Identidade em Cristo',
    description: 'Descubra quem você realmente é através do que Deus diz sobre você.',
    duration: 7,
    category: 'Doutrina',
    icon: '💎',
    color: 'from-purple-600 to-fuchsia-700',
    days: [
      { day: 1, reference: 'Gênesis 1:26-27', focus: 'Criado à Imagem de Deus' },
      { day: 2, reference: 'João 1:12', focus: 'Filho de Deus' },
      { day: 3, reference: 'Efésios 1:3-14', focus: 'Escolhido e Selado' },
      { day: 4, reference: 'Gálatas 2:20', focus: 'Cristo Vive em Mim' },
      { day: 5, reference: 'Romanos 8:31-39', focus: 'Mais que Vencedor' },
      { day: 6, reference: '1 Pedro 2:9', focus: 'Geração Eleita' },
      { day: 7, reference: 'Apocalipse 2:17', focus: 'O Novo Nome' },
    ]
  },
  {
    id: 'esperanca-luto',
    title: 'Esperança no Luto',
    description: 'Conforto e força para atravessar o vale da sombra da morte.',
    duration: 5,
    category: 'Emoções',
    icon: '🕯️',
    color: 'from-slate-400 to-slate-600',
    days: [
      { day: 1, reference: 'João 11:1-44', focus: 'Jesus Chora e Age' },
      { day: 2, reference: '2 Coríntios 1:3-7', focus: 'O Deus de Toda Consolação' },
      { day: 3, reference: 'Salmos 34', focus: 'Perto do Quebrado' },
      { day: 4, reference: '1 Tessalonicenses 4:13-18', focus: 'A Nossa Esperança' },
      { day: 5, reference: 'Apocalipse 21:1-4', focus: 'O Fim da Dor' },
    ]
  },
  {
    id: 'financas-biblicas',
    title: 'Mordomia Fiel',
    description: 'Princípios bíblicos para gerir seus recursos com sabedoria.',
    duration: 5,
    category: 'Vida Cristã',
    icon: '💰',
    color: 'from-emerald-700 to-green-800',
    days: [
      { day: 1, reference: 'Mateus 6:19-24', focus: 'Onde está seu tesouro?' },
      { day: 2, reference: 'Provérbios 22:7', focus: 'O Perigo das Dívidas' },
      { day: 3, reference: 'Malaquias 3:10', focus: 'Alegria da Generosidade' },
      { day: 4, reference: 'Lucas 16:1-13', focus: 'Administrador Fiel' },
      { day: 5, reference: 'Filipenses 4:11-13', focus: 'O Segredo do Contentamento' },
    ]
  },
  {
    id: 'sermao-monte',
    title: 'O Sermão do Monte',
    description: 'Mergulhe no ensinamento mais famoso de Jesus sobre o Reino.',
    duration: 10,
    category: 'Doutrina',
    icon: '🏔️',
    color: 'from-orange-500 to-red-600',
    days: [
      { day: 1, reference: 'Mateus 5:1-12', focus: 'As Bem-aventuranças' },
      { day: 2, reference: 'Mateus 5:13-16', focus: 'Sal e Luz' },
      { day: 3, reference: 'Mateus 5:17-48', focus: 'O Cumprimento da Lei' },
      { day: 4, reference: 'Mateus 6:1-4', focus: 'A Esmola' },
      { day: 5, reference: 'Mateus 6:5-15', focus: 'A Oração do Pai Nosso' },
      { day: 6, reference: 'Mateus 6:16-18', focus: 'O Jejum' },
      { day: 7, reference: 'Mateus 6:19-24', focus: 'Tesouros no Céu' },
      { day: 8, reference: 'Mateus 7:1-6', focus: 'Sobre Julgar' },
      { day: 9, reference: 'Mateus 7:7-12', focus: 'Peça, Busque e Bata' },
      { day: 10, reference: 'Mateus 7:24-27', focus: 'Os Dois Alicerces' },
    ]
  }
];
