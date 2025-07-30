import { useState, useEffect } from "react";

interface Email {
  subject: string;
  from: string;
  text: string;
  date: string;
  folder: string;
  account: string;
  category?: string;
}

interface SearchResponse {
  hits: Email[];
  total: { value: number };
}

interface Account {
  value: string;
  label: string;
}

interface Folder {
  value: string;
  label: string;
}

interface Category {
  value: string;
  label: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("");
  const [account, setAccount] = useState(""); // Empty string represents "All Accounts"
  const [category, setCategory] = useState(""); // Empty string represents "All Categories"
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { value: "", label: "All Categories" },
    { value: "Interested", label: "Interested" },
    { value: "Meeting Booked", label: "Meeting Booked" },
    { value: "Not Interested", label: "Not Interested" },
    { value: "Spam", label: "Spam" },
    { value: "Out of Office", label: "Out of Office" },
  ]);
  const [results, setResults] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available accounts and folders on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts
        const accountsResponse = await fetch(
          "http://localhost:3000/api/accounts"
        );
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData.accounts);

        // Fetch folders
        const foldersResponse = await fetch(
          "http://localhost:3000/api/folders"
        );
        const foldersData = await foldersResponse.json();
        setFolders(foldersData.folders);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (folder) params.append("folder", folder);
      if (account) params.append("account", account);
      if (category) params.append("category", category);
      params.append("size", "20");

      console.log("🔍 Search params:", {
        query,
        folder: folder || "All Folders",
        account: account || "All Accounts",
        category: category || "All Categories",
      });

      const response = await fetch(
        `http://localhost:3000/api/emails?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      setResults(data.hits);
      setTotal(data.total.value);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {folders.map((fld) => (
                  <option key={fld.value} value={fld.value}>
                    {fld.label}
                  </option>
                ))}
              </select>
              {folder && (
                <p className="text-xs text-gray-500 mt-1">
                  Filtering by: {folder}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.value} value={acc.value}>
                    {acc.label}
                  </option>
                ))}
              </select>
              {account && (
                <p className="text-xs text-gray-500 mt-1">
                  Filtering by: {account}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {category && (
                <p className="text-xs text-gray-500 mt-1">
                  Filtering by: {category}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Results ({total} total emails)
              {account ? (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  from {account}
                </span>
              ) : (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  from All Accounts
                </span>
              )}
              {folder ? (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  in {folder}
                </span>
              ) : (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  in All Folders
                </span>
              )}
            </h3>
            <div className="space-y-4">
              {results
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((email, index) => (
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
                        {" "}
                        {new Date(email.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">From:</span> {email.from}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Folder:</span>{" "}
                      {email.folder} |
                      <span className="font-medium ml-2">Account:</span>{" "}
                      {email.account}
                      {email.category && (
                        <>
                          | <span className="font-medium ml-2">Category:</span>{" "}
                          <span className={`px-2 py-1 rounded text-xs ${
                            email.category === 'Interested' ? 'bg-green-100 text-green-800' :
                            email.category === 'Meeting Booked' ? 'bg-blue-100 text-blue-800' :
                            email.category === 'Not Interested' ? 'bg-red-100 text-red-800' :
                            email.category === 'Spam' ? 'bg-yellow-100 text-yellow-800' :
                            email.category === 'Out of Office' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {email.category}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {email.text.substring(0, 200)}...
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No emails found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
