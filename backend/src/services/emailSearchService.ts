import { elasticClient } from "../config/elasticClient";

interface EmailSearchOptions {
  query?: string;
  folder?: string;
  account?: string;
  category?: string;
  page?: number;
  size?: number;
}

export async function searchEmails({
  query,
  folder,
  account,
  category,
  page = 1,
  size = 100,
}: EmailSearchOptions) {
  const must: any[] = [];

  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ["subject", "text", "from", "to"],
      },
    });
  }

  if (folder && folder.trim() !== "") {
    must.push({ match: { folder } });
    console.log(`🔍 Filtering by folder: ${folder}`);
  } else {
    console.log(`🔍 Showing emails from all folders`);
  }

  if (account && account.trim() !== "") {
    must.push({ match: { account } });
    console.log(`🔍 Filtering by account: ${account}`);
  } else {
    console.log(`🔍 Showing emails from all accounts`);
  }

  if (category) {
    must.push({ match: { category } });
  }

  const searchQuery = must.length > 0 ? { bool: { must } } : { match_all: {} };

  console.log(`🔍 Elasticsearch query:`, JSON.stringify(searchQuery, null, 2));

  const result = await elasticClient.search({
    index: "emails",
    from: (page - 1) * size,
    size,
    query: searchQuery,
  });

  return {
    hits: result.hits.hits.map((hit) => hit._source),
    total: result.hits.total,
  };
}
