export interface WebhookData {
  event: string;
  timestamp: string;
  email: {
    subject: string;
    from: string;
    to: string[];
    date: string;
    category: string;
    account: string;
    uid: string;
  };
  metadata: {
    source: string;
    version: string;
  };
}

export function createWebhookPayload(emailData: any): WebhookData {
  return {
    event: "email.interested",
    timestamp: new Date().toISOString(),
    email: {
      subject: emailData.subject,
      from: emailData.from,
      to: emailData.to,
      date: emailData.date,
      category: emailData.category,
      account: emailData.account,
      uid: emailData.uid,
    },
    metadata: {
      source: "reachinbox",
      version: "1.0.0",
    },
  };
}

export function createTestWebhookPayload(): WebhookData {
  return {
    event: "test",
    timestamp: new Date().toISOString(),
    email: {
      subject: "Test Email",
      from: "test@example.com",
      to: ["recipient@example.com"],
      date: new Date().toISOString(),
      category: "Interested",
      account: "test-account",
      uid: "12345",
    },
    metadata: {
      source: "reachinbox",
      version: "1.0.0",
    },
  };
}
