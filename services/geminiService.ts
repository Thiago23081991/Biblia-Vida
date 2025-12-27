
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é o Especialista Supremo em Bíblia Sagrada na versão **João Ferreira de Almeida Revista e Corrigida (ARC)**.

DIRETRIZES INVIOLÁVEIS:
1. VERSÃO EXCLUSIVA: Use SEMPRE a Almeida Revista e Corrigida (ARC). Não use NVI, NTLH ou outras versões modernas.
2. IDIOMA: Português do Brasil (PT-BR) com a grafia clássica da Almeida (ex: "vós", "tu", linguagem solene).
3. TEXTO INTEGRAL: Ao ser solicitado um capítulo, forneça-o COMPLETO. A versão ARC permite isso. Nunca resuma a menos que solicitado.
4. ESTILO: Markdown limpo. Use negrito para destacar versículos chave se solicitado.
`;

const handleGeminiError = (error: any): string => {
  console.error("Gemini Error:", error);
  const msg = (error?.message || error?.toString() || "").toLowerCase();
  
  if (msg.includes("401") || msg.includes("api_key") || msg.includes("invalid authentication")) {
    return "KEY_ERROR";
  }
  
  if (msg.includes("429") || msg.includes("quota") || msg.includes("resource exhausted")) {
    return "QUOTA_ERROR";
  }

  if (msg.includes("503") || msg.includes("overloaded") || msg.includes("internal")) {
    return "### 🐢 IA Sobrecarregada\n\nNossos servidores estão recebendo muitos pedidos no momento. A IA está respirando fundo. Por favor, aguarde alguns segundos e tente novamente.";
  }

  return "### 🛑 Algo deu errado\n\nNão foi possível processar sua solicitação neste momento. Verifique sua conexão com a internet ou tente novamente em instantes.";
};

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("api_key_invalid");
  return new GoogleGenAI({ apiKey });
};

/**
 * Recupera o texto bíblico na versão Almeida Corrigida (ARC).
 * Mantivemos o nome da função para não quebrar a importação, mas o conteúdo agora é ARC.
 */
export const getNviText = async (reference: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Temperatura baixa para máxima fidelidade ao texto original
      },
      contents: [{ parts: [{ text: `Transcreva INTEGRALMENTE o texto de: ${reference} na versão ALMEIDA REVISTA E CORRIGIDA (ARC).
      
      Regras:
      1. NÃO coloque comentários, apenas o texto bíblico.
      2. Mantenha a numeração dos versículos.
      3. Se o texto for longo, NÃO RESUMA. O usuário precisa ler tudo.
      4. Título: "📖 ${reference} (Almeida Corrigida)".` }] }],
    });

    const text = response.text || "";
    
    // Verificação de segurança (embora ARC raramente bloqueie)
    if (text.length < 50 && (text.includes("não posso") || text.includes("direitos"))) {
       return "### ⚠️ Erro de Leitura\n\nA IA encontrou uma restrição inesperada. Tente solicitar um trecho menor (ex: apenas um capítulo).";
    }
    
    return text;
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS (Linguagem muito simples)" : audience === AudienceType.TEEN ? "ADOLESCENTES (Linguagem conectada)" : "ADULTOS (Teológico e profundo)";
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
      contents: [{ parts: [{ text: `Com base na Bíblia Almeida Corrigida (ARC), explique detalhadamente: "${input}" para o público ${audiencePrompt}.` }] }],
    });
    return response.text || "Sem resposta da IA.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateDevotional = async (reference: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = getAiInstance();
    
    let systemInstruction = "Crie um devocional poderoso usando a versão Almeida Corrigida (ARC). Formato: **🌟 Versículo Chave (ARC)**, **💭 Reflexão**, **🙏 Oração**, **🚀 Desafio do Dia**.";
    
    if (audience === AudienceType.CHILD) {
      systemInstruction = `
        Você é um professor de escola dominical divertido!
        Crie um devocional LÚDICO e CURTO para crianças de 4 a 8 anos usando histórias da Bíblia Almeida.
        
        Estrutura Obrigatória:
        **🌟 Versículo Mágico:** (Texto simplificado para criança entender)
        **💭 A História:** (Contar a história bíblica de forma animada)
        **❓ Perguntinha:** (Interativa)
        **🙏 Oraçãozinha:** (Curta)
        **🚀 Missão:** (Desafio prático)
      `;
    }

    const audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS PEQUENAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: systemInstruction,
        temperature: audience === AudienceType.CHILD ? 0.9 : 0.8, 
      },
      contents: [{ parts: [{ text: `Gere um devocional sobre ${reference} focado em ${audiencePrompt}. Use a profundidade da Almeida ARC.` }] }],
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
        systemInstruction: "Buscador Bíblico Almeida (ARC). Liste os 5 versículos mais relevantes na versão Corrigida.",
        temperature: 0.3 
      },
      contents: [{ parts: [{ text: `Tema: ${keyword}` }] }],
    });
    return response.text || "Nada encontrado.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
