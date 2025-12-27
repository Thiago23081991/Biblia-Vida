
import { bibleBooks } from './bibleBooks';

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
  category: 'Vida Cristã' | 'Emoções' | 'Doutrina' | 'Personagens' | 'Jovens' | 'Desafios' | 'Crianças';
  icon: string;
  color: string;
  days: StudyDay[];
}

// Funções para gerar referências lógicas para planos longos
const generateCanonicalPlan = (days: number): StudyDay[] => {
  const totalChapters = 1189;
  const chaptersPerDay = Math.ceil(totalChapters / days);
  
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    reference: `Trecho do Dia ${i + 1} (${chaptersPerDay} cap/dia)`,
    focus: `Leitura Sequencial - Progresso ${Math.round(((i+1)/days)*100)}%`
  }));
};

// Gerador Inteligente de Planos da Bíblia Completa (Genérico para qualquer duração)
const generateFullBiblePlan = (targetDays: number): StudyDay[] => {
  const allChapters: { book: string; chapter: number; section: string }[] = [];

  // Achatando a Bíblia em uma lista única de capítulos com metadados
  bibleBooks.forEach(book => {
    let section = 'Antigo Testamento';
    if (['Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio'].includes(book.name)) section = 'O Pentateuco (Lei)';
    else if (['Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester'].includes(book.name)) section = 'Livros Históricos';
    else if (['Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cânticos'].includes(book.name)) section = 'Livros Poéticos';
    else if (['Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel'].includes(book.name)) section = 'Profetas Maiores';
    else if (['Oseias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias'].includes(book.name)) section = 'Profetas Menores';
    else if (['Mateus', 'Marcos', 'Lucas', 'João'].includes(book.name)) section = 'Os Evangelhos';
    else if (book.name === 'Atos') section = 'História da Igreja';
    else if (['Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom'].includes(book.name)) section = 'Cartas de Paulo';
    else if (book.name === 'Apocalipse') section = 'Revelação Final';
    else section = 'Cartas Gerais';

    for (let c = 1; c <= book.chapters; c++) {
      allChapters.push({ book: book.name, chapter: c, section });
    }
  });

  const plan: StudyDay[] = [];
  let currentChapterIndex = 0;

  for (let day = 1; day <= targetDays; day++) {
    // Recalcula quantos capítulos faltam dividir pelos dias restantes para manter a média precisa
    const chaptersLeft = allChapters.length - currentChapterIndex;
    const daysLeft = targetDays - day + 1;
    // Garante pelo menos 1 capítulo, arredonda para cima para terminar a tempo
    const chaptersToday = Math.max(1, Math.ceil(chaptersLeft / daysLeft));

    if (currentChapterIndex >= allChapters.length) break;

    const start = allChapters[currentChapterIndex];
    // Garante que não estoure o array
    const endIndex = Math.min(currentChapterIndex + chaptersToday - 1, allChapters.length - 1);
    const end = allChapters[endIndex];

    let ref = '';
    if (start.book === end.book) {
        ref = start.chapter === end.chapter
            ? `${start.book} ${start.chapter}`
            : `${start.book} ${start.chapter}-${end.chapter}`;
    } else {
        // Transição de livros (ex: 2 Crônicas 36 - Esdras 2)
        ref = `${start.book} ${start.chapter} - ${end.book} ${end.chapter}`;
    }

    plan.push({
        day,
        reference: ref,
        focus: `${start.section} • ${chaptersToday} Caps`
    });

    currentChapterIndex += chaptersToday;
  }

  return plan;
};

