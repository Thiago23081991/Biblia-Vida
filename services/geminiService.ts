
import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã. Sua base textual é estritamente a Bíblia Nova Versão Internacional (NVI).
Seu objetivo é receber uma passagem bíblica ou um tema e explicá-lo de acordo com o público-alvo solicitado.

REGRAS DE REFERÊNCIA:
- Você deve identificar corretamente livros numerados mesmo que escritos de formas diferentes (ex: 1 Samuel, 1º Samuel, I Samuel, Primeira Samuel).
- Ignore termos como "cap", "capítulo", "v" ou "versículo" e foque na numeração correta.

MODOS DE OPERAÇÃO:

1. CRIANÇAS (4 a 10 anos) - "O Contador de Histórias":
   - Tom: Lúdico, carinhoso, imaginativo e simples.
   - Estrutura: Transforme a passagem em uma pequena história. Use analogias concretas (animais, natureza, família).
   - Foco: A lição moral simples e o amor de Deus.
   - Emoji: Use muitos emojis divertidos.

2. ADOLESCENTES (11 a 17 anos) - "O Mentor Conectado":
   - Tom: Dinâmico, empático, desafiador e "papo-reto".
   - Estrutura: Conecte o texto com dilemas modernos.
   - Foco: Aplicação prática, identidade em Cristo e propósito.

3. ADULTOS (18+ anos) - "O Mestre Teológico":
   - Tom: Maduro, profissional, encorajador e sério.
   - Estrutura: Apresente o versículo NVI, contexto histórico e exegese.
   - Sugira uma oração ou ponto de ação ao final.

FORMATO DE SAÍDA OBRIGATÓRIO (Markdown):
**📖 Passagem:** [Citar referência e trecho chave na NVI]
**🎯 Público:** [Público Escolhido]
**💬 Explicação:** [Texto adaptado]
**💡 Aplicação:** [Uma frase curta de resumo/ação]
`;

const READING_INSTRUCTION = `
Você é uma Bíblia digital focada na Nova Versão Internacional (NVI).
Sua ÚNICA função é fornecer o texto bíblico exato da referência solicitada pelo usuário.
Não interprete, não resuma e não adicione comentários pessoais.
Apenas retorne o texto dos versículos conforme traduzidos na NVI.

FORMATO DE RESPOSTA:
**📖 [Livro] [Capítulo]:[Versículos] (NVI)**
[Texto integral dos versículos]
`;

const SEARCH_INSTRUCTION = `
Você é um motor de busca bíblica avançado na NVI.
Liste os 5 a 10 versículos mais relevantes para o termo.
`;

const DEVOTIONAL_INSTRUCTION = `
Você é um Pastor e Mentor compassivo. Crie um devocional curto e encorajador baseado na passagem bíblica fornecida (NVI).
O tom e a linguagem devem ser adaptados conforme o público-alvo:
- CRIANÇAS: Use linguagem simples, lúdica e muitos emojis. Conte como se fosse uma história curta.
- ADOLESCENTES: Use linguagem dinâmica, gírias leves (se apropriado), foco em dilemas reais e conectividade.
- ADULTOS: Use tom profundo, reflexivo, com foco em maturidade espiritual e vida prática.

FORMATO DE SAÍDA OBRIGATÓRIO (Markdown):
**🌟 Versículo Chave:** [Referência e texto principal]
**💭 Reflexão:** [Um parágrafo curto e profundo de encorajamento adaptado ao público - máx 4 frases]
**🙏 Oração:** [Uma oração curta de uma frase]
**🚀 Desafio do Dia:** [Uma ação simples para praticar hoje]
`;

const normalizeReference = (ref: string): string => {
  return ref
    .replace(/1[º°ª]|I\s|Primeir[ao]/gi, "1 ")
    .replace(/2[º°ª]|II\s|Segund[ao]/gi, "2 ")
    .replace(/3[º°ª]|III\s|Terceir[ao]/gi, "3 ")
    .replace(/\s+/g, " ")
    .trim();
};

const handleGeminiError = (error: any): string => {
  console.error("Gemini API Error Detail:", error);
  
  if (!navigator.onLine) {
    return "🌐 Parece que você está sem internet. Verifique sua conexão e tente novamente.";
  }

  const errorMessage = error?.message?.toLowerCase() || error?.toString()?.toLowerCase() || "";
  
  const currentKey = process.env.API_KEY;
  if (!currentKey || currentKey === 'undefined' || currentKey === '') {
    return "🔑 Erro Crítico: Chave de API não encontrada no sistema. Se você está na Vercel, adicione VITE_API_KEY e faça um REDEPLOY na aba Deployments.";
  }

  if (errorMessage.includes("api_key_invalid") || errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("invalid api key")) {
    return "🚫 Chave de API inválida ou sem permissão. Verifique no Google AI Studio se a chave está ativa.";
  }

  if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("too many requests") || errorMessage.includes("limit exceeded")) {
    return "⏳ O limite de mensagens gratuitas foi atingido. Aguarde cerca de 1 minuto.";
  }

  if (errorMessage.includes("safety") || errorMessage.includes("finish_reason_safety") || errorMessage.includes("blocked")) {
    return "🛡️ O conteúdo foi filtrado pelos critérios de segurança da IA. Tente reformular a referência ou o tema.";
  }

  if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("failed to fetch")) {
    return "📡 Falha na rede ao tentar conectar com os servidores da Google. Verifique sua conexão.";
  }
  
  return `😔 Erro na conexão: ${error.message || "Tente novamente mais tarde."}`;
};

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const normalizedInput = normalizeReference(input);
    let audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7 
      },
      contents: [{ parts: [{ text: `Tema/Passagem: "${normalizedInput}". Público: ${audiencePrompt}` }] }],
    });

    return response.text || "Sem resposta da IA.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const getBibleText = async (reference: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const normalizedRef = normalizeReference(reference);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: READING_INSTRUCTION,
        temperature: 0.1 // Temperatura baixa para garantir fidelidade textual
      },
      contents: [{ parts: [{ text: `Forneça o texto bíblico NVI para: "${normalizedRef}"` }] }],
    });

    return response.text || "Não foi possível carregar o texto bíblico para esta referência. Verifique se a passagem está correta.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const searchBibleVerses = async (keyword: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: SEARCH_INSTRUCTION,
        temperature: 0.3 
      },
      contents: [{ parts: [{ text: `Busca por: "${keyword}"` }] }],
    });
    return response.text || "Nenhum versículo encontrado para este termo.";
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateDevotional = async (reference: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const normalizedRef = normalizeReference(reference);
    let audiencePrompt = audience === AudienceType.CHILD ? "CRIANÇAS" : audience === AudienceType.TEEN ? "ADOLESCENTES" : "ADULTOS";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: { 
        systemInstruction: DEVOTIONAL_INSTRUCTION,
        temperature: 0.8 
      },
      contents: [{ parts: [{ text: `Passagem para devocional: "${normalizedRef}". Público-alvo: ${audiencePrompt}` }] }],
    });

    return response.text || "Erro ao gerar devocional. Tente outra passagem.";
  } catch (error) {
    return handleGeminiError(error);
  }
};
