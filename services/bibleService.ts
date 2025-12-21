
/**
 * Serviço para buscar textos bíblicos de APIs públicas gratuitas.
 * Traduz os nomes dos livros para Inglês antes da chamada para garantir compatibilidade.
 */

const ptToEnBookMap: Record<string, string> = {
  "Gênesis": "Genesis", "Êxodo": "Exodus", "Levítico": "Leviticus", "Números": "Numbers", "Deuteronômio": "Deuteronomy",
  "Josué": "Joshua", "Juízes": "Judges", "Rute": "Ruth", "1 Samuel": "1 Samuel", "2 Samuel": "2 Samuel",
  "1 Reis": "1 Kings", "2 Reis": "2 Kings", "1 Crônicas": "1 Chronicles", "2 Crônicas": "2 Chronicles",
  "Esdras": "Ezra", "Neemias": "Nehemiah", "Ester": "Esther", "Jó": "Job", "Salmos": "Psalms",
  "Provérbios": "Proverbs", "Eclesiastes": "Ecclesiastes", "Cânticos": "Song of Solomon", "Isaías": "Isaiah",
  "Jeremias": "Jeremiah", "Lamentações": "Lamentations", "Ezequiel": "Ezekiel", "Daniel": "Daniel",
  "Oseias": "Hosea", "Joel": "Joel", "Amós": "Amos", "Obadias": "Obadiah", "Jonas": "Jonah",
  "Miqueias": "Micah", "Naum": "Nahum", "Habacuque": "Habakkuk", "Sofonias": "Zephaniah", "Ageu": "Haggai",
  "Zacarias": "Zechariah", "Malaquias": "Malachi",
  "Mateus": "Matthew", "Marcos": "Mark", "Lucas": "Luke", "João": "John", "Atos": "Acts",
  "Romanos": "Romans", "1 Coríntios": "1 Corinthians", "2 Coríntios": "2 Corinthians", "Gálatas": "Galatians",
  "Efésios": "Ephesians", "Filipenses": "Philippians", "Colossenses": "Colossians", "1 Tessalonicenses": "1 Thessalonians",
  "2 Tessalonicenses": "2 Thessalonians", "1 Timóteo": "1 Timothy", "2 Timóteo": "2 Timothy", "Tito": "Titus",
  "Filemom": "Philemon", "Hebreus": "Hebrews", "Tiago": "James", "1 Pedro": "1 Peter", "2 Pedro": "2 Peter",
  "1 João": "1 John", "2 João": "2 John", "3 João": "3 John", "Judas": "Jude", "Apocalipse": "Revelation"
};

const translateReference = (ref: string): string => {
  // Tenta extrair o nome do livro (pode ter números no início como 1 João)
  const match = ref.match(/^(\d?\s?[A-Za-záàâãéèêíïóôõöúç]+)/i);
  if (!match) return ref;
  
  const ptBook = match[1].trim();
  const enBook = ptToEnBookMap[ptBook];
  
  if (enBook) {
    return ref.replace(ptBook, enBook);
  }
  return ref;
};

export const fetchPublicBibleText = async (reference: string): Promise<string> => {
  try {
    const translatedRef = translateReference(reference);
    // Usando tradução 'almeida' (id 2115 em algumas APIs ou via query)
    // bible-api.com usa parâmetros de tradução. Se 'almeida' falhar, 'kjv' é o fallback padrão deles.
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(translatedRef)}?translation=almeida`);
    
    if (!response.ok) {
      // Tenta uma segunda vez sem especificar tradução caso a tradução almeida esteja indisponível
      const retryResponse = await fetch(`https://bible-api.com/${encodeURIComponent(translatedRef)}`);
      if (!retryResponse.ok) throw new Error("API Indisponível");
      
      const data = await retryResponse.json();
      return `**📖 ${reference} (Tradução Padrão)**\n\n${data.text}\n\n*Nota: Tradução NVI indisponível na base pública, exibindo versão alternativa.*`;
    }
    
    const data = await response.json();
    return `**📖 ${reference}**\n\n${data.text}`;
  } catch (error) {
    console.error("Erro na API Bíblica Pública:", error);
    return `### 🛑 Erro de Conexão\n\nNão conseguimos acessar o texto de **${reference}** na base pública no momento.\n\n**Dica:** Você ainda pode usar o botão **"Explicar"** para que a IA gere o conteúdo baseado na NVI diretamente.`;
  }
};
