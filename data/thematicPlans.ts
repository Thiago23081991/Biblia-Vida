
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
  // --- PLANO DE NOVOS CONVERTIDOS (SIMPLIFICADO) ---
  {
    id: 'novos-convertidos',
    title: 'Primeiros Passos',
    description: 'Uma jornada simples e essencial para quem está começando sua caminhada com Jesus hoje. Entenda o básico da fé.',
    duration: 5,
    category: 'Vida Cristã',
    icon: '🌱',
    color: 'from-green-400 to-emerald-600',
    days: [
      { day: 1, reference: 'João 3:16', focus: 'Deus ama você de verdade' },
      { day: 2, reference: '1 João 1:9', focus: 'Você pode conversar com Deus' },
      { day: 3, reference: 'Salmos 119:105', focus: 'A Bíblia é seu guia diário' },
      { day: 4, reference: 'Mateus 6:6-8', focus: 'Aprendendo a Orar' },
      { day: 5, reference: 'Hebreus 10:25', focus: 'Caminhando com novos amigos' },
    ]
  },

  // --- PLANOS PARA JOVENS ---
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

  // --- OUTROS PLANOS ---
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
