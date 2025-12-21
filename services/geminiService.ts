
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã. Sua base textual é estritamente a Bíblia Nova Versão Internacional (NVI).
Seu objetivo é receber uma passagem bíblica ou um tema e explicá-lo de acordo com o público-alvo solicitado.

REGRAS DE REFERÊNCIA:
- Você deve identificar corretamente livros numerados mesmo que escritos de formas diferentes (ex: 1 Samuel, 1º Samuel, I Samuel, Primeira Samuel).
- Ignore termos como "cap", "capítulo", "v" ou "versículo" e foque na numeração correta.

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
FORMATO: **📖 [Livro] [Capítulo]:[Versículos] (NVI)** [Texto]
`;

const DEVOTIONAL_INSTRUCTION = `
Crie um devocional encorajador baseado na passagem (NVI) para o público solicitado.
FORMATO: **🌟 Versículo Chave**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = error?.message?.toLowerCase() || "";
  
  if (msg.includes("401") || msg.includes("403") || msg.includes("api_key_invalid") || msg.includes("not found")) {
    return "🔑 Erro: Chave de API inválida ou sem permissão. Por favor, clique no botão 'Selecionar Chave' no cabeçalho ou no ícone de chave no canto superior para ativar sua chave no Google AI Studio.";
  }
  if (msg.includes("429") || msg.includes("quota")) {
    return "⏳ Limite de uso atingido. Aguarde um minuto e tente novamente.";
  }
  return "😔 Ocorreu um problema na conexão. Verifique se sua chave de API está ativa no Google AI Studio e tente novamente.";
};

const normalizeReference = (ref: string): string => {
  return ref
    .replace(/1[º°ª]|I\s|Primeir[ao]/gi, "1 ")
    .replace(/2[º°ª]|II\s|Segund[ao]/gi, "2 ")
    .replace(/3[º°ª]|III\s|Terceir[ao]/gi, "3 ")
    .trim();
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("api_key_invalid");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    const normalizedInput = normalizeReference(input);
    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";

    // Fix: Using contents as a single Content object (not an array) as per SDK guidelines
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      contents: { parts: [{ text: `Tema/Passagem: "${normalizedInput}". Público: ${audiencePrompt}` }] },
    });

    return response.text || "Sem resposta.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const getBibleText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    // Fix: Using contents as a single Content object (not an array) as per SDK guidelines
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: READING_INSTRUCTION, temperature: 0.1 },
      contents: { parts: [{ text: `Texto NVI para: "${reference}"` }] },
    });
    return response.text || "Referência não encontrada.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const searchBibleVerses = async (keyword: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    // Fix: Using contents as a single Content object (not an array) as per SDK guidelines
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: "Liste os 5 versículos NVI mais relevantes.", temperature: 0.3 },
      contents: { parts: [{ text: `Busca: "${keyword}"` }] },
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
    // Fix: Using contents as a single Content object (not an array) as per SDK guidelines
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: DEVOTIONAL_INSTRUCTION, temperature: 0.8 },
      contents: { parts: [{ text: `Devocional: "${reference}". Público: ${audiencePrompt}` }] },
    });
    return response.text || "Erro ao gerar.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
