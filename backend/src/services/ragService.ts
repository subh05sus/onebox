import { getEmbedding } from "../utils/embedding";
import {
  searchReplyKnowledge,
  ensureReplyKnowledgeIndex,
} from "./replyKnowledgeService";
import { generateReplyWithLLM } from "../utils/llm";
import { elasticClient } from "../config/elasticClient";

export async function initRAG() {
  console.log("🔧 Initializing RAG system...");

  // Ensure reply knowledge index exists
  await ensureReplyKnowledgeIndex();
  console.log("✅ RAG system initialized");
}

export async function storeContext(id: string, text: string) {
  const embedding = await getEmbedding(text);
  await elasticClient.index({
    index: "reply_knowledge",
    id,
    body: {
      text,
      vector: embedding,
    },
  });
  console.log(`✅ Stored context: ${id}`);
}

export async function generateContextualReply(
  emailText: string
): Promise<string> {
  try {
    console.log(
      "🤖 Generating contextual reply for:",
      emailText.substring(0, 100) + "..."
    );

    // Step 1: Get embedding for the email
    const emailEmbedding = await getEmbedding(emailText);
    console.log("📊 Email embedding generated");

    // Step 2: Search for relevant context
    const relatedDocs = await searchReplyKnowledge(emailEmbedding, 3);
    console.log("🔍 Related docs found:", relatedDocs.length);

    if (relatedDocs.length === 0) {
      return "I apologize, but I don't have enough context to generate a relevant reply.";
    }

    // Step 3: Build the prompt with context
    const context = relatedDocs
      .map((d, i) => `Context ${i + 1}: ${d.text}`)
      .join("\n");
    const prompt = `
      You are a professional email assistant. Based on the following context and incoming email, generate a polite and relevant reply.
      
      Context:
      ${context}
      
      Incoming Email:
      "${emailText}"
      
      Generate a professional reply:
    `;
    console.log("📝 Prompt for LLM:", prompt.substring(0, 200) + "...");

    // Step 4: Generate reply using LLM
    const reply = await generateReplyWithLLM(prompt);
    console.log("✅ LLM reply generated");

    return (
      reply || "I apologize, but I couldn't generate a reply at this time."
    );
  } catch (error) {
    console.error("❌ Error in generateContextualReply:", error);
    throw error;
  }
}

export async function suggestReply(emailText: string): Promise<string> {
  try {
    console.log(
      "💡 Suggesting reply for email text:",
      emailText.substring(0, 100) + "..."
    );

    // Step 1: Get embedding for the email
    const emailEmbedding = await getEmbedding(emailText);
    console.log("📊 Email embedding generated");

    // Step 2: Search for relevant context
    const relatedDocs = await searchReplyKnowledge(emailEmbedding, 3);
    console.log("🔍 Related docs found:", relatedDocs.length);

    // Step 3: Build the prompt with context
    const context = relatedDocs
      .map((d, i) => `Context ${i + 1}: ${d.text}`)
      .join("\n");
    const prompt = `
      You are an assistant helping with professional email replies.
      Incoming email:

      "${emailText}"

      Use the following context to write a polite and relevant response:

      ${context}

      Respond accordingly:
    `;
    console.log("📝 Prompt for LLM:", prompt.substring(0, 200) + "...");

    // Step 4: Call the LLM API
    const reply = await generateReplyWithLLM(prompt);
    console.log("✅ LLM reply generated");

    return (
      reply || "I apologize, but I couldn't generate a reply at this time."
    );
  } catch (error) {
    console.error("❌ Error in suggestReply:", error);
    throw error;
  }
}
