// Simple text-based embedding using hash function
// This is a lightweight alternative to heavy ML models
function simpleHash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // Create a simple embedding based on text content
    // This is a lightweight alternative to heavy ML models
    const words = text.toLowerCase().split(/\s+/);
    let embedding = new Array(384).fill(0);

    // Use word positions and simple hashing to create embeddings
    words.forEach((word, index) => {
      if (index < 384) {
        const hash = simpleHash(word);
        embedding[index] = (hash % 1000) / 1000; // Normalize to 0-1
      }
    });

    // Add some semantic features based on common words
    const interestedWords = [
      "interested",
      "learn",
      "more",
      "services",
      "call",
      "meeting",
    ];
    const meetingWords = [
      "meeting",
      "schedule",
      "booked",
      "confirmed",
      "appointment",
    ];
    const notInterestedWords = [
      "not interested",
      "decline",
      "reject",
      "no thanks",
    ];
    const spamWords = [
      "buy now",
      "limited time",
      "free",
      "offer",
      "click here",
    ];
    const oooWords = ["out of office", "unavailable", "return", "away"];

    // Add semantic features to the embedding (using indices 379-383 to stay within 384 dimensions)
    const allWords = text.toLowerCase();
    if (interestedWords.some((word) => allWords.includes(word)))
      embedding[379] = 1;
    if (meetingWords.some((word) => allWords.includes(word)))
      embedding[380] = 1;
    if (notInterestedWords.some((word) => allWords.includes(word)))
      embedding[381] = 1;
    if (spamWords.some((word) => allWords.includes(word))) embedding[382] = 1;
    if (oooWords.some((word) => allWords.includes(word))) embedding[383] = 1;

    // Ensure the embedding is exactly 384 dimensions
    if (embedding.length !== 384) {
      console.warn(
        `⚠️ Embedding length is ${embedding.length}, truncating to 384`
      );
      embedding = embedding.slice(0, 384);
      while (embedding.length < 384) {
        embedding.push(0);
      }
    }

    return embedding;
  } catch (err) {
    console.error("❌ Embedding generation failed:", err);
    return new Array(384).fill(0);
  }
}
