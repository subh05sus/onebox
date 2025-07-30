import express, { Request, Response } from "express";
import { syncEmails } from "../services/imapService";
import { searchEmails } from "../services/emailSearchService";
import { ImapAccountConfig } from "../config/imapConfig";

const router = express.Router();

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
    const { hits, total } = await searchEmails({
      query: query as string,
      folder: folder as string,
      account: account as string,
      category: category as string,
      page: Number(page),
      size: Number(size),
    });
    res.json({ hits, total });
  } catch (err) {
    console.error("❌ Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, folder, account } = req.query;
    console.log("Search query:", folder);
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

export default router;
