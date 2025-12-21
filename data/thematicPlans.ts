
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
  category: 'Vida Cristã' | 'Emoções' | 'Doutrina' | 'Personagens' | 'Jovens' | 'Desafios';
  icon: string;
  color: string;
  days: StudyDay[];
}

// Funções para gerar referências lógicas para planos longos
const generateCanonicalPlan = (days: number): StudyDay[] => {
  // Simplificação: 1189 capítulos divididos por X dias
  const totalChapters = 1189;
  const chaptersPerDay = Math.ceil(totalChapters / days);
  
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    reference: `Trecho do Dia ${i + 1} (${chaptersPerDay} cap/dia)`,
    focus: `Leitura Sequencial - Progresso ${Math.round(((i+1)/days)*100)}%`
  }));
};

export const thematicPlans: ThematicPlan[] = [
  // --- DESAFIOS DE TEMPO ---
  {
    id: '7-dias-fundamentos',
    title: '7 Dias: Fundamentos',
    description: 'Os pilares da fé cristã em uma semana intensa de reflexão sobre os textos mais cruciais da Bíblia.',
    duration: 7,
    category: 'Desafios',
    icon: '🔥',
    color: 'from-amber-400 to-amber-700',
    days: [
      { day: 1, reference: 'Gênesis 1', focus: 'A Criação e o Início' },
      { day: 2, reference: 'Êxodo 20', focus: 'A Lei de Deus' },
      { day: 3, reference: 'Salmos 23', focus: 'O Cuidado do Pastor' },
      { day: 4, reference: 'Isaías 53', focus: 'O Messias Sofredor' },
      { day: 5, reference: 'Lucas 2', focus: 'O Nascimento de Jesus' },
      { day: 6, reference: 'João 3', focus: 'O Novo Nascimento' },
      { day: 7, reference: 'Romanos 8', focus: 'Vida no Espírito' },
    ]
  },
  {
    id: '30-dias-evangelhos',
    title: '30 Dias: Vida de Jesus',
    description: 'Mergulhe na jornada terrestre do Messias. Leia os 4 Evangelhos em um mês.',
    duration: 30,
    category: 'Desafios',
    icon: '✝️',
    color: 'from-yellow-500 to-brand-600',
    days: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      reference: i < 8 ? `Mateus ${i+1}` : i < 15 ? `Marcos ${i-7}` : i < 23 ? `Lucas ${i-14}` : `João ${i-22}`,
      focus: 'Seguindo os passos do Mestre'
    }))
  },
  {
    id: '60-dias-nt',
    title: '60 Dias: Novo Testamento',
    description: 'Do Evangelho de Mateus ao Apocalipse. Uma visão completa da nova aliança em 2 meses.',
    duration: 60,
    category: 'Desafios',
    icon: '📖',
    color: 'from-brand-400 to-yellow-600',
    days: generateCanonicalPlan(60).map(d => ({ ...d, focus: 'Mergulho no Novo Testamento' }))
  },
  {
    id: '90-dias-panorama',
    title: '90 Dias: Panorama Bíblico',
    description: 'Uma seleção dos capítulos mais importantes do Gênesis ao Apocalipse em 3 meses.',
    duration: 90,
    category: 'Desafios',
    icon: '🌍',
    color: 'from-slate-400 to-slate-700',
    days: generateCanonicalPlan(90).map(d => ({ ...d, focus: 'Caminhando pela História da Redenção' }))
  },
  {
    id: '1-ano-atos',
    title: '1 Ano: Bíblia Toda',
    description: 'O compromisso máximo. Leia a Bíblia inteira (1.189 capítulos) em 365 dias.',
    duration: 365,
    category: 'Desafios',
    icon: '👑',
    color: 'from-brand-600 to-black',
    days: generateCanonicalPlan(365).map(d => ({ ...d, focus: 'Alimento Diário para a Alma' }))
  },

  // --- PLANOS TEMÁTICOS ---
  {
    id: 'novos-convertidos',
    title: 'Primeiros Passos',
    description: 'Uma jornada simples e essencial para quem está começando sua caminhada com Jesus.',
    duration: 5,
    category: 'Vida Cristã',
    icon: '🌱',
    color: 'from-green-400 to-emerald-600',
    days: [
      { day: 1, reference: 'João 3:1-16', focus: 'O Novo Nascimento' },
      { day: 2, reference: '1 João 1:5-10', focus: 'Andando na Luz' },
      { day: 3, reference: 'Efésios 2:1-10', focus: 'Salvos pela Graça' },
      { day: 4, reference: 'Filipenses 4:4-9', focus: 'A Paz de Deus' },
      { day: 5, reference: 'Mateus 6:5-15', focus: 'Aprendendo a Orar' },
    ]
  },
  {
    id: 'vencendo-ansiedade',
    title: 'Vencendo a Ansiedade',
    description: 'Encontre descanso e confiança nas promessas de Deus para os dias difíceis.',
    duration: 5,
    category: 'Emoções',
    icon: '🧘',
    color: 'from-blue-400 to-indigo-600',
    days: [
      { day: 1, reference: 'Mateus 6:25-34', focus: 'Não andeis ansiosos' },
      { day: 2, reference: 'Filipenses 4:6-7', focus: 'A Paz que excede entendimento' },
      { day: 3, reference: '1 Pedro 5:6-7', focus: 'Lançando sobre Ele o cuidado' },
      { day: 4, reference: 'Salmos 42', focus: 'Por que te abates ó minha alma?' },
      { day: 5, reference: 'Isaías 41:10', focus: 'Eu te ajudo e te sustento' },
    ]
  }
];
