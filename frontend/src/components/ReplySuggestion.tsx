import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { suggestReply } from "../services/emailService";

interface ReplySuggestionProps {
  emailText: string;
  onReplyGenerated?: (reply: string) => void;
}

export default function ReplySuggestion({
  emailText,
  onReplyGenerated,
}: ReplySuggestionProps) {
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReply = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "🔄 Generating reply for:",
        emailText.substring(0, 100) + "..."
      );
      const result = await suggestReply(emailText);
      console.log("✅ Reply generated:", result.reply);
      setReply(result.reply);
      onReplyGenerated?.(result.reply);
    } catch (err) {
      console.error("❌ Error generating reply:", err);
      setError(err instanceof Error ? err.message : "Failed to generate reply");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Reply Suggestion
          <Badge variant="secondary">RAG</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!reply && !loading && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Get AI-powered reply suggestions based on your email context
            </p>
            <Button onClick={generateReply} disabled={loading}>
              {loading ? "Generating..." : "Generate Reply"}
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">
              Generating contextual reply...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={generateReply}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {reply && (
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Suggested Reply:</h4>
              <p className="text-sm whitespace-pre-wrap">{reply}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} size="sm">
                📋 Copy Reply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReply("");
                  setError(null);
                }}
              >
                Generate New
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
