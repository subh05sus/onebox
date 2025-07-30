import { useEffect, useState } from "react";
import {
  fetchEmails,
  fetchAccounts,
  fetchFolders,
} from "@/services/emailService";
import type { Email } from "@/services/emailService";
import EmailCard from "@/components/EmailCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import EmailView from "@/components/EmailView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2, Mail } from "lucide-react";

const PAGE_SIZE = 20;

function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [query, setQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Available options
  const [accounts, setAccounts] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [folders, setFolders] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [categories] = useState<Array<{ value: string; label: string }>>([
    { value: "all", label: "All Categories" },
    { value: "Interested", label: "Interested" },
    { value: "Meeting Booked", label: "Meeting Booked" },
    { value: "Not Interested", label: "Not Interested" },
    { value: "Spam", label: "Spam" },
    { value: "Out of Office", label: "Out of Office" },
  ]);

  // Debug categories
  console.log("Categories:", categories);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [accountsData, foldersData] = await Promise.all([
          fetchAccounts(),
          fetchFolders(),
        ]);
        // Filter out any empty values to prevent Select errors
        const filteredAccounts = accountsData.accounts.filter(
          (acc) => acc.value && acc.value.trim() !== ""
        );
        const filteredFolders = foldersData.folders.filter(
          (folder) => folder.value && folder.value.trim() !== ""
        );

        console.log("Filtered accounts:", filteredAccounts);
        console.log("Filtered folders:", filteredFolders);

        setAccounts(filteredAccounts);
        setFolders(filteredFolders);
      } catch (err) {
        setError("Failed to load initial data");
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load emails when filters change
  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { hits, total } = await fetchEmails({
          query,
          folder: selectedFolder,
          account: selectedAccount,
          category: selectedCategory || undefined,
          page,
          size: PAGE_SIZE,
        });

        setEmails(hits);
        setTotal(total.value || 0);
      } catch (err) {
        setError("Failed to load emails");
        console.error("Failed to load emails:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, [query, selectedFolder, selectedAccount, selectedCategory, page]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (selectedEmail) {
    return (
      <EmailView email={selectedEmail} onBack={() => setSelectedEmail(null)} />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Email Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            placeholder="Search emails by subject, content, sender..."
          />

          {/* Filter Panel */}
          <FilterPanel
            folders={folders}
            accounts={accounts}
            categories={categories}
            selectedFolder={selectedFolder}
            selectedAccount={selectedAccount}
            selectedCategory={selectedCategory}
            onFolderChange={(value) => {
              setSelectedFolder(value);
              handleFilterChange();
            }}
            onAccountChange={(value) => {
              setSelectedAccount(value);
              handleFilterChange();
            }}
            onCategoryChange={(value) => {
              setSelectedCategory(value);
              handleFilterChange();
            }}
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading emails...
              </div>
            ) : (
              `Results (${total} total emails)`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!loading && !error && emails.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No emails found. Try adjusting your search criteria.
            </div>
          )}

          {!loading && !error && emails.length > 0 && (
            <>
              <div className="grid gap-4">
                {emails.map((email) => (
                  <EmailCard
                    key={email.uid}
                    email={email}
                    onClick={() => setSelectedEmail(email)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmailDashboard;
