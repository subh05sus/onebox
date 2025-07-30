import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, Folder, Mail, Users } from "lucide-react";
import type { Email } from "@/services/emailService";

const categoryColors: Record<string, string> = {
  Interested: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-red-100 text-red-800 border-red-200",
  "Not Interested": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Meeting Booked": "bg-blue-100 text-blue-800 border-blue-200",
  "Out of Office": "bg-purple-100 text-purple-800 border-purple-200",
};

interface EmailViewProps {
  email: Email;
  onBack: () => void;
}

export default function EmailView({ email, onBack }: EmailViewProps) {
  const categoryColor = categoryColors[email.category] || "bg-gray-100 text-gray-800 border-gray-200";
  const formattedDate = new Date(email.date).toLocaleDateString();
  const formattedTime = new Date(email.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Button>
          <Badge className={`${categoryColor} border`}>
            {email.category}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold mt-4">
          {email.subject}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">From:</span>
            <span className="text-sm">{email.from}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">To:</span>
            <span className="text-sm">{email.to.join(", ")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Folder:</span>
            <span className="text-sm">{email.folder}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Account:</span>
            <span className="text-sm">{email.account}</span>
          </div>
          
          <div className="flex items-center gap-2 md:col-span-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Date:</span>
            <span className="text-sm">{formattedDate} at {formattedTime}</span>
          </div>
        </div>

        {/* Email Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Message</h3>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {email.text}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 