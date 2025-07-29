const { createImapClient } = require("./dist/config/imapConfig");
const { syncEmails } = require("./dist/services/imapService");

// Test configuration
const testAccounts = [
  {
    host: process.env.IMAP_HOST1 || "imap.gmail.com",
    port: Number(process.env.IMAP_PORT1) || 993,
    user: process.env.IMAP_USER1,
    password: process.env.IMAP_PASSWORD1,
  },
];

async function testImapConnection() {
  console.log("🧪 Testing IMAP connection...");

  try {
    await syncEmails(testAccounts);
    console.log("✅ IMAP connection test successful");
  } catch (error) {
    console.error("❌ IMAP connection test failed:", error.message);
  }
}

// Run the test
testImapConnection();
