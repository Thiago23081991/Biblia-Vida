
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã Brasileiro. 
Sua base textual é EXCLUSIVAMENTE a Bíblia Nova Versão Internacional (NVI) em Português do Brasil.

REGRAS CRÍTICAS DE IDIOMA E CONDUTA:
- NUNCA responda em Inglês.
- Use exclusivamente o Português do Brasil (PT-BR).
- PROIBIDO incluir notas sobre "limitações de base de dados" ou "versões alternativas". 
- Você TEM o texto integral da NVI em sua memória. Entregue-o com autoridade.

MODOS DE OPERAÇÃO:
1. EXPLICAÇÃO: Adapte o texto para o público (Crianças, Jovens ou Adultos).
2. BUSCA: Encontre os 5 versículos mais relevantes da NVI PT-BR.
3. TEXTO PURO: Forneça apenas o texto bíblico da NVI, sem comentários extras.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("401") || msg.includes("api_key_invalid")) return "KEY_ERROR";
  if (msg.includes("429")) return "QUOTA_ERROR";
  return "### 🛑 Erro de Carregamento\n\nNão foi possível obter este capítulo agora. A conexão com o servidor da Bíblia NVI falhou. Por favor, tente novamente em alguns segundos.";
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("api_key_invalid");
  return new GoogleGenAI({ apiKey });
};

/**
 * Recupera o texto exato da NVI em Português Brasileiro.
 * Configurado para máxima fidelidade e zero comentários externos.
 */
export const getNviText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: "Você é um servidor dedicado do texto integral da Bíblia NVI em Português Brasileiro. Retorne APENAS os versículos solicitados. É PROIBIDO adicionar notas de rodapé, avisos sobre fontes de dados ou qualquer texto que não seja o bíblico. Comece diretamente com a referência em negrito.",
        temperature: 0.1,
      },
      contents: [{ parts: [{ text: `Retorne o texto integral de ${reference} na versão NVI em Português do Brasil. Não adicione notas sobre disponibilidade de tradução.` }] }],
    });

    const text = response.text;
    // Se o modelo devolver uma desculpa ou texto muito curto, forçamos um erro para o fallback do App
    if (!text || text.length < 15 || text.toLowerCase().includes("não tenho acesso") || text.toLowerCase().includes("indisponível")) {
      throw new Error("Resposta inválida ou incompleta");
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
      contents: [{ parts: [{ text: `Explique a passagem ou tema: "${input}" para o público ${audiencePrompt}. Use estritamente a NVI em Português Brasileiro.` }] }],
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
        systemInstruction: "Crie um devocional em Português Brasileiro baseado na NVI. PROIBIDO dizer que a versão é indisponível. Você é um pastor com acesso total à Palavra. Formato: **🌟 Versículo Chave**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.",
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
        systemInstruction: "Buscador bíblico NVI PT-BR. Liste os 5 versículos mais relevantes sobre o tema. Não adicione notas sobre bases de dados.",
        temperature: 0.3 
      },
      contents: [{ parts: [{ text: `Tema: ${keyword}` }] }],
    });
    return response.text || "Nada encontrado.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
