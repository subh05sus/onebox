import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Folder, Mail } from "lucide-react";
import type { Email } from "@/services/emailService";

const categoryColors: Record<string, string> = {
  Interested: "bg-green-100 text-green-800 border-green-200",
  Spam: "bg-red-100 text-red-800 border-red-200",
  "Not Interested": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Meeting Booked": "bg-blue-100 text-blue-800 border-blue-200",
  "Out of Office": "bg-purple-100 text-purple-800 border-purple-200",
};

interface EmailCardProps {
  email: Email;
  onClick: () => void;
}

export default function EmailCard({ email, onClick }: EmailCardProps) {
  const categoryColor = categoryColors[email.category] || "bg-gray-100 text-gray-800 border-gray-200";
  const formattedDate = new Date(email.date).toLocaleDateString();
  const formattedTime = new Date(email.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">
            {email.subject}
          </h3>
          <Badge className={`${categoryColor} border`}>
            {email.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {email.text.slice(0, 150)}...
        </p>
        
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{email.from}</span>
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
      </CardContent>
    </Card>
  );
} 