import { elasticClient } from "../config/elasticClient";

interface EmailSearchOptions {
  query?: string;
  folder?: string;
  account?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: "date" | "date_asc" | "date_desc";
}

export async function searchEmails({
  query,
  folder,
  account,
  category,
  page = 1,
  size = 100,
  sort = "date_desc",
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

  // Define sort order based on sort parameter
  let sortOrder: any[] = [];
  if (sort === "date" || sort === "date_desc") {
    sortOrder = [{ date: { order: "desc" } }];
  } else if (sort === "date_asc") {
    sortOrder = [{ date: { order: "asc" } }];
  }

  console.log(`🔍 Elasticsearch query:`, JSON.stringify(searchQuery, null, 2));
  console.log(`📅 Sorting by: ${sort}`);

  const result = await elasticClient.search({
    index: "emails",
    from: (page - 1) * size,
    size,
    query: searchQuery,
    sort: sortOrder,
  });

  return {
    hits: result.hits.hits.map((hit) => hit._source),
    total: result.hits.total,
  };
}
