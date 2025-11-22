import { GoogleGenAI, Type } from "@google/genai";
import { HumanizationConfig, Tone } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
// We check for API key existence in the component layer, but safe to instantiate here if env is present
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy' });

export const humanizeDocumentStream = async (
  fileData: string, // Base64 string
  mimeType: string,
  config: HumanizationConfig,
  onChunk: (text: string) => void
): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const modelId = 'gemini-2.5-flash'; 

  const toneInstruction = getToneInstruction(config.tone);
  
  const prompt = `
    Task: Analyze the attached document and rewrite its content to be more human-like.
    
    Goal: Remove robotic phrasing, AI-generated patterns, and overly rigid structure. The output should sound natural, engaging, and written by a skilled human author.

    Specific Instructions:
    1. Tone: ${toneInstruction}
    2. Audience: ${config.targetAudience || 'General Audience'}
    3. ${config.simplifyComplexTerms ? 'Simplify jargon and complex terms where appropriate.' : 'Keep technical terminology intact but ensure context is clear.'}
    4. ${config.improveFlow ? 'Prioritize sentence variety and paragraph transitions for better flow.' : 'Maintain the original structure strictly.'}
    5. Do not output markdown code blocks (like \`\`\`json). Output the text directly in Markdown format (headings, lists, bolding allowed).
    
    Please rewrite the entire document following these guidelines.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: fileData,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7, // Slightly higher for more "human" variance
        systemInstruction: "You are an expert editor and ghostwriter specializing in humanizing texts.",
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            onChunk(fullText);
        }
    }
    return fullText;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process document.");
  }
};

const getToneInstruction = (tone: Tone): string => {
  switch (tone) {
    case Tone.Casual:
      return "Relaxed, conversational, and friendly. Use contractions and simpler vocabulary.";
    case Tone.Professional:
      return "Polite, confident, and business-appropriate. Avoid slang but keep it accessible.";
    case Tone.Academic:
      return "Formal, structured, and precise. Suitable for research or educational contexts.";
    case Tone.Creative:
      return "Expressive, evocative, and engaging. Use vivid language and varied sentence structures.";
    case Tone.Empathetic:
      return "Warm, understanding, and supportive. Focus on emotional resonance.";
    default:
      return "Balanced, clear, and neutral.";
  }
};
