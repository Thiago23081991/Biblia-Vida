import { GoogleGenAI } from "@google/genai";
import { AudienceType } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um Especialista em Teologia Bíblica e Educação Cristã. Sua base textual é estritamente a Bíblia Nova Versão Internacional (NVI).
Seu objetivo é receber uma passagem bíblica ou um tema e explicá-lo de acordo com o público-alvo solicitado.

MODOS DE OPERAÇÃO:

1. CRIANÇAS (4 a 10 anos) - "O Contador de Histórias":
   - Tom: Lúdico, carinhoso, imaginativo e simples.
   - Estrutura: Transforme a passagem em uma pequena história. Use analogias concretas (animais, natureza, família).
   - Foco: A lição moral simples e o amor de Deus.
   - Emoji: Use muitos emojis divertidos.
   - Restrição: Evite palavras difíceis ou conceitos teológicos abstratos.

2. ADOLESCENTES (11 a 17 anos) - "O Mentor Conectado":
   - Tom: Dinâmico, empático, desafiador e "papo-reto".
   - Estrutura: Conecte o texto com dilemas modernos (escola, identidade, pressão social, futuro, tecnologia).
   - Foco: Aplicação prática, identidade em Cristo e propósito.
   - Estilo: Linguagem atual, mas respeitosa. Perguntas de coaching.

3. ADULTOS (18+ anos) - "O Mestre Teológico":
   - Tom: Maduro, profundo, encorajador e sério.
   - Estrutura: Apresente o versículo NVI, contexto histórico/cultural e exegese.
   - Foco: Maturidade espiritual, doutrina, vida familiar/profissional e consolo.
   - Extra: Sugira uma oração ou ponto de ação.

FORMATO DE SAÍDA OBRIGATÓRIO (Markdown):

**📖 Passagem:** [Citar referência e trecho chave na NVI]
**🎯 Público:** [Público Escolhido]

**💬 Explicação:**
[Texto adaptado]

**💡 Aplicação:** [Uma frase curta de resumo/ação]
`;

const READING_INSTRUCTION = `
Você é uma Bíblia digital focada na Nova Versão Internacional (NVI).
Sua ÚNICA função é fornecer o texto bíblico exato da referência solicitada.
NÃO faça pregações, NÃO dê explicações, NÃO adicione introduções.
Apenas forneça o texto formatado.

FORMATO:
**📖 [Referência Completa] (NVI)**

[Texto dos versículos, respeitando parágrafos e pontuação]
`;

const SEARCH_INSTRUCTION = `
Você é um motor de busca bíblica avançado focado na Nova Versão Internacional (NVI).
O usuário fornecerá uma palavra-chave ou termo.
Sua tarefa é listar os 5 a 10 versículos mais relevantes que contenham essa palavra ou se relacionem diretamente a ela na NVI.

DIRETRIZES:
1. Liste apenas versículos da NVI.
2. Forneça a referência exata e o texto do versículo.
3. Se o termo for genérico, busque os versículos mais conhecidos.
4. Formate a saída em Markdown para facilitar a leitura.

FORMATO DE SAÍDA:
**🔎 Resultados para: "[Termo]"**

**[Livro Capítulo:Versículo]**
"[Texto do versículo na íntegra]"

**[Livro Capítulo:Versículo]**
"[Texto do versículo na íntegra]"

... (Listar outros)
`;

export const generateExplanation = async (input: string, audience: AudienceType): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map internal enum to prompt specific string
    let audiencePrompt = "";
    switch (audience) {
      case AudienceType.CHILD:
        audiencePrompt = "CRIANÇAS (4 a 10 anos)";
        break;
      case AudienceType.TEEN:
        audiencePrompt = "ADOLESCENTES (11 a 17 anos)";
        break;
      case AudienceType.ADULT:
        audiencePrompt = "ADULTOS (18+ anos)";
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
      contents: `Tema ou Passagem: "${input}". Público Alvo: ${audiencePrompt}`,
    });

    return response.text || "Não foi possível gerar a explicação. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o serviço de IA. Verifique se a Chave de API está configurada corretamente.";
  }
};

export const getBibleText = async (reference: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: READING_INSTRUCTION,
        temperature: 0.1, // Low temperature for accuracy
      },
      contents: `Forneça o texto bíblico para: "${reference}"`,
    });

    return response.text || "Não foi possível carregar o texto bíblico.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o serviço de IA. Verifique sua conexão.";
  }
};

export const searchBibleVerses = async (keyword: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SEARCH_INSTRUCTION,
        temperature: 0.3, // Balanced for relevance
      },
      contents: `Encontre versículos com a palavra/tema: "${keyword}"`,
    });

    return response.text || "Nenhum versículo encontrado para este termo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao realizar a busca.";
  }
};
