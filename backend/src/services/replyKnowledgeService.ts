import { elasticClient } from "../config/elasticClient";

export async function saveReplyKnowledge(
  id: string,
  text: string,
  embedding: number[]
) {
  await elasticClient.index({
    index: "reply_knowledge",
    id,
    body: {
      text,
      vector: embedding,
    },
  });
}

export async function searchReplyKnowledge(queryEmbedding: number[], topK = 3) {
  const result = await elasticClient.search({
    index: "reply_knowledge",
    size: topK,
    query: {
      script_score: {
        query: { match_all: {} },
        script: {
          source: "cosineSimilarity(params.queryVector, 'vector') + 1.0",
          params: {
            queryVector: queryEmbedding,
          },
        },
      },
    },
  });

  return result.hits.hits.map((hit: any) => ({
    id: hit._id,
    text: hit._source.text,
    score: hit._score,
  }));
}

export async function ensureReplyKnowledgeIndex() {
  console.log("🔍 Checking if reply_knowledge index exists...");
  const exists = await elasticClient.indices.exists({
    index: "reply_knowledge",
  });
  if (!exists) {
    console.log("🔍 Creating reply_knowledge index...");
    await elasticClient.indices.create({
      index: "reply_knowledge",
      body: {
        mappings: {
          properties: {
            text: { type: "text" },
            vector: {
              type: "dense_vector",
              dims: 384,
              index: true,
              similarity: "cosine",
            },
          },
        },
      },
    });
    console.log("✅ Created reply_knowledge index");
  }
}
