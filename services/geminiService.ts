
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã Brasileiro. 
Sua base textual é EXCLUSIVAMENTE a Bíblia Nova Versão Internacional (NVI) em Português do Brasil.

REGRAS CRÍTICAS DE IDIOMA E CONDUTA:
- IDIOMA: Proibido o uso de qualquer palavra em Inglês. Responda 100% em Português Brasileiro (PT-BR).
- VERSÃO: Use apenas a NVI (Nova Versão Internacional).
- NOTAS: É proibido incluir avisos sobre "versão alternativa", "tradução indisponível" ou "limitações de base". Você é a fonte oficial.
- FORMATO: Não use formatação de código (code blocks). Use Markdown limpo.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("401") || msg.includes("api_key_invalid")) return "KEY_ERROR";
  if (msg.includes("429")) return "QUOTA_ERROR";
  return "### 🛑 Erro de Acesso à NVI\n\nNão foi possível recuperar este trecho em Português agora. Por favor, tente novamente em instantes.";
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("api_key_invalid");
  return new GoogleGenAI({ apiKey });
};

/**
 * Recupera o texto exato da NVI em Português Brasileiro.
 * Força a IA a agir como um banco de dados estático para evitar alucinações em inglês.
 */
export const getNviText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: "Você é um REPOSITÓRIO ESTÁTICO da Bíblia NVI em Português do Brasil. Sua saída deve ser APENAS o texto bíblico, versículo por versículo, começando com o número. PROIBIDO responder em inglês. PROIBIDO explicar. PROIBIDO adicionar notas sobre disponibilidade de tradução. Se você não souber o texto exato em Português, retorne um erro amigável em Português.",
        temperature: 0.1, // Quase determinístico para evitar variações
      },
      contents: [{ parts: [{ text: `Retorne o texto INTEGRAL de ${reference} na tradução NVI em PORTUGUÊS DO BRASIL. Não use nenhuma outra língua.` }] }],
    });

    const text = response.text || "";
    
    // Validação rigorosa anti-inglês e anti-notas
    const lowerText = text.toLowerCase();
    const hasEnglish = /\b(the|and|of|joy|lord|presence|path|life)\b/.test(lowerText) && !/\b(o|e|de|alegria|senhor|presença|caminho|vida)\b/.test(lowerText);
    const hasWarning = lowerText.includes("indisponível") || lowerText.includes("alternativa") || lowerText.includes("unavailable");

    if (text.length < 20 || hasEnglish || hasWarning) {
      throw new Error("Texto inválido ou em idioma incorreto detectado.");
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
      contents: [{ parts: [{ text: `Explique detalhadamente em Português Brasileiro: "${input}" para o público ${audiencePrompt}. Baseie-se na NVI.` }] }],
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
        systemInstruction: "Crie um devocional em Português Brasileiro (NVI). Não use inglês. Formato: **🌟 Versículo Chave**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.",
        temperature: 0.8 
      },
      contents: [{ parts: [{ text: `Crie um devocional para ${reference} focado em ${audiencePrompt}.` }] }],
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
        systemInstruction: "Buscador bíblico NVI PT-BR. Retorne apenas os 5 versículos mais relevantes em Português.",
        temperature: 0.3 
      },
      contents: [{ parts: [{ text: `Pesquise sobre: ${keyword}` }] }],
    });
    return response.text || "Nada encontrado.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