export const thematicPlans: ThematicPlan[] = [
  // --- NOVOS PLANOS PARA JOVENS ---
  {
    id: 'jovem-cultura',
    title: 'Cultura & Pressão',
    description: 'Como lidar com Instagram, vícios, ansiedade e manter a identidade cristã num mundo caótico.',
    duration: 7,
    category: 'Jovens',
    icon: '📱',
    color: 'from-zinc-600 to-slate-900',
    days: [
      { day: 1, reference: 'Romanos 12:1-2', focus: 'Não vos conformeis com este século' },
      { day: 2, reference: 'Mateus 5:27-30', focus: 'Batalha pela Pureza (Olhos e Mente)' },
      { day: 3, reference: 'Salmos 101', focus: 'Detox Digital: Vencendo Telas' },
      { day: 4, reference: 'Gênesis 1:27', focus: 'Identidade vs Ideologia' },
      { day: 5, reference: '1 Coríntios 10:23-33', focus: 'Música Secular e Liberdade' },
      { day: 6, reference: '1 Reis 19:1-18', focus: 'Depressão e a Voz de Deus' },
      { day: 7, reference: 'Daniel 1', focus: 'Fidelidade na Faculdade/Escola' },
    ]
  },
  {
    id: 'jovem-namoro',
    title: 'Namoro & Pureza',
    description: 'Guia prático sobre escolha, jugo desigual, santidade e como viver relacionamentos que honram a Deus.',
    duration: 7,
    category: 'Jovens',
    icon: '💍',
    color: 'from-rose-500 to-pink-700',
    days: [
      { day: 1, reference: '2 Coríntios 6:14-18', focus: 'O perigo do Jugo Desigual' },
      { day: 2, reference: '1 Tessalonicenses 4:3-8', focus: 'Santidade é Vontade de Deus' },
      { day: 3, reference: 'Efésios 5:1-7', focus: 'Estabelecendo Limites Claros' },
      { day: 4, reference: 'Provérbios 31:10-31', focus: 'Padrão de Virtude e Escolha' },
      { day: 5, reference: '1 Coríntios 7:25-35', focus: 'Solteirice com Propósito' },
      { day: 6, reference: 'Jeremias 17:5-9', focus: 'Dependência Emocional' },
      { day: 7, reference: '2 Timóteo 2:22', focus: 'Fugindo das Paixões da Mocidade' },
    ]
  },
  {
    id: 'jovem-apologetica',
    title: 'Perguntas Difíceis',
    description: 'Apologética básica: Deus existe? O inferno é real? A Bíblia é confiável? Respostas para sua fé.',
    duration: 7,
    category: 'Jovens',
    icon: '🧠',
    color: 'from-teal-600 to-emerald-800',
    days: [
      { day: 1, reference: 'Romanos 1:18-25', focus: 'Deus Existe? A Criação Fala' },
      { day: 2, reference: 'Habacuque 1', focus: 'Por que o mal existe?' },
      { day: 3, reference: 'Salmos 19', focus: 'Fé e Ciência: Inimigos?' },
      { day: 4, reference: 'João 14:1-7', focus: 'Jesus é o único caminho?' },
      { day: 5, reference: '2 Timóteo 3:14-17', focus: 'A Bíblia é confiável?' },
      { day: 6, reference: 'Lucas 16:19-31', focus: 'Céu e Inferno são reais?' },
      { day: 7, reference: '1 Pedro 3:13-17', focus: 'A Razão da nossa Esperança' },
    ]
  },

  // --- PLANOS PARA CRIANÇAS (NOVO) ---
  {
    id: 'kids-criacao',
    title: 'Detetives da Criação',
    description: 'Pegue sua lupa! Vamos investigar as coisas incríveis que Deus criou em 5 dias de aventuras.',
    duration: 5,
    category: 'Crianças',
    icon: '🦁',
    color: 'from-green-400 to-yellow-500',
    days: [
      { day: 1, reference: 'Gênesis 1:1-5', focus: 'A Grande Luz! (Dia e Noite)' },
      { day: 2, reference: 'Gênesis 1:20-23', focus: 'Peixes e Pássaros Coloridos' },
      { day: 3, reference: 'Gênesis 1:24-31', focus: 'Leões, Ursos e... VOCÊ!' },
      { day: 4, reference: 'Salmos 19:1-4', focus: 'O Céu Conta Histórias' },
      { day: 5, reference: 'Gênesis 2:1-3', focus: 'O Descanso do Criador' },
    ]
  },
  {
    id: 'kids-superherois',
    title: 'Super-Heróis da Fé',
    description: 'Esqueça as capas! Conheça os heróis reais que venceram gigantes e leões com a ajuda de Deus.',
    duration: 5,
    category: 'Crianças',
    icon: '🦸',
    color: 'from-blue-500 to-red-500',
    days: [
      { day: 1, reference: '1 Samuel 17', focus: 'Davi e o Gigante Golias' },
      { day: 2, reference: 'Daniel 6', focus: 'Daniel na Cova dos Leões' },
      { day: 3, reference: 'Jonas 1-2', focus: 'Jonas e o Grande Peixe' },
      { day: 4, reference: 'Êxodo 14', focus: 'Moisés Abre o Marzão' },
      { day: 5, reference: 'Juízes 16', focus: 'A Força de Sansão' },
    ]
  },
  {
    id: 'kids-agentes',
    title: 'Agentes da Bondade',
    description: 'Missões secretas para espalhar amor e alegria como Jesus ensinou. Aceita o desafio?',
    duration: 7,
    category: 'Crianças',
    icon: '🕵️',
    color: 'from-indigo-400 to-purple-500',
    days: [
      { day: 1, reference: 'Lucas 10:25-37', focus: 'Missão: O Bom Samaritano' },
      { day: 2, reference: 'Lucas 17:11-19', focus: 'Missão: Dizer Obrigado' },
      { day: 3, reference: 'Mateus 5:14-16', focus: 'Missão: Brilhar sua Luz' },
      { day: 4, reference: 'Efésios 4:32', focus: 'Missão: Perdoar o Amigo' },
      { day: 5, reference: 'João 6:1-13', focus: 'Missão: Dividir o Lanche' },
      { day: 6, reference: 'Provérbios 17:17', focus: 'Missão: Ser um Amigão' },
      { day: 7, reference: '1 João 4:7-11', focus: 'Missão Final: Deus é Amor' },
    ]
  },

  // --- DESAFIOS DE TEMPO ---
  {
    id: 'jejum-daniel',
    title: 'Jejum de Daniel (21 Dias)',
    description: 'Um propósito poderoso de 21 dias para desintoxicação espiritual, clareza mental e consagração total a Deus.',
    duration: 21,
    category: 'Desafios',
    icon: '🥗',
    color: 'from-emerald-600 to-teal-800',
    days: [
        { day: 1, reference: 'Daniel 1:8', focus: 'Propósito no Coração' },
        { day: 2, reference: 'Daniel 1:12-16', focus: 'O Teste da Fidelidade' },
        { day: 3, reference: 'Mateus 4:4', focus: 'Não só de Pão Viverá o Homem' },
        { day: 4, reference: 'Isaías 58:6', focus: 'O Jejum que Agrada a Deus' },
        { day: 5, reference: 'Salmos 51:10', focus: 'Purificação do Coração' },
        { day: 6, reference: 'Romanos 12:1-2', focus: 'Renovação da Mente' },
        { day: 7, reference: 'Daniel 9:3-4', focus: 'Buscando com Oração e Súplicas' },
        { day: 8, reference: 'Joel 2:12-13', focus: 'Rasgai o Vosso Coração' },
        { day: 9, reference: 'Mateus 6:16-18', focus: 'O Jejum Secreto' },
        { day: 10, reference: 'Salmos 63:1-5', focus: 'A Sede da Alma por Deus' },
        { day: 11, reference: 'Gálatas 5:16-17', focus: 'Carne vs Espírito' },
        { day: 12, reference: 'Tiago 4:7-10', focus: 'Humilhação Diante de Deus' },
        { day: 13, reference: 'Esdras 8:21-23', focus: 'Jejum por Proteção e Direção' },
        { day: 14, reference: 'Neemias 1:4', focus: 'Intercessão pelo Povo' },
        { day: 15, reference: 'Atos 13:2-3', focus: 'Jejum e o Chamado Missionário' },
        { day: 16, reference: 'Mateus 17:14-21', focus: 'Fé para Mover Montanhas' },
        { day: 17, reference: '1 Coríntios 9:24-27', focus: 'Disciplina Espiritual' },
        { day: 18, reference: 'Colossenses 3:1-3', focus: 'Pensando nas Coisas do Alto' },
        { day: 19, reference: 'Daniel 10:12', focus: 'A Resposta do Céu' },
        { day: 20, reference: 'Efésios 3:16-19', focus: 'Fortalecidos no Homem Interior' },
        { day: 21, reference: 'Daniel 12:3', focus: 'Brilhando como as Estrelas' },
    ]
  },
  {
    id: '7-dias-hardcore',
    title: '7 Dias: Bíblia Toda',
    description: 'Desafio extremo APENAS para os fortes. Leia a Bíblia inteira em uma semana. Média de 170 capítulos por dia.',
    duration: 7,
    category: 'Desafios',
    icon: '⚡',
    color: 'from-red-600 to-slate-900',
    days: [
      { day: 1, reference: 'Gênesis 1 - Deuteronômio 34', focus: 'O Pentateuco Completo (187 caps)' },
      { day: 2, reference: 'Josué 1 - 2 Reis 25', focus: 'Toda a História de Israel (151 caps)' },
      { day: 3, reference: '1 Crônicas 1 - Jó 42', focus: 'Pós-Exílio e Sofrimento (140 caps)' },
      { day: 4, reference: 'Salmos 1 - Cânticos 8', focus: 'Sabedoria e Poesia (201 caps)' },
      { day: 5, reference: 'Isaías 1 - Daniel 12', focus: 'Os Profetas Maiores (183 caps)' },
      { day: 6, reference: 'Oseias 1 - João 21', focus: 'Profetas Menores e 4 Evangelhos (156 caps)' },
      { day: 7, reference: 'Atos 1 - Apocalipse 22', focus: 'Igreja, Cartas e Fim dos Tempos (171 caps)' },
    ]
  },
  {
    id: '15-dias-extremo',
    title: '15 Dias: Desafio Extremo',
    description: 'Leitura completa da Bíblia em ritmo acelerado. Cerca de 80 capítulos por dia para quem busca imersão total.',
    duration: 15,
    category: 'Desafios',
    icon: '🚀',
    color: 'from-red-600 to-rose-900',
    days: generateFullBiblePlan(15)
  },
  {
    id: '30-dias-imersao',
    title: '30 Dias: Imersão Total',
    description: 'Dedique um mês inteiro à Palavra. Leitura da Bíblia completa com média de 40 capítulos diários.',
    duration: 30,
    category: 'Desafios',
    icon: '🔥',
    color: 'from-orange-500 to-red-700',
    days: generateFullBiblePlan(30)
  },
  {
    id: '90-dias-completa',
    title: '90 Dias: Bíblia Completa',
    description: 'Leia toda a Bíblia em 3 meses. Um ritmo forte (aprox. 13 capítulos/dia), ideal para estações de busca intensa.',
    duration: 90,
    category: 'Desafios',
    icon: '🏃',
    color: 'from-blue-600 to-indigo-900',
    days: generateFullBiblePlan(90)
  },
  {
    id: '31-dias-proverbios',
    title: '31 Dias de Sabedoria',
    description: 'Um capítulo de Provérbios por dia. Transforme sua mente com a sabedoria de Salomão.',
    duration: 31,
    category: 'Desafios',
    icon: '💎',
    color: 'from-cyan-500 to-blue-600',
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      reference: `Provérbios ${i + 1}`,
      focus: `Sabedoria para o dia ${i + 1}`
    }))
  },
  {
    id: '21-dias-joao',
    title: '21 Dias em João',
    description: 'Conheça o coração de Jesus através do discípulo amado. Um capítulo por dia para criar intimidade.',
    duration: 21,
    category: 'Desafios',
    icon: '🦅',
    color: 'from-indigo-500 to-violet-700',
    days: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      reference: `João ${i + 1}`,
      focus: `O Verbo Vivo: Capítulo ${i + 1}`
    }))
  },
  {
    id: 'maratona-curtos',
    title: '5 Dias: 5 Livros',
    description: 'Uma sensação de conquista rápida. Leia os 5 livros da Bíblia que possuem apenas 1 capítulo.',
    duration: 5,
    category: 'Desafios',
    icon: '🏃',
    color: 'from-green-500 to-emerald-700',
    days: [
       { day: 1, reference: 'Obadias 1', focus: 'Justiça Divina (Obadias)' },
       { day: 2, reference: 'Filemom 1', focus: 'Perdão e Reconciliação (Filemom)' },
       { day: 3, reference: '2 João 1', focus: 'A Verdade e o Amor (2 João)' },
       { day: 4, reference: '3 João 1', focus: 'Hospitalidade Cristã (3 João)' },
       { day: 5, reference: 'Judas 1', focus: 'Batalha pela Fé (Judas)' },
    ]
  },
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
    description: 'Uma seleção dos capítulos mais importantes do Gênesis ao Apocalipse em 3 meses (Visão Geral).',
    duration: 90,
    category: 'Desafios',
    icon: '🌍',
    color: 'from-slate-400 to-slate-700',
    days: generateCanonicalPlan(90).map(d => ({ ...d, focus: 'Caminhando pela História da Redenção' }))
  },
  {
    id: '1-ano-atos',
    title: 'Jornada Bíblica Anual',
    description: 'O desafio supremo clássico. Leia a Bíblia inteira (1.189 capítulos) em 365 dias com estrutura teológica.',
    duration: 365,
    category: 'Desafios',
    icon: '👑',
    color: 'from-brand-600 to-black',
    days: generateFullBiblePlan(365)
  },

  // --- DESAFIOS PARA JOVENS ---
  {
    id: 'jovem-identidade',
    title: '14 Dias: Identidade Radical',
    description: 'Descubra quem você é em Cristo, vença a pressão cultural e encontre seu propósito divino.',
    duration: 14,
    category: 'Jovens',
    icon: '🧬',
    color: 'from-fuchsia-600 to-cyan-600',
    days: [
      { day: 1, reference: 'Daniel 1', focus: 'Fidelidade sob Pressão' },
      { day: 2, reference: '1 Timóteo 4:11-16', focus: 'Ninguém despreze tua mocidade' },
      { day: 3, reference: 'Eclesiastes 11:9-12:7', focus: 'Alegria com Juízo e Legado' },
      { day: 4, reference: 'Salmos 119:1-16', focus: 'Como purificar o caminho?' },
      { day: 5, reference: 'Gênesis 39', focus: 'Integridade: Fugindo do Mal' },
      { day: 6, reference: '1 Samuel 17', focus: 'Derrubando Gigantes' },
      { day: 7, reference: 'Jeremias 1:4-10', focus: 'Chamado desde o Ventre' },
      { day: 8, reference: 'Romanos 12:1-2', focus: 'Não se amolde ao padrão' },
      { day: 9, reference: 'Gálatas 5:13-26', focus: 'Liberdade vs Libertinagem' },
      { day: 10, reference: 'Efésios 6:10-20', focus: 'A Batalha é Espiritual' },
      { day: 11, reference: 'Mateus 6:25-34', focus: 'Ansiedade e Futuro' },
      { day: 12, reference: '1 Coríntios 6:12-20', focus: 'Seu corpo é Templo' },
      { day: 13, reference: '2 Coríntios 5:17-21', focus: 'Embaixadores de Cristo' },
      { day: 14, reference: 'Apocalipse 3:14-22', focus: 'Vencendo a Mornidão' },
    ]
  },
  {
    id: 'jovem-pureza',
    title: '7 Dias: Amor & Pureza',
    description: 'Um guia bíblico honesto sobre relacionamentos, sentimentos e santidade para a juventude.',
    duration: 7,
    category: 'Jovens',
    icon: '❤️‍🔥',
    color: 'from-rose-500 to-orange-500',
    days: [
      { day: 1, reference: 'Cânticos 2', focus: 'O Despertar do Amor' },
      { day: 2, reference: '1 Tessalonicenses 4:3-8', focus: 'A Vontade de Deus: Santificação' },
      { day: 3, reference: '2 Samuel 11', focus: 'Aprendendo com o Erro de Davi' },
      { day: 4, reference: 'Provérbios 4:23-27', focus: 'Guarda o teu Coração' },
      { day: 5, reference: '1 Coríntios 13', focus: 'O Que é o Amor Real?' },
      { day: 6, reference: '2 Coríntios 6:14-18', focus: 'Jugo Desigual' },
      { day: 7, reference: 'Efésios 5:1-4', focus: 'Imitadores de Deus' },
    ]
  },
  {
    id: 'jovem-digital',
    title: 'Detox Digital & Autoimagem',
    description: 'Como lidar com redes sociais, comparação e encontrar sua validação apenas em Deus.',
    duration: 5,
    category: 'Jovens',
    icon: '🤳',
    color: 'from-cyan-500 to-blue-600',
    days: [
      { day: 1, reference: 'Salmos 139:1-14', focus: 'Assombrosamente Formado' },
      { day: 2, reference: 'Gálatas 1:10', focus: 'Aprovação de Homens ou de Deus?' },
      { day: 3, reference: 'Mateus 6:1-6', focus: 'Vida Secreta vs Vida Pública' },
      { day: 4, reference: 'Filipenses 4:8', focus: 'O Filtro da Mente' },
      { day: 5, reference: 'Provérbios 4:23', focus: 'Sobre tudo, guarda teu coração' },
    ]
  },
  {
    id: 'jovem-amizades',
    title: 'Amizades & Influência',
    description: 'A sabedoria bíblica para escolher amigos que te aproximam de Deus e lidar com a pressão.',
    duration: 5,
    category: 'Jovens',
    icon: '🤝',
    color: 'from-yellow-400 to-orange-600',
    days: [
      { day: 1, reference: '1 Samuel 18:1-5', focus: 'Aliança de Amizade (Davi e Jônatas)' },
      { day: 2, reference: 'Provérbios 13:20', focus: 'Quem anda com sábios...' },
      { day: 3, reference: '1 Coríntios 15:33', focus: 'Más companhias corrompem' },
      { day: 4, reference: 'Provérbios 27:17', focus: 'Ferro afia ferro' },
      { day: 5, reference: '2 Coríntios 6:14-18', focus: 'Jugo Desigual e Santidade' },
    ]
  },
  {
    id: 'jovem-proposito',
    title: 'Chamado & Propósito',
    description: 'Você não é um acidente. Descubra como Deus quer usar sua vida para marcar esta geração.',
    duration: 5,
    category: 'Jovens',
    icon: '🎯',
    color: 'from-violet-500 to-purple-800',
    days: [
      { day: 1, reference: 'Jeremias 29:11-13', focus: 'Pensamentos de Paz e Futuro' },
      { day: 2, reference: 'Ester 4:10-17', focus: 'Para um tempo como este' },
      { day: 3, reference: 'Mateus 28:16-20', focus: 'A Grande Comissão (Missão Global)' },
      { day: 4, reference: '1 Coríntios 12:12-27', focus: 'Seu lugar no Corpo de Cristo' },
      { day: 5, reference: 'Colossenses 3:23-24', focus: 'Fazendo tudo para o Senhor' },
    ]
  },

  // --- OUTROS PLANOS ---
  
  // 1. Mulheres na Bíblia
  {
    id: 'mulheres-biblia',
    title: 'Mulheres de Fé',
    description: 'Conheça a história e o legado das mulheres que moldaram a narrativa bíblica com coragem e devoção.',
    duration: 7,
    category: 'Personagens',
    icon: '🌸',
    color: 'from-pink-500 to-rose-700',
    days: [
      { day: 1, reference: 'Rute 1', focus: 'Lealdade Inabalável (Rute)' },
      { day: 2, reference: 'Ester 4', focus: 'Coragem para Interceder (Ester)' },
      { day: 3, reference: '1 Samuel 1', focus: 'O Poder da Oração (Ana)' },
      { day: 4, reference: 'Lucas 1:26-56', focus: 'Disponibilidade para Deus (Maria)' },
      { day: 5, reference: 'João 20:1-18', focus: 'Testemunha da Ressurreição (Madalena)' },
      { day: 6, reference: 'Atos 16:11-15', focus: 'Liderança e Hospitalidade (Lídia)' },
      { day: 7, reference: 'Provérbios 31:10-31', focus: 'A Mulher Sábia' },
    ]
  },

  // 2. Profetas do Antigo Testamento
  {
    id: 'profetas-vt',
    title: 'A Voz dos Profetas',
    description: 'Os mensageiros de Deus que confrontaram reis e anunciaram o Messias no Antigo Testamento.',
    duration: 7,
    category: 'Personagens',
    icon: '📜',
    color: 'from-orange-600 to-amber-800',
    days: [
      { day: 1, reference: '1 Reis 18', focus: 'Elias e o Fogo de Deus' },
      { day: 2, reference: 'Isaías 6', focus: 'O Chamado de Isaías' },
      { day: 3, reference: 'Jeremias 1', focus: 'Conhecido Antes de Nascer' },
      { day: 4, reference: 'Ezequiel 37', focus: 'O Vale de Ossos Secos' },
      { day: 5, reference: 'Daniel 6', focus: 'Fidelidade na Provação' },
      { day: 6, reference: 'Oséias 3', focus: 'O Amor Incondicional de Deus' },
      { day: 7, reference: 'Malaquias 4', focus: 'A Promessa do Messias' },
    ]
  },

  // 3. Milagres de Jesus
  {
    id: 'milagres-jesus',
    title: 'O Poder de Jesus',
    description: 'Uma jornada de 7 dias pelos sinais e maravilhas que revelaram a divindade e a compaixão de Cristo.',
    duration: 7,
    category: 'Doutrina',
    icon: '✨',
    color: 'from-cyan-500 to-blue-700',
    days: [
      { day: 1, reference: 'João 2:1-11', focus: 'Água em Vinho: Alegria' },
      { day: 2, reference: 'Marcos 4:35-41', focus: 'Acalmando a Tempestade: Paz' },
      { day: 3, reference: 'Marcos 5:21-43', focus: 'A Filha de Jairo: Vida' },
      { day: 4, reference: 'João 6:1-15', focus: 'Multiplicação: Provisão' },
      { day: 5, reference: 'João 9', focus: 'Cura do Cego: Visão Espiritual' },
      { day: 6, reference: 'João 11', focus: 'Lázaro: Ressurreição' },
      { day: 7, reference: 'Lucas 24:1-12', focus: 'O Túmulo Vazio: O Maior Milagre' },
    ]
  },

  // 4. Intensidade na Oração
  {
    id: 'intensidade-oracao',
    title: 'Intensidade na Oração',
    description: '7 dias para transformar sua vida de oração com persistência, ousadia e fé inabalável.',
    duration: 7,
    category: 'Vida Cristã',
    icon: '🔔',
    color: 'from-violet-600 to-fuchsia-900',
    days: [
      { day: 1, reference: '1 Samuel 1', focus: 'O Clamor da Alma (Ana)' },
      { day: 2, reference: 'Lucas 18:1-8', focus: 'A Parábola da Persistência' },
      { day: 3, reference: 'Tiago 5:13-18', focus: 'A Oração Eficaz' },
      { day: 4, reference: 'Mateus 26:36-46', focus: 'Agonia e Rendição (Getsêmani)' },
      { day: 5, reference: 'Daniel 9', focus: 'Jejum e Intercessão' },
      { day: 6, reference: 'Efésios 6:10-20', focus: 'Armadura e Oração no Espírito' },
      { day: 7, reference: 'João 17', focus: 'A Grande Oração Sacerdotal' },
    ]
  },

  // 5. Cartas Paulinas
  {
    id: 'cartas-paulo',
    title: 'Sabedoria Paulina',
    description: 'Os ensinamentos fundamentais do Apóstolo Paulo para fortalecer a igreja e a vida cristã.',
    duration: 7,
    category: 'Doutrina',
    icon: '🏛️',
    color: 'from-slate-500 to-indigo-700',
    days: [
      { day: 1, reference: 'Romanos 8', focus: 'Nenhuma Condenação' },
      { day: 2, reference: '1 Coríntios 13', focus: 'A Supremacia do Amor' },
      { day: 3, reference: 'Gálatas 5', focus: 'Liberdade e o Fruto do Espírito' },
      { day: 4, reference: 'Efésios 6', focus: 'A Armadura de Deus' },
      { day: 5, reference: 'Filipenses 2', focus: 'A Humildade de Cristo' },
      { day: 6, reference: 'Colossenses 3', focus: 'Pensando nas Coisas do Alto' },
      { day: 7, reference: '1 Tessalonicenses 4', focus: 'A Esperança Futura' },
    ]
  },

  // 6. Apocalipse
  {
    id: 'apocalipse-intro',
    title: 'Revelação Final',
    description: 'Uma introdução à esperança gloriosa e ao triunfo final de Cristo narrados no Apocalipse.',
    duration: 7,
    category: 'Doutrina',
    icon: '🎺',
    color: 'from-violet-600 to-purple-900',
    days: [
      { day: 1, reference: 'Apocalipse 1', focus: 'A Visão do Cristo Glorificado' },
      { day: 2, reference: 'Apocalipse 2', focus: 'Cartas às Igrejas (Parte 1)' },
      { day: 3, reference: 'Apocalipse 4', focus: 'A Adoração no Trono' },
      { day: 4, reference: 'Apocalipse 5', focus: 'O Leão e o Cordeiro' },
      { day: 5, reference: 'Apocalipse 12', focus: 'A Mulher e o Dragão' },
      { day: 6, reference: 'Apocalipse 19', focus: 'As Bodas do Cordeiro' },
      { day: 7, reference: 'Apocalipse 21', focus: 'Novos Céus e Nova Terra' },
    ]
  },

  // --- PLANOS ORIGINAIS ---
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
