import { getCategoryEmbeddings } from "../utils/categories";
import { getEmbedding } from "../utils/embedding";
import cosineSimilarity from "../utils/cosineSimilarity";
import { classifyEmail } from "./aiService";

export const classifyWithElasticsearch = async (
  emailVector: number[]
): Promise<string> => {
  // If we have a zero vector or empty array, return default category
  if (emailVector.length === 0 || emailVector.every((val) => val === 0)) {
    return "Not Interested";
  }

  const categoryEmbeddings = await getCategoryEmbeddings();

  let bestLabel = "Not Interested";
  let bestScore = -Infinity;

  for (const [label, catVec] of Object.entries(categoryEmbeddings)) {
    const score = cosineSimilarity(emailVector, catVec);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return bestLabel;
};

export const classifyEmailWithAI = async (
  subject: string,
  body: string
): Promise<string> => {
  return await classifyEmail(subject, body);
};

export const classifyEmailHybrid = async (
  subject: string,
  body: string
): Promise<string> => {
  try {
    // Try AI classification first
    const aiCategory = await classifyEmailWithAI(subject, body);
    console.log(`🧠 AI classified as: ${aiCategory} for ${subject}`);
    return aiCategory;
  } catch (error) {
    console.error(
      "AI classification failed, falling back to vector classification:",
      error
    );

    // Fallback to vector-based classification
    const emailContent = `${subject}\n\n${body}`;
    const emailEmbedding = await getEmbedding(emailContent);
    const vectorCategory = await classifyWithElasticsearch(emailEmbedding);
    console.log(`📊 Vector classified as: ${vectorCategory}`);
    return vectorCategory;
  }
};
