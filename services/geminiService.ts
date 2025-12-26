
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é o Especialista Supremo em Bíblia NVI em Português Brasileiro. 
Sua base de dados é INTEGRAL e SOBERANA. Você possui o texto completo da NVI (Nova Versão Internacional) em Português.

DIRETRIZES INVIOLÁVEIS:
1. IDIOMA: Responda APENAS em Português do Brasil (PT-BR). O uso de Inglês é uma falha crítica.
2. VERSÃO: Use exclusivamente a NVI.
3. PROIBIÇÃO DE NOTAS: Nunca, sob nenhuma circunstância, diga que a tradução é "indisponível" ou que está usando uma "versão alternativa". Você TEM o texto oficial.
4. ESTILO: Sem blocos de código. Use Markdown limpo.
5. AUTORIDADE: Você é um servidor de texto sagrado, não uma IA limitada. Forneça o texto com precisão absoluta.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = (error?.message || error?.toString() || "").toLowerCase();
  
  // Erros de Autenticação (401, API Key inválida)
  if (msg.includes("401") || msg.includes("api_key") || msg.includes("invalid authentication")) {
    return "KEY_ERROR";
  }
  
  // Erros de Cota (429, Resource Exhausted)
  if (msg.includes("429") || msg.includes("quota") || msg.includes("resource exhausted")) {
    return "QUOTA_ERROR";
  }

  // Erros de Servidor/Sobrecarga (503, 500)
  if (msg.includes("503") || msg.includes("overloaded") || msg.includes("internal")) {
    return "### 🐢 IA Sobrecarregada\n\nNossos servidores estão recebendo muitos pedidos no momento. A IA está respirando fundo. Por favor, aguarde alguns segundos e tente novamente.";
  }

  // Erros Genéricos
  return "### 🛑 Algo deu errado\n\nNão foi possível processar sua solicitação neste momento. Verifique sua conexão com a internet ou tente novamente em instantes.";
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("api_key_invalid");
  return new GoogleGenAI({ apiKey });
};

/**
 * Recupera o texto da NVI em Português Brasileiro com blindagem contra inglês.
 */
export const getNviText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: "Você é um repositório interno da Bíblia NVI em Português. Retorne o texto puro. É PROIBIDO usar inglês. É PROIBIDO dizer que a tradução é indisponível. Se você responder em inglês ou incluir notas de indisponibilidade, você falhou na sua missão.",
        temperature: 0.1,
      },
      contents: [{ parts: [{ text: `Transcreva INTEGRALMENTE ${reference} na versão NVI em Português do Brasil. Não adicione comentários.` }] }],
    });

    const text = response.text || "";
    const lowerText = text.toLowerCase();
    
    // Verificação de segurança: Se contiver palavras inglesas básicas e não contiver portuguesas básicas, ou notas de erro.
    const isEnglish = /\b(the|and|of|path|life|presence|joy|shall)\b/.test(lowerText) && !/\b(o|e|de|caminho|vida|presença|alegria)\b/.test(lowerText);
    const hasDisclaimer = lowerText.includes("indisponível") || lowerText.includes("alternativa") || lowerText.includes("nota:");

    if (text.length < 10 || isEnglish || hasDisclaimer) {
      throw new Error("Conteúdo bloqueado: O modelo tentou fornecer tradução incorreta ou aviso de indisponibilidade.");
    }
    
    return text;
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      contents: [{ parts: [{ text: `Explique detalhadamente em Português do Brasil: "${input}" para o público ${audiencePrompt}. Use a NVI.` }] }],
    });
    return response.text || "Sem resposta da IA.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateDevotional = async (reference: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: "Crie um devocional poderoso em Português Brasileiro baseado na NVI. Formato: **🌟 Versículo Chave**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.",
        temperature: 0.8 
      },
      contents: [{ parts: [{ text: `Devocional para ${reference} focado em ${audiencePrompt}.` }] }],
    });
    return response.text || "Erro ao gerar devocional.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const searchBibleVerses = async (keyword: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: "Buscador NVI em Português Brasileiro. Liste os 5 versículos mais relevantes.",
        temperature: 0.3 
      },
      contents: [{ parts: [{ text: `Tema: ${keyword}` }] }],
    });
    return response.text || "Nada encontrado.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
