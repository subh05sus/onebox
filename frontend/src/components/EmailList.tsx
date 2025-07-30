import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, User } from "lucide-react";
import type { Email } from "@/services/emailService";

const categoryColors: Record<string, string> = {
  Interested: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-red-100 text-red-800 border-red-200",
  "Not Interested": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Meeting Booked": "bg-blue-100 text-blue-800 border-blue-200",
  "Out of Office": "bg-purple-100 text-purple-800 border-purple-200",
};

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailClick: (email: Email) => void;
  loading?: boolean;
  error?: string | null;
}

export default function EmailList({
  emails,
  selectedEmail,
  onEmailClick,
  loading = false,
  error = null,
}: EmailListProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Loading emails...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading emails</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No emails found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="space-y-0">
          {emails.map((email, index) => {
            const categoryColor =
              categoryColors[email.category] ||
              "bg-gray-100 text-gray-800 border-gray-200";
            const formattedDate = new Date(email.date).toLocaleDateString();
            const isSelected = selectedEmail?.uid === email.uid;

            return (
              <div key={email.uid}>
                <div
                  className={`p-3 lg:p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    isSelected ? "bg-muted border-l-2 border-primary" : ""
                  }`}
                  onClick={() => onEmailClick(email)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-medium text-sm line-clamp-2 flex-1 ${
                          isSelected ? "text-primary" : ""
                        }`}
                      >
                        {email.subject}
                      </h3>
                      <Badge className={`${categoryColor} border text-xs`}>
                        {email.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {email.text.slice(0, 100)}...
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{email.from}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {index < emails.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
