import { useState } from "react";

interface Email {
  subject: string;
  from: string;
  text: string;
  date: string;
  folder: string;
  account: string;
}

interface SearchResponse {
  hits: Email[];
  total: { value: number };
}

function App() {
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("");
  const [account, setAccount] = useState("");
  const [results, setResults] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (folder) params.append("folder", folder);
      if (account) params.append("account", account);
      params.append("size", "20");

      const response = await fetch(
        `http://localhost:3000/api/emails?${params}`
      );
      const data: SearchResponse = await response.json();

      setResults(data.hits);
      setTotal(data.total.value);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Email Search with Elasticsearch
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Emails</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in subject, text, from, to..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder
              </label>
              <input
                type="text"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g., INBOX, Sent"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Results ({total} total emails)
            </h3>
            <div className="space-y-4">
              {results.map((email, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {email.subject}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(email.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">From:</span> {email.from}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Folder:</span> {email.folder}{" "}
                    |<span className="font-medium ml-2">Account:</span>{" "}
                    {email.account}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {email.text.substring(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No emails found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
