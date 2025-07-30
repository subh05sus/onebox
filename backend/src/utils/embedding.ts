// Lightweight embedding using word vectors and semantic features
// This provides better embeddings than simple hashing while being compatible with CommonJS

// Enhanced word vector mapping for common words with more distinctive vectors
const wordVectors: { [key: string]: number[] } = {
  // Business/Interest words - high values in first dimensions
  meeting: [0.9, 0.1, 0.2, 0.8, 0.3],
  schedule: [0.8, 0.2, 0.3, 0.7, 0.4],
  appointment: [0.9, 0.1, 0.1, 0.9, 0.2],
  call: [0.7, 0.3, 0.4, 0.6, 0.5],
  interested: [0.8, 0.2, 0.1, 0.6, 0.4],
  learn: [0.7, 0.3, 0.2, 0.5, 0.6],
  more: [0.6, 0.4, 0.3, 0.4, 0.7],
  services: [0.6, 0.4, 0.3, 0.6, 0.5],
  proposal: [0.8, 0.2, 0.1, 0.7, 0.3],
  discuss: [0.7, 0.3, 0.2, 0.6, 0.4],
  opportunity: [0.8, 0.2, 0.1, 0.7, 0.3],

  // Rejection/Not Interested words - high values in second dimension
  decline: [0.1, 0.9, 0.8, 0.2, 0.7],
  reject: [0.1, 0.9, 0.9, 0.1, 0.8],
  not: [0.2, 0.8, 0.7, 0.3, 0.6],
  no: [0.2, 0.8, 0.7, 0.3, 0.6],
  thanks: [0.3, 0.7, 0.6, 0.4, 0.5],
  pass: [0.2, 0.8, 0.7, 0.3, 0.6],
  uninterested: [0.1, 0.9, 0.8, 0.2, 0.7],

  // Spam words - high values in third dimension
  spam: [0.1, 0.2, 0.9, 0.1, 0.8],
  offer: [0.3, 0.2, 0.8, 0.2, 0.7],
  free: [0.2, 0.3, 0.8, 0.2, 0.7],
  limited: [0.1, 0.2, 0.9, 0.1, 0.8],
  buy: [0.2, 0.3, 0.8, 0.2, 0.7],
  click: [0.1, 0.2, 0.9, 0.1, 0.8],
  urgent: [0.1, 0.2, 0.9, 0.1, 0.8],

  // Out of Office words - high values in fourth dimension
  office: [0.2, 0.1, 0.1, 0.9, 0.2],
  unavailable: [0.1, 0.1, 0.1, 0.9, 0.3],
  return: [0.2, 0.2, 0.1, 0.8, 0.3],
  away: [0.1, 0.1, 0.1, 0.9, 0.2],
  out: [0.1, 0.1, 0.1, 0.9, 0.2],
  vacation: [0.1, 0.1, 0.1, 0.9, 0.2],
  leave: [0.2, 0.1, 0.1, 0.8, 0.3],

  // Meeting/Booking words - high values in fifth dimension
  booked: [0.3, 0.1, 0.1, 0.2, 0.9],
  confirmed: [0.3, 0.1, 0.1, 0.2, 0.9],
  calendar: [0.2, 0.1, 0.1, 0.2, 0.9],
  slot: [0.2, 0.1, 0.1, 0.2, 0.9],
  time: [0.3, 0.1, 0.1, 0.2, 0.8],
  available: [0.3, 0.1, 0.1, 0.2, 0.8],
};

// Enhanced semantic categories for better classification
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
    "proposal",
    "discuss",
    "opportunity",
    "explore",
    "consider",
  ],
  notInterested: [
    "not interested",
    "decline",
    "reject",
    "no thanks",
    "not",
    "uninterested",
    "pass",
    "no",
    "thanks but no",
  ],
  spam: [
    "buy now",
    "limited time",
    "free",
    "offer",
    "click here",
    "spam",
    "limited",
    "urgent",
    "act now",
    "special offer",
    "discount",
  ],
  ooo: [
    "out of office",
    "unavailable",
    "return",
    "away",
    "out",
    "office",
    "vacation",
    "leave",
    "back",
    "automatic reply",
  ],
  meeting: [
    "meeting",
    "schedule",
    "booked",
    "confirmed",
    "appointment",
    "call",
    "calendar",
    "slot",
    "time",
    "available",
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

  // Check each semantic category with weighted scoring
  Object.entries(semanticCategories).forEach(([category, words], index) => {
    if (index < 5) {
      let matchCount = 0;
      words.forEach((word) => {
        if (lowerText.includes(word)) {
          matchCount++;
        }
      });
      // Weight the feature based on number of matches (0-1 scale)
      features[index] = Math.min(matchCount / 3, 1);
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

    // Process each word and add its vector to the embedding with position weighting
    words.forEach((word, wordIndex) => {
      if (wordIndex < 75) {
        // Limit to first 75 words to avoid overflow
        const wordVector = getWordVector(word);
        const startIndex = wordIndex * 5;

        // Weight words by position (earlier words get higher weight)
        const positionWeight = Math.max(0.5, 1 - wordIndex / 100);

        // Add word vector to embedding with position weighting
        for (let i = 0; i < 5 && startIndex + i < 384; i++) {
          embedding[startIndex + i] = wordVector[i] * positionWeight;
        }
      }
    });

    // Add semantic features to the end of the embedding with higher weight
    const semanticFeatures = getSemanticFeatures(text);
    for (let i = 0; i < 5 && 379 + i < 384; i++) {
      embedding[379 + i] = semanticFeatures[i] * 2; // Give semantic features more weight
    }

    // Add text length and complexity features
    const textLength = Math.min(text.length / 1000, 1); // Normalize to 0-1
    const wordCount = Math.min(words.length / 50, 1); // Normalize to 0-1
    const uniqueWords = Math.min(new Set(words).size / 20, 1); // Normalize to 0-1

    // Add these features to specific positions
    if (embedding.length >= 384) {
      embedding[374] = textLength;
      embedding[375] = wordCount;
      embedding[376] = uniqueWords;
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
