import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function classifyEmail(
  subject: string,
  body: string
): Promise<string | undefined> {
  const prompt = `
You are an email classifier. Classify the email into one of the following categories:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Only return the category name. No explanation.

Email Subject: ${subject}
Email Body: ${body}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    const text = response.text?.toLowerCase().trim() || "";

    // Validate the response is one of our expected categories
    const validCategories = [
      "Interested",
      "Meeting Booked",
      "Not Interested",
      "Spam",
      "Out of Office",
    ];

    // Check by lowercase
    if (validCategories.map((c) => c.toLowerCase()).includes(text)) {
      // Return the canonical category name (with correct casing)
      const matchedIndex = validCategories
        .map((c) => c.toLowerCase())
        .indexOf(text);
      return validCategories[matchedIndex];
    } else {
      console.warn(
        `Invalid classification response: ${text}, defaulting to 'Not Interested'`
      );
      // return "Not Interested";
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    // return "Not Interested"; // Default fallback
  }
}
