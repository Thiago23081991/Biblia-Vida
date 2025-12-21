
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
  category: 'Vida Cristã' | 'Emoções' | 'Doutrina' | 'Personagens' | 'Jovens';
  icon: string;
  color: string;
  days: StudyDay[];
}

export const thematicPlans: ThematicPlan[] = [
  // --- NOVOS PLANOS PARA JOVENS (SESSÃO EXPANDIDA) ---
  {
    id: 'logoff-inveja',
    title: 'Logoff na Inveja',
    description: 'Vencendo o jogo da comparação no Instagram e TikTok. Descubra sua beleza real.',
    duration: 5,
    category: 'Jovens',
    icon: '📵',
    color: 'from-fuchsia-500 to-purple-700',
    days: [
      { day: 1, reference: 'Salmos 139:14', focus: 'Você não é um Filtro' },
      { day: 2, reference: 'Gálatas 1:10', focus: 'Aprovação: Quem deu o Like?' },
      { day: 3, reference: '1 Timóteo 4:12', focus: 'Sua Juventude tem Valor' },
      { day: 4, reference: 'Êxodo 20:17', focus: 'O Perigo do Scroll Infinito' },
      { day: 5, reference: 'Mateus 6:33', focus: 'Foco no que é Real' },
    ]
  },
  {
    id: 'circulo-confianca',
    title: 'Círculo de Confiança',
    description: 'Como montar seu "Squad de Fé" e lidar com amizades tóxicas ou negativas.',
    duration: 5,
    category: 'Jovens',
    icon: '👥',
    color: 'from-blue-400 to-indigo-600',
    days: [
      { day: 1, reference: 'Provérbios 13:20', focus: 'Com quem você anda?' },
      { day: 2, reference: '1 Coríntios 15:33', focus: 'A Influência do Feed' },
      { day: 3, reference: 'Eclesiastes 4:9-12', focus: 'Unidade faz a Força' },
      { day: 4, reference: 'Provérbios 17:17', focus: 'Amigo de Verdade' },
      { day: 5, reference: 'João 15:13', focus: 'O Maior Exemplo de Amizade' },
    ]
  },
  {
    id: 'checkpoint-paz',
    title: 'Checkpoint de Paz',
    description: 'Pressão na escola, vestibular e ansiedade com o futuro. Dê um pause com Deus.',
    duration: 5,
    category: 'Jovens',
    icon: '🎮',
    color: 'from-emerald-400 to-cyan-600',
    days: [
      { day: 1, reference: 'Filipenses 4:6-8', focus: 'Onde mora seu Pensamento?' },
      { day: 2, reference: '2 Timóteo 1:7', focus: 'Mente Blindada, não Medrosa' },
      { day: 3, reference: '1 Pedro 5:7', focus: 'Lançando o Estresse' },
      { day: 4, reference: 'Isaías 26:3', focus: 'Paz que Não Oscila' },
      { day: 5, reference: 'Salmos 42:11', focus: 'Fale com sua Alma' },
    ]
  },
  {
    id: 'identidade-real',
    title: 'Identidade Real',
    description: 'Descubra quem você é de verdade além das redes sociais e da pressão dos outros.',
    duration: 7,
    category: 'Jovens',
    icon: '🤳',
    color: 'from-violet-600 to-indigo-700',
    days: [
      { day: 1, reference: 'Gênesis 1:26-27', focus: 'Original de Fábrica' },
      { day: 2, reference: 'João 1:12', focus: 'Filho, não escravo' },
      { day: 3, reference: 'Efésios 1:3-14', focus: 'Visto e Escolhido' },
      { day: 4, reference: 'Gálatas 2:20', focus: 'Nova Versão' },
      { day: 5, reference: 'Salmos 139:13-16', focus: 'Design Inteligente' },
      { day: 6, reference: '1 Pedro 2:9', focus: 'Pertencimento' },
      { day: 7, reference: '2 Coríntios 5:17', focus: 'Reset Completo' },
    ]
  },
  {
    id: 'proposito-jogo',
    title: 'Propósito em Jogo',
    description: 'Qual é o seu papel no mundo? Entenda o plano de Deus para sua juventude.',
    duration: 5,
    category: 'Jovens',
    icon: '🎯',
    color: 'from-orange-500 to-amber-600',
    days: [
      { day: 1, reference: 'Jeremias 29:11', focus: 'O Futuro está Planejado' },
      { day: 2, reference: 'Efésios 2:10', focus: 'Obra de Arte com Função' },
      { day: 3, reference: 'Eclesiastes 12:1', focus: 'Tempo de Semear' },
      { day: 4, reference: '1 Timóteo 4:12', focus: 'Exemplo Agora, não Depois' },
      { day: 5, reference: 'Mateus 28:18-20', focus: 'A Missão de Todos' },
    ]
  },
  {
    id: 'pressao-social',
    title: 'Offline e em Paz',
    description: 'Como lidar com a pressão do grupo, comparação e os padrões do mundo.',
    duration: 5,
    category: 'Jovens',
    icon: '🛡️',
    color: 'from-rose-500 to-pink-600',
    days: [
      { day: 1, reference: 'Romanos 12:1-2', focus: 'Não entre no Molde' },
      { day: 2, reference: '1 Coríntios 10:13', focus: 'A Saída de Emergência' },
      { day: 3, reference: 'Gálatas 1:10', focus: 'Aprovação de quem?' },
      { day: 4, reference: 'Provérbios 13:20', focus: 'O Círculo de Amigos' },
      { day: 5, reference: 'Filipenses 4:11-13', focus: 'Satisfação Interna' },
    ]
  },
  {
    id: 'fe-conectada',
    title: 'Fé Conectada',
    description: 'Dicas práticas para manter uma rotina real com Deus no meio da correria.',
    duration: 7,
    category: 'Jovens',
    icon: '⚡',
    color: 'from-cyan-500 to-blue-600',
    days: [
      { day: 1, reference: 'João 15:1-8', focus: 'Wi-Fi Espiritual: Conectado' },
      { day: 2, reference: 'Tiago 4:8', focus: 'Aproximação em 2 vias' },
      { day: 3, reference: 'Salmos 119:9-11', focus: 'Limpando o Feed' },
      { day: 4, reference: 'Mateus 6:5-15', focus: 'Oração sem Filtro' },
      { day: 5, reference: 'Lucas 10:38-42', focus: 'Modo Avião: Pausa Necessária' },
      { day: 6, reference: 'Hebreus 10:24-25', focus: 'Comunidade Real' },
      { day: 7, reference: 'Apocalipse 3:20', focus: 'A Porta está Aberta' },
    ]
  },

  // --- PLANOS EXISTENTES ---
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
