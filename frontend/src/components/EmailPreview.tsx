import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Folder, Mail, Users } from "lucide-react";
import type { Email } from "@/services/emailService";
import ReplySuggestion from "./ReplySuggestion";

const categoryColors: Record<string, string> = {
  Interested: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-red-100 text-red-800 border-red-200",
  "Not Interested": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Meeting Booked": "bg-blue-100 text-blue-800 border-blue-200",
  "Out of Office": "bg-purple-100 text-purple-800 border-purple-200",
};

interface EmailPreviewProps {
  email: Email | null;
}

export default function EmailPreview({ email }: EmailPreviewProps) {
  if (!email) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an email to preview</p>
            <p className="text-sm">
              Choose an email from the list to view its details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryColor =
    categoryColors[email.category] ||
    "bg-gray-100 text-gray-800 border-gray-200";
  const formattedDate = new Date(email.date).toLocaleDateString();
  const formattedTime = new Date(email.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg lg:text-xl font-bold line-clamp-2 mb-2">
              {email.subject}
            </CardTitle>
            <Badge className={`${categoryColor} border`}>
              {email.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Email Metadata */}
        <div className="space-y-3 p-3 lg:p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">From:</span>
              <span className="text-sm truncate">{email.from}</span>
            </div>

            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">To:</span>
              <div className="flex flex-wrap gap-1">
                {email.to.map((recipient, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="text-xs px-2 py-1"
                  >
                    {recipient}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">Folder:</span>
              <span className="text-sm truncate">{email.folder}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">Account:</span>
              <span className="text-sm truncate">{email.account}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">
                {formattedDate} at {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Message</h3>
          <div className="prose prose-sm max-w-none break-words">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {email.text}
            </div>
          </div>
        </div>

        {/* AI Reply Suggestion */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Reply Assistant</h3>
          <ReplySuggestion
            emailText={`${email.subject}\n\n${email.text}`}
            onReplyGenerated={(reply) => {
              console.log("Generated reply:", reply);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
