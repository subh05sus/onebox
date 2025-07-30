import axios from "axios";
import {
  createSlackMessage,
  createSimpleSlackMessage,
} from "../utils/slackTemplates";
import {
  createWebhookPayload,
  createTestWebhookPayload,
} from "../utils/webhookTemplates";

export class NotificationService {
  private slackWebhookUrl: string;
  private webhookUrl: string;
  private webhookTimeout: number;

  constructor() {
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || "";
    this.webhookUrl = process.env.WEBHOOK_URL || "";
    this.webhookTimeout = Number(process.env.WEBHOOK_TIMEOUT) || 5000;
  }

  async notifyInterestedEmail(emailData: any) {
    console.log(
      `🎯 Processing notifications for interested email: ${emailData.subject}`
    );

    const promises = [];

    // Send Slack notification
    if (this.slackWebhookUrl) {
      const slackMessage = createSlackMessage(emailData);
      promises.push(
        axios
          .post(this.slackWebhookUrl, slackMessage, {
            timeout: this.webhookTimeout,
          })
          .then(() => console.log("✅ Slack notification sent"))
          .catch((err) =>
            console.error("❌ Slack notification failed:", err.message)
          )
      );
    } else {
      console.log("⚠️ Slack webhook URL not configured");
    }

    // Trigger webhook
    if (this.webhookUrl) {
      const webhookData = createWebhookPayload(emailData);
      promises.push(
        axios
          .post(this.webhookUrl, webhookData, {
            timeout: this.webhookTimeout,
          })
          .then(() => console.log("✅ Webhook triggered"))
          .catch((err) =>
            console.error("❌ Webhook trigger failed:", err.message)
          )
      );
    } else {
      console.log("⚠️ Webhook URL not configured");
    }

    await Promise.allSettled(promises);
  }

  async sendSlackNotification(message: string) {
    if (!this.slackWebhookUrl) {
      throw new Error("Slack webhook URL not configured");
    }

    try {
      await axios.post(
        this.slackWebhookUrl,
        { text: message },
        {
          timeout: this.webhookTimeout,
        }
      );
      console.log("✅ Slack notification sent");
      return true;
    } catch (error) {
      console.error("❌ Failed to send Slack notification:", error);
      throw error;
    }
  }

  async triggerWebhook(url: string, data: any) {
    try {
      await axios.post(url, data, {
        timeout: this.webhookTimeout,
      });
      console.log("✅ Webhook triggered successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to trigger webhook:", error);
      throw error;
    }
  }

  async testSlackConnection() {
    if (!this.slackWebhookUrl) {
      throw new Error("Slack webhook URL not configured");
    }

    const testMessage = {
      text: "🧪 ReachInbox test message - Slack integration working!",
    };

    await axios.post(this.slackWebhookUrl, testMessage, {
      timeout: this.webhookTimeout,
    });
    return true;
  }

  async testWebhookConnection() {
    if (!this.webhookUrl) {
      throw new Error("Webhook URL not configured");
    }

    const testData = createTestWebhookPayload();

    await axios.post(this.webhookUrl, testData, {
      timeout: this.webhookTimeout,
    });
    return true;
  }

  // Legacy functions for backward compatibility
  async sendSlackNotificationLegacy(
    subject: string,
    from: string,
    account: string
  ) {
    if (!this.slackWebhookUrl) {
      console.log("⚠️ Slack webhook URL not configured");
      return;
    }

    try {
      const message = createSimpleSlackMessage(subject, from, account);
      await axios.post(this.slackWebhookUrl, message, {
        timeout: this.webhookTimeout,
      });
      console.log("✅ Slack notification sent");
    } catch (error) {
      console.error("❌ Failed to send Slack notification:", error);
    }
  }

  async triggerWebhookLegacy(emailData: any) {
    if (!this.webhookUrl) {
      console.log("⚠️ Webhook URL not configured");
      return;
    }

    try {
      await axios.post(this.webhookUrl, emailData, {
        timeout: this.webhookTimeout,
      });
      console.log("✅ Webhook triggered successfully");
    } catch (error) {
      console.error("❌ Failed to trigger webhook:", error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
