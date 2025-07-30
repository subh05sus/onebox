import { useEffect, useState } from "react";
import {
  fetchEmails,
  fetchAccounts,
  fetchFolders,
} from "@/services/emailService";
import type { Email } from "@/services/emailService";
import EmailList from "@/components/EmailList";
import EmailPreview from "@/components/EmailPreview";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
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

        // Clear selected email if it's no longer in the list
        if (
          selectedEmail &&
          !hits.find((email) => email.uid === selectedEmail.uid)
        ) {
          setSelectedEmail(null);
        }
      } catch (err) {
        setError("Failed to load emails");
        console.error("Failed to load emails:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, [query, selectedFolder, selectedAccount, selectedCategory, page]);

  const handleFilterChange = () => {
    setPage(1);
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="h-screen flex flex-col">
      {/* Compact Header with Search and Filters */}
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Email Dashboard</h1>
          </div>
          <div className="flex-1">
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeholder="Search emails..."
              debounceMs={500}
            />
          </div>
        </div>

        {/* Compact Filter Panel */}
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 lg:px-6 py-4 min-h-0">
        {/* Left Panel - Email List */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading emails...
                </div>
              ) : (
                `Emails (${total} total)`
              )}
            </h2>
          </div>

          <div className="flex-1 min-h-0">
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              onEmailClick={handleEmailClick}
              loading={loading}
              error={error}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
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
        </div>

        {/* Right Panel - Email Preview */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Email Preview</h2>
          </div>

          <div className="flex-1 min-h-0">
            <EmailPreview email={selectedEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDashboard;
