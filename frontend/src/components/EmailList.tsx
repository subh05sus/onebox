import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, User, Folder, Mail } from "lucide-react";
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
  onEmailClick: (email: Email) => void;
}

export default function EmailList({ emails, onEmailClick }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No emails found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email List ({emails.length} emails)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {emails.map((email, index) => {
          const categoryColor = categoryColors[email.category] || "bg-gray-100 text-gray-800 border-gray-200";
          const formattedDate = new Date(email.date).toLocaleDateString();
          const formattedTime = new Date(email.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={email.uid}>
              <div
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onEmailClick(email)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {email.subject}
                      </h3>
                      <Badge className={`${categoryColor} border`}>
                        {email.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {email.text}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{email.from}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Folder className="h-3 w-3" />
                        <span>{email.folder}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{email.account}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formattedDate} {formattedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index < emails.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 