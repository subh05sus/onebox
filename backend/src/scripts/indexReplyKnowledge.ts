import knowledge from '../data/reply_knowledge_base.json';
import { getEmbedding } from '../utils/embedding';
import { saveReplyKnowledge, ensureReplyKnowledgeIndex } from '../services/replyKnowledgeService';

async function indexKnowledge() {
  console.log('📦 Indexing reply knowledge base...');
  
  // Ensure index exists
  await ensureReplyKnowledgeIndex();
  
  for (const item of knowledge) {
    try {
      const embedding = await getEmbedding(item.text);
      await saveReplyKnowledge(item.id, item.text, embedding);
      console.log(`✅ Indexed: ${item.id}`);
    } catch (err) {
      console.error(`❌ Failed to index ${item.id}:`, err);
    }
  }
  
  console.log('🎉 All reply templates indexed.');
}

// Run the indexing
indexKnowledge().catch(console.error); 