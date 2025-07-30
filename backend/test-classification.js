const { classifyEmailHybrid } = require("./dist/services/classifierService");

async function testClassification() {
  console.log("🧪 Testing AI Email Classification...");

  const testEmails = [
    {
      subject: "Interested in your product",
      body: "Hi, I would like to learn more about your services. Can we schedule a call?"
    },
    {
      subject: "Meeting confirmed",
      body: "Great! I've confirmed our meeting for tomorrow at 2 PM. Looking forward to it."
    },
    {
      subject: "Not interested",
      body: "Thank you for reaching out, but we're not interested at this time."
    },
    {
      subject: "Out of office",
      body: "I'm currently out of the office and will return on Monday."
    },
    {
      subject: "Buy now! Limited time offer!",
      body: "Click here to get your free iPhone! Don't miss this amazing opportunity!"
    }
  ];

  for (const email of testEmails) {
    try {
      const category = await classifyEmailHybrid(email.subject, email.body);
      console.log(`📧 "${email.subject}" → ${category}`);
    } catch (error) {
      console.error(`❌ Error classifying "${email.subject}":`, error.message);
    }
  }
}

// Run the test
testClassification(); 