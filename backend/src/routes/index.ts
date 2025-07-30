import express, { Request, Response } from "express";
import { syncEmails } from "../services/imapService";
import { searchEmails } from "../services/emailSearchService";
import { ImapAccountConfig } from "../config/imapConfig";
import { elasticClient } from "../config/elasticClient";
import { classifyEmailHybrid } from "../services/classifierService";

const router = express.Router();

// Get available accounts
router.get("/accounts", async (req: Request, res: Response) => {
  try {
    const accounts = [
      { value: "", label: "All Accounts" },
      { value: process.env.IMAP_USER1!, label: process.env.IMAP_USER1! },
      { value: process.env.IMAP_USER2!, label: process.env.IMAP_USER2! },
    ].filter((account) => account.value || account.label === "All Accounts"); // Keep "All Accounts" even with empty value

    res.json({ accounts });
  } catch (err) {
    console.error("❌ Error fetching accounts:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// Get available folders
router.get("/folders", async (req: Request, res: Response) => {
  try {
    const result = await elasticClient.search({
      index: "emails",
      size: 0,
      aggs: {
        folders: {
          terms: {
            field: "folder",
            size: 100,
          },
        },
      },
    });

    const folders = (result.aggregations?.folders as any)?.buckets || [];

    // Helper to make folder label more readable
    function formatFolderLabel(folder: string): string {
      if (!folder || folder === "") return "All Folders";
      // Remove [Gmail]/, replace underscores, capitalize first letter of each word
      let label = folder;
      if (label.startsWith("[Gmail]/")) {
        label = label.replace("[Gmail]/", "");
        // Special case for Gmail system folders
        if (label.toLowerCase() === "all mail") return "All Mail";
        if (label.toLowerCase() === "sent mail") return "Sent Mail";
        if (label.toLowerCase() === "important") return "Important";
        if (label.toLowerCase() === "spam") return "Spam";
        if (label.toLowerCase() === "starred") return "Starred";
        if (label.toLowerCase() === "drafts") return "Drafts";
        if (label.toLowerCase() === "trash") return "Trash";
      }
      if (label.toUpperCase() === "INBOX") return "Inbox";
      // Replace underscores or dashes with spaces, capitalize
      label = label.replace(/[_-]/g, " ");
      label = label.replace(/\b\w/g, (c) => c.toUpperCase());
      return label;
    }

    const folderOptions = [
      { value: "", label: "All Folders" },
      ...folders.map((bucket: any) => ({
        value: bucket.key,
        label: formatFolderLabel(bucket.key),
      })),
    ];

    res.json({ folders: folderOptions });
  } catch (err) {
    console.error("❌ Error fetching folders:", err);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

router.post("/sync", async (req: Request, res: Response) => {
  const { accounts } = req.body;
  try {
    await syncEmails(accounts as ImapAccountConfig[]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Sync failed:", err);
    res.status(500).json({ error: "Failed to sync emails" });
  }
});

router.get("/emails", async (req: Request, res: Response) => {
  try {
    const {
      query,
      folder,
      account,
      category,
      page = 1,
      size = 100,
    } = req.query;

    console.log("🔍 Search params:", {
      query,
      folder,
      account,
      category,
      page,
      size,
    });

    const { hits, total } = await searchEmails({
      query: query as string,
      folder: folder as string,
      account: account as string,
      category: category as string,
      page: Number(page),
      size: Number(size),
    });

    console.log(
      `📧 Found ${hits.length} emails out of ${
        typeof total === "object" ? total.value : total
      } total`
    );
    res.json({ hits, total });
  } catch (err) {
    console.error("❌ Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, folder, account } = req.query;
    console.log("Search query:", { query, folder, account });
    const { hits, total } = await searchEmails({
      query: query as string,
      folder: folder as string,
      account: account as string,
    });
    console.log("Search results:", hits);
    res.json({ hits, total });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// Debug endpoint to check all emails in database
router.get("/debug/emails", async (req: Request, res: Response) => {
  try {
    const result = await elasticClient.search({
      index: "emails",
      size: 50,
      query: { match_all: {} },
    });

    const emails = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      account: hit._source.account,
      subject: hit._source.subject,
      from: hit._source.from,
      folder: hit._source.folder,
      date: hit._source.date,
    }));

    console.log(`📊 Debug: Found ${emails.length} emails in database`);

    // Group emails by account and folder
    const accountStats = emails.reduce((acc: any, email: any) => {
      acc[email.account] = (acc[email.account] || 0) + 1;
      return acc;
    }, {});

    const folderStats = emails.reduce((acc: any, email: any) => {
      acc[email.folder] = (acc[email.folder] || 0) + 1;
      return acc;
    }, {});

    console.log("📈 Account distribution:", accountStats);
    console.log("📁 Folder distribution:", folderStats);

    emails.forEach((email: any) => {
      console.log(`   • ${email.account} | ${email.subject} | ${email.folder}`);
    });

    res.json({
      total: result.hits.total,
      emails,
    });
  } catch (err) {
    console.error("❌ Debug error:", err);
    res.status(500).json({ error: "Debug failed" });
  }
});

// Manual email classification endpoint
router.post('/classify-email', async (req: Request, res: Response) => {
  const { subject, body } = req.body;
  
  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required' });
  }
  
  try {
    const category = await classifyEmailHybrid(subject, body);
    res.json({ category });
  } catch (err) {
    console.error('Classification Error:', err);
    res.status(500).json({ error: 'Classification failed' });
  }
});

export default router;
