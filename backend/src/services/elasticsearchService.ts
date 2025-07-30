import dotenv from "dotenv";
import { Client } from "@elastic/elasticsearch";
import { elasticClient } from "../config/elasticClient";
import { emailIndexMapping } from "../config/emailIndexMapping";

dotenv.config();

const INDEX = "emails";

export async function ensureEmailIndex() {
  const exists = await elasticClient.indices.exists({ index: INDEX });

  if (!exists) {
    await elasticClient.indices.create({
      index: INDEX,
      mappings: emailIndexMapping.mappings as any,
    });
    console.log(`Created Elasticsearch index: ${INDEX}`);
  } else {
    // Check if the index has the correct mapping for the vector field
    try {
      const mapping = await elasticClient.indices.getMapping({ index: INDEX });
      const vectorMapping = mapping[INDEX]?.mappings?.properties?.vector;

      if (!vectorMapping || vectorMapping.type !== "dense_vector") {
        console.log("⚠️  Index mapping mismatch detected. Recreating index...");
        await elasticClient.indices.delete({ index: INDEX });
        await elasticClient.indices.create({
          index: INDEX,
          mappings: emailIndexMapping.mappings as any,
        });
        console.log(`✅ Recreated Elasticsearch index: ${INDEX}`);
      }
    } catch (error) {
      console.error("Error checking index mapping:", error);
      // If we can't check the mapping, recreate the index to be safe
      console.log("⚠️  Could not verify mapping. Recreating index...");
      await elasticClient.indices.delete({ index: INDEX });
      await elasticClient.indices.create({
        index: INDEX,
        mappings: emailIndexMapping.mappings as any,
      });
      console.log(`✅ Recreated Elasticsearch index: ${INDEX}`);
    }
  }
}

export interface SavedEmail {
  subject: string;
  text: string;
  html: string;
  date: string | Date;
  from: string;
  to: string[];
  folder: string;
  account: string;
  uid: number;
}

export const saveEmailToElasticsearch = async (doc: any) => {
  try {
    await elasticClient.index({
      index: "emails",
      id: `${doc.account}_${doc.uid}`,
      document: doc,
    });
  } catch (error) {
    console.error("Failed to save email to Elasticsearch:", error);
    throw error;
  }
};

export const forceRecreateEmailIndex = async () => {
  console.log("🔄 Force recreating email index...");
  try {
    await elasticClient.indices.delete({ index: INDEX });
    console.log("✅ Deleted existing index");
  } catch (error) {
    console.log("ℹ️  Index didn't exist or couldn't be deleted");
  }

  await elasticClient.indices.create({
    index: INDEX,
    mappings: emailIndexMapping.mappings as any,
  });
  console.log("✅ Created new email index with correct mapping");
};
