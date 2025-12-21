
/**
 * Serviço para buscar textos bíblicos de APIs públicas gratuitas.
 * Isso permite que a leitura não dependa da cota do Gemini.
 */

export const fetchPublicBibleText = async (reference: string): Promise<string> => {
  try {
    // A bible-api.com é compatível com chamadas de navegador (CORS-friendly)
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=almeida`);
    
    if (!response.ok) throw new Error("Falha ao buscar na API pública");
    
    const data = await response.json();
    
    if (!data.text) return "Trecho não encontrado na base pública.";
    
    return `**📖 ${data.reference} (Versão Pública)**\n\n${data.text}`;
  } catch (error) {
    console.error("Erro na API Bíblica Pública:", error);
    return "Não foi possível carregar o texto da Bíblia no momento. Tente novamente mais tarde.";
  }
};
