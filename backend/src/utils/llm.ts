import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateReplyWithLLM(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const text = response.text;
    return text || "I apologize, but I couldn't generate a reply at this time.";
  } catch (error) {
    console.error("❌ LLM generation error:", error);
    throw new Error("Failed to generate reply with LLM");
  }
}
