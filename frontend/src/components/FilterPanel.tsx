import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import {
  filterValidSelectOptions,
  safeSelectValue,
} from "@/utils/selectValidation";

interface FilterPanelProps {
  folders: Array<{ value: string; label: string }>;
  accounts: Array<{ value: string; label: string }>;
  categories: Array<{ value: string; label: string }>;
  selectedFolder: string | null;
  selectedAccount: string | null;
  selectedCategory: string | null;
  onFolderChange: (value: string | null) => void;
  onAccountChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
}

export default function FilterPanel({
  folders,
  accounts,
  categories,
  selectedFolder,
  selectedAccount,
  selectedCategory,
  onFolderChange,
  onAccountChange,
  onCategoryChange,
}: FilterPanelProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium whitespace-nowrap">
            Folder
          </label>
          <Select
            value={safeSelectValue(selectedFolder)}
            onValueChange={(value: string) =>
              onFolderChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {filterValidSelectOptions(folders).map((folder) => (
                <SelectItem key={folder.value} value={folder.value}>
                  {folder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium whitespace-nowrap">
            Account
          </label>
          <Select
            value={safeSelectValue(selectedAccount)}
            onValueChange={(value: string) =>
              onAccountChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {filterValidSelectOptions(accounts).map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium whitespace-nowrap">
            Category
          </label>
          <Select
            value={safeSelectValue(selectedCategory)}
            onValueChange={(value: string) =>
              onCategoryChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Categories</SelectItem> */}
              {filterValidSelectOptions(categories).map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
