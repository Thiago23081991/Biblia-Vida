
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã. Sua base textual é estritamente a Bíblia Nova Versão Internacional (NVI).
Seu objetivo é receber uma passagem bíblica ou um tema e explicá-lo de acordo com o público-alvo solicitado.

REGRAS DE REFERÊNCIA:
- Você deve identificar corretamente livros numerados mesmo que escritos de formas diferentes (ex: 1 Samuel, 1º Samuel, I Samuel, Primeira Samuel).

MODOS DE OPERAÇÃO:
1. CRIANÇAS (4 a 10 anos): Tom lúdico, histórias simples, analogias concretas e muitos emojis.
2. ADOLESCENTES (11 a 17 anos): Tom dinâmico, conexão com dilemas modernos, aplicação prática e identidade.
3. ADULTOS (18+ anos): Tom maduro, exegese, contexto histórico e sugestão de oração.

FORMATO DE SAÍDA OBRIGATÓRIO (Markdown):
**📖 Passagem:** [Citar referência e trecho chave na NVI]
**🎯 Público:** [Público Escolhido]
**💬 Explicação:** [Texto adaptado]
**💡 Aplicação:** [Uma frase curta de resumo/ação]
`;

const READING_INSTRUCTION = `
Você é uma Bíblia digital NVI. Forneça APENAS o texto bíblico exato da referência. Não interprete nem resuma.
`;

const DEVOTIONAL_INSTRUCTION = `
Crie um devocional encorajador baseado na passagem (NVI) para o público solicitado.
FORMATO: **🌟 Versículo Chave**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = error?.message?.toLowerCase() || "";
  
  if (msg.includes("401") || msg.includes("403") || msg.includes("api_key_invalid") || msg.includes("requested entity was not found")) {
    return "KEY_ERROR: Chave de API inválida ou sem permissão.";
  }
  
  // Tratamento específico de Quota (429)
  if (msg.includes("429") || msg.includes("quota") || msg.includes("too many requests")) {
    return "QUOTA_ERROR: O Google limitou o uso temporariamente. Como você está usando a versão gratuita, o Google permite apenas algumas consultas por minuto. Por favor, aguarde cerca de 60 segundos e tente novamente.";
  }

  return "😔 Erro de conexão. Verifique sua internet ou tente novamente em instantes.";
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("api_key_invalid");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      contents: [{ parts: [{ text: `Tema/Passagem: "${input}". Público: ${audiencePrompt}` }] }],
    });

    return response.text || "Sem resposta.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const getBibleText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: READING_INSTRUCTION, temperature: 0.1 },
      contents: [{ parts: [{ text: `Texto NVI para: "${reference}"` }] }],
    });
    return response.text || "Referência não encontrada.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const searchBibleVerses = async (keyword: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: "Liste os 5 versículos NVI mais relevantes.", temperature: 0.3 },
      contents: [{ parts: [{ text: `Busca: "${keyword}"` }] }],
    });
    return response.text || "Nenhum resultado.";
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
      config: { systemInstruction: DEVOTIONAL_INSTRUCTION, temperature: 0.8 },
      contents: [{ parts: [{ text: `Devocional: "${reference}". Público: ${audiencePrompt}` }] }],
    });
    return response.text || "Erro ao gerar.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
