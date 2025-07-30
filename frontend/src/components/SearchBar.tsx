import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  placeholder = "Search emails...",
  debounceMs = 500,
}: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(query);

  // Update local query when prop changes
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== query) {
        setQuery(localQuery);
        if (onSearch) {
          onSearch();
        }
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localQuery, query, setQuery, onSearch, debounceMs]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setQuery(localQuery);
      if (onSearch) {
        onSearch();
      }
    }
  };

  const handleSearchClick = () => {
    setQuery(localQuery);
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="pl-10 pr-4 py-2 w-full"
      />
      {onSearch && (
        <Button
          onClick={handleSearchClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
          size="sm"
        >
          Search
        </Button>
      )}
    </div>
  );
}
