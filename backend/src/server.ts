import express, { Request, Response } from "express";
import cors from "cors";
import { ImapAccountConfig } from "./config/imapConfig";
import { syncEmails } from "./services/imapService";
import { ensureEmailIndex } from "./services/elasticsearchService";
import { initRAG } from "./services/ragService";
import dotenv from "dotenv";
import router from "./routes/index";

dotenv.config();

const app = express();

// Configure CORS for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://onebox-mails.onrender.com", // Update this with your frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", router);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const IMAP_ACCOUNTS: ImapAccountConfig[] = [
  {
    host: process.env.IMAP_HOST1!,
    port: Number(process.env.IMAP_PORT1!),
    user: process.env.IMAP_USER1!,
    password: process.env.IMAP_PASSWORD1!,
  },
  {
    host: process.env.IMAP_HOST2!,
    port: Number(process.env.IMAP_PORT2!),
    user: process.env.IMAP_USER2!,
    password: process.env.IMAP_PASSWORD2!,
  },
];

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Ensure Elasticsearch index exists
  await ensureEmailIndex();

  // Initialize RAG system
  await initRAG();

  try {
    console.log("🔁 Starting initial email sync...");
    await syncEmails(IMAP_ACCOUNTS);
    console.log("✅ Initial email sync completed.");
  } catch (err) {
    console.error("❌ Error during initial sync:", err);
  }
});
