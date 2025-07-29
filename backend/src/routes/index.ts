import express, { Request, Response } from 'express';
import { syncEmails } from '../services/imapService';
import { ImapAccountConfig } from '../config/imapConfig';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const { accounts } = req.body;
  try {
    await syncEmails(accounts as ImapAccountConfig[]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ error: 'Failed to sync emails' });
  }
});

export default router; 