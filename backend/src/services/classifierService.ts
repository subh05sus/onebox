import { getCategoryEmbeddings } from "../utils/categories";
import { getEmbedding } from "../utils/embedding";
import cosineSimilarity from "../utils/cosineSimilarity";
import { classifyEmail } from "./aiService";

export const classifyWithElasticsearch = async (
  emailVector: number[]
): Promise<string> => {
  // If we have a zero vector or empty array, return default category
  if (emailVector.length === 0 || emailVector.every((val) => val === 0)) {
    console.log("📊 Zero vector detected, returning 'Not Interested'");
    return "Not Interested";
  }

  const categoryEmbeddings = await getCategoryEmbeddings();

  // Log the email vector stats for debugging
  const nonZeroCount = emailVector.filter((val) => val !== 0).length;
  const avgValue =
    emailVector.reduce((sum, val) => sum + val, 0) / emailVector.length;
  console.log(
    `📊 Email vector stats: length=${
      emailVector.length
    }, non-zero=${nonZeroCount}, avg=${avgValue.toFixed(4)}`
  );

  let bestLabel = "Not Interested";
  let bestScore = -Infinity;
  const scores: { [key: string]: number } = {};

  for (const [label, catVec] of Object.entries(categoryEmbeddings)) {
    const score = cosineSimilarity(emailVector, catVec);
    scores[label] = score;

    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  // Log all scores for debugging
  console.log("📊 Classification scores:", scores);
  console.log(`📊 Best match: ${bestLabel} (score: ${bestScore.toFixed(4)})`);

  // More sophisticated classification logic
  const scoreThresholds = {
    Interested: 0.15,
    "Meeting Booked": 0.15,
    "Not Interested": 0.1,
    Spam: 0.12,
    "Out of Office": 0.12,
  };

  // Check if the best score meets the threshold for that category
  const threshold =
    scoreThresholds[bestLabel as keyof typeof scoreThresholds] || 0.1;

  if (bestScore < threshold) {
    console.log(
      `📊 Best score ${bestScore.toFixed(
        4
      )} is below threshold ${threshold} for ${bestLabel}, defaulting to 'Not Interested'`
    );
    return "Not Interested";
  }

  // Additional logic: if "Not Interested" is close to the best score, be more conservative
  if (
    bestLabel !== "Not Interested" &&
    scores["Not Interested"] > bestScore * 0.8
  ) {
    console.log(
      `📊 'Not Interested' score ${scores["Not Interested"].toFixed(
        4
      )} is close to best score ${bestScore.toFixed(4)}, being conservative`
    );
    return "Not Interested";
  }

  return bestLabel;
};

export const classifyEmailWithAI = async (
  subject: string,
  body: string
): Promise<string> => {
  const aiCategory = await classifyEmail(subject, body);
  if (aiCategory) {
    return aiCategory;
  }

  // Fallback to vector-based classification
  const emailContent = `${subject}\n\n${body}`;
  const emailEmbedding = await getEmbedding(emailContent);
  return await classifyWithElasticsearch(emailEmbedding);
};

// Simple keyword-based classification as additional fallback
const classifyByKeywords = (subject: string, body: string): string => {
  const text = `${subject} ${body}`.toLowerCase();

  // Keywords for each category
  const keywords = {
    Interested: [
      "interested",
      "learn more",
      "more information",
      "discuss",
      "proposal",
      "opportunity",
      "explore",
      "consider",
    ],
    "Meeting Booked": [
      "meeting",
      "schedule",
      "booked",
      "confirmed",
      "appointment",
      "calendar",
      "slot",
      "time",
    ],
    "Not Interested": [
      "not interested",
      "decline",
      "reject",
      "no thanks",
      "pass",
      "uninterested",
    ],
    Spam: [
      "buy now",
      "limited time",
      "free offer",
      "click here",
      "urgent",
      "act now",
      "special offer",
    ],
    "Out of Office": [
      "out of office",
      "unavailable",
      "away",
      "vacation",
      "return",
      "automatic reply",
    ],
  };

  const scores: { [key: string]: number } = {};

  Object.entries(keywords).forEach(([category, words]) => {
    scores[category] = 0;
    words.forEach((word) => {
      if (text.includes(word)) {
        scores[category] += 1;
      }
    });
  });

  // Find category with highest score
  let bestCategory = "Not Interested";
  let bestScore = 0;

  Object.entries(scores).forEach(([category, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  console.log(`🔍 Keyword classification scores:`, scores);
  console.log(`🔍 Keyword best match: ${bestCategory} (score: ${bestScore})`);

  return bestCategory;
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

    // If vector classification is uncertain (low scores), try keyword classification
    if (vectorCategory === "Not Interested") {
      const keywordCategory = classifyByKeywords(subject, body);
      if (keywordCategory !== "Not Interested") {
        console.log(
          `🔍 Keyword classification overrides vector: ${keywordCategory}`
        );
        return keywordCategory;
      }
    }

    return vectorCategory;
  }
};
