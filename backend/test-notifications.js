const { notificationService } = require("./dist/services/notificationService");

async function testNotifications() {
  console.log("🧪 Testing Notification Service...");

  // Test data
  const testEmailData = {
    subject: "Interested in your product",
    from: "prospect@example.com",
    to: ["sales@company.com"],
    date: new Date().toISOString(),
    category: "Interested",
    account: "test-account@gmail.com",
    uid: "12345",
    text: "Hi, I would like to learn more about your services. Can we schedule a call?",
  };

  try {
    // Test 1: Test Slack connection
    console.log("\n📱 Testing Slack connection...");
    await notificationService.testSlackConnection();
    console.log("✅ Slack connection test passed");

    // Test 2: Test webhook connection
    console.log("\n🔗 Testing webhook connection...");
    await notificationService.testWebhookConnection();
    console.log("✅ Webhook connection test passed");

    // Test 3: Test interested email notification
    console.log("\n🎯 Testing interested email notification...");
    await notificationService.notifyInterestedEmail(testEmailData);
    console.log("✅ Interested email notification test passed");

    // Test 4: Test manual Slack notification
    console.log("\n💬 Testing manual Slack notification...");
    await notificationService.sendSlackNotification(
      "🧪 Manual test message from ReachInbox!"
    );
    console.log("✅ Manual Slack notification test passed");

    console.log("\n🎉 All notification tests passed!");
  } catch (error) {
    console.error("❌ Notification test failed:", error.message);

    if (error.message.includes("Slack webhook URL not configured")) {
      console.log("💡 Make sure to set SLACK_WEBHOOK_URL in your .env file");
    }

    if (error.message.includes("Webhook URL not configured")) {
      console.log("💡 Make sure to set WEBHOOK_URL in your .env file");
    }
  }
}

// Run the test
testNotifications();
