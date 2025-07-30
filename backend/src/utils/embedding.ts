// Lightweight embedding using word vectors and semantic features
// This provides better embeddings than simple hashing while being compatible with CommonJS

// Simple word vector mapping for common words
const wordVectors: { [key: string]: number[] } = {
  // Common business words
  meeting: [0.8, 0.2, 0.1, 0.9, 0.3],
  schedule: [0.7, 0.3, 0.2, 0.8, 0.4],
  appointment: [0.9, 0.1, 0.1, 0.9, 0.2],
  call: [0.6, 0.4, 0.3, 0.7, 0.5],
  interested: [0.8, 0.2, 0.1, 0.6, 0.4],
  learn: [0.7, 0.3, 0.2, 0.5, 0.6],
  more: [0.5, 0.5, 0.4, 0.4, 0.7],
  services: [0.6, 0.4, 0.3, 0.6, 0.5],
  decline: [0.2, 0.8, 0.9, 0.1, 0.8],
  reject: [0.1, 0.9, 0.9, 0.1, 0.9],
  not: [0.3, 0.7, 0.6, 0.2, 0.8],
  spam: [0.1, 0.9, 0.8, 0.1, 0.9],
  offer: [0.4, 0.6, 0.5, 0.3, 0.7],
  free: [0.3, 0.7, 0.6, 0.2, 0.8],
  limited: [0.2, 0.8, 0.7, 0.1, 0.9],
  out: [0.2, 0.8, 0.7, 0.1, 0.8],
  office: [0.8, 0.2, 0.1, 0.9, 0.2],
  unavailable: [0.1, 0.9, 0.8, 0.1, 0.9],
  return: [0.3, 0.7, 0.6, 0.2, 0.8],
  away: [0.2, 0.8, 0.7, 0.1, 0.8],
};

// Semantic categories for better classification
const semanticCategories = {
  interested: [
    "interested",
    "learn",
    "more",
    "services",
    "call",
    "meeting",
    "schedule",
    "appointment",
  ],
  notInterested: [
    "not interested",
    "decline",
    "reject",
    "no thanks",
    "not",
    "uninterested",
  ],
  spam: [
    "buy now",
    "limited time",
    "free",
    "offer",
    "click here",
    "spam",
    "limited",
  ],
  ooo: ["out of office", "unavailable", "return", "away", "out", "office"],
  meeting: [
    "meeting",
    "schedule",
    "booked",
    "confirmed",
    "appointment",
    "call",
  ],
};

function simpleHash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function getWordVector(word: string): number[] {
  const normalizedWord = word.toLowerCase().trim();

  // Check if we have a pre-defined vector for this word
  if (wordVectors[normalizedWord]) {
    return wordVectors[normalizedWord];
  }

  // Generate a simple vector based on character composition
  const vector = new Array(5).fill(0);
  const hash = simpleHash(normalizedWord);

  // Use hash to generate consistent but varied vectors
  vector[0] = (hash % 100) / 100;
  vector[1] = ((hash >> 8) % 100) / 100;
  vector[2] = ((hash >> 16) % 100) / 100;
  vector[3] = ((hash >> 24) % 100) / 100;
  vector[4] = ((hash % 50) + 50) / 100;

  return vector;
}

function getSemanticFeatures(text: string): number[] {
  const lowerText = text.toLowerCase();
  const features = new Array(5).fill(0);

  // Check each semantic category
  Object.entries(semanticCategories).forEach(([category, words], index) => {
    if (index < 5) {
      const hasMatch = words.some((word) => lowerText.includes(word));
      features[index] = hasMatch ? 1 : 0;
    }
  });

  return features;
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // Split text into words
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Initialize embedding array
    let embedding = new Array(384).fill(0);

    // Process each word and add its vector to the embedding
    words.forEach((word, wordIndex) => {
      if (wordIndex < 75) {
        // Limit to first 75 words to avoid overflow
        const wordVector = getWordVector(word);
        const startIndex = wordIndex * 5;

        // Add word vector to embedding
        for (let i = 0; i < 5 && startIndex + i < 384; i++) {
          embedding[startIndex + i] = wordVector[i];
        }
      }
    });

    // Add semantic features to the end of the embedding
    const semanticFeatures = getSemanticFeatures(text);
    for (let i = 0; i < 5 && 379 + i < 384; i++) {
      embedding[379 + i] = semanticFeatures[i];
    }

    // Normalize the embedding to ensure values are between 0 and 1
    const maxVal = Math.max(...embedding);
    if (maxVal > 0) {
      embedding = embedding.map((val) => val / maxVal);
    }

    // Ensure the embedding is exactly 384 dimensions
    if (embedding.length !== 384) {
      console.warn(
        `⚠️ Embedding length is ${embedding.length}, truncating to 384`
      );
      const truncated = embedding.slice(0, 384);
      while (truncated.length < 384) {
        truncated.push(0);
      }
      return truncated;
    }

    return embedding;
  } catch (err) {
    console.error("❌ Embedding generation failed:", err);
    return new Array(384).fill(0);
  }
}
