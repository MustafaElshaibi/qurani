// services/gemini.js
import { GoogleGenAI } from "@google/genai";

const CACHE = new Map();
const RATE_LIMIT = 1000; // 1 request per second
let lastRequest = 0;

export const fetchReciterDescription = async (reciterName) => {
  try {
    // Check cache first
    if (CACHE.has(reciterName)) return CACHE.get(reciterName);

    // Rate limiting
    const now = Date.now();
    if (now - lastRequest < RATE_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT - (now - lastRequest)));
    }

    const ai = new GoogleGenAI({ 
      apiKey: import.meta.env.VITE_REACT_APP_GEMINI_KEY // Use environment variables
    });

    const prompt = `Provide a concise 50-word Wikipedia-style summary about Quran reciter ${reciterName} focusing on:
    - Their recitation style
    - Notable achievements
    - Historical significance
    - Main publications
    Use neutral encyclopedic tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro-latest",
      contents: prompt,
      safetySettings: {
        harassment: "BLOCK_NONE",
        danger: "BLOCK_NONE",
      },
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.2
      }
    });

    const description = response.text.replace(/\*\*/g, '').trim(); // Remove markdown
    CACHE.set(reciterName, description);
    lastRequest = Date.now();

    return description;
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
};