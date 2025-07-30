export interface EmailData {
  subject: string;
  from: string;
  account: string;
  category: string;
  date: string;
  text: string;
  uid: string;
}

export function createSlackMessage(emailData: EmailData) {
  const timestamp = new Date(emailData.date).toLocaleString();

  return {
    text: `🎯 *Interested Email Detected!*`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📧 New Interested Email",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Subject:*\n${emailData.subject}`,
          },
          {
            type: "mrkdwn",
            text: `*From:*\n${emailData.from}`,
          },
          {
            type: "mrkdwn",
            text: `*Account:*\n${emailData.account}`,
          },
          {
            type: "mrkdwn",
            text: `*Date:*\n${timestamp}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Preview:*\n${emailData.text.substring(0, 200)}...`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Details",
            },
            url: `http://localhost:5173/email/${emailData.account}_${emailData.uid}`,
          },
        ],
      },
    ],
  };
}

export function createSimpleSlackMessage(
  subject: string,
  from: string,
  account: string
) {
  return {
    text: `📩 *Interested Email Detected!*\n*Subject:* ${subject}\n*From:* ${from}\n*Account:* ${account}`,
  };
}
