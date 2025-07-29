# Feature 1: Real-Time Email Synchronization

## Overview
Implement persistent IMAP connections with IDLE mode to sync multiple email accounts in real-time, fetching the last 30 days of emails.

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install imapflow mailparser dotenv
npm install -D @types/node
```

### Step 2: Create IMAP Configuration
```typescript
// src/config/imapConfig.ts
import { ImapFlow } from 'imapflow';

export interface ImapAccountConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export async function createImapClient(config: ImapAccountConfig): Promise<ImapFlow> {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: { user: config.user, pass: config.password }
  });
  await client.connect();
  return client;
}
```

### Step 3: Implement Email Sync Service
```typescript
// src/services/imapService.ts
import { simpleParser, ParsedMail, AddressObject } from 'mailparser';
import { createImapClient, ImapAccountConfig } from '../config/imapConfig';
import { saveEmailToElasticsearch } from './elasticsearchService';
import { getEmbedding } from '../utils/embedding';
import { classifyWithElasticsearch } from './classifierService';
import { sendSlackNotification } from '../utils/slackNotifier';
import { triggerWebhook } from '../utils/webhookTrigger';

function extractAddresses(input?: AddressObject | AddressObject[]): string[] {
  if (!input) return [];
  const groups = Array.isArray(input) ? input : [input];
  return groups.flatMap((group) =>
    (group.value ?? []).map((addr) => addr.address || '')
  );
}

function shouldSkipFolder(folder: string): boolean {
  const lower = folder.toLowerCase();
  return (
    lower.includes('trash') ||
    lower.includes('spam') ||
    lower.includes('draft') ||
    lower.includes('junk')
  );
}

export async function syncEmails(accounts: ImapAccountConfig[]) {
  const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 

  for (const account of accounts) {
    const client = await createImapClient(account);
    const boxes = await client.list();

    console.log(`📦 All folders for ${account.user}:`);
    boxes.forEach((box) => console.log(`   • ${box.path}`));

    for (const box of boxes) {
      const mailbox = box.path;

      if (box.flags?.has('\\Noselect') || shouldSkipFolder(mailbox)) {
        console.log(`⚠️ Skipping folder: ${mailbox}`);
        continue;
      }

      console.log(`📁 Syncing mailbox: ${mailbox} for ${account.user}`);

      try {
        await client.mailboxOpen(mailbox);
      } catch (err) {
        console.error(`❌ Error opening ${mailbox} for ${account.user}:`, err);
        continue;
      }

      const uids = await client.search({ since: sinceDate });
      let highestUid = 0;

      for await (const msg of client.fetch(uids, { envelope: true, source: true })) {
        await processAndStoreEmail(msg, account.user, mailbox);
        highestUid = Math.max(highestUid, msg.uid!);
      }

      console.log(`✅ Synced ${uids.length} emails from ${mailbox} for ${account.user}`);

      // Real-time IDLE mode for new emails
      client.on('mail', async () => {
        console.log(`📬 New mail event in ${mailbox} for ${account.user}`);
        const newRange = `${highestUid + 1}:*`;

        for await (const msg of client.fetch(newRange, { envelope: true, source: true })) {
          await processAndStoreEmail(msg, account.user, mailbox);
          highestUid = Math.max(highestUid, msg.uid!);
          console.log(`   • Indexed new UID ${msg.uid} from ${mailbox}`);
        }
      });
    }

    console.log(`⏳ Listening for new emails across all folders on ${account.user}...`);
  }
}

async function processAndStoreEmail(msg: any, accountUser: string, mailbox: string) {
  const parsed: ParsedMail = await simpleParser(msg.source!);
  const fromAddrs = extractAddresses(parsed.from);
  const toAddrs = extractAddresses(parsed.to);
  const htmlBody = typeof parsed.html === 'string' ? parsed.html : '';
  const subject = parsed.subject ?? msg.envelope.subject ?? '';
  const textBody = parsed.text ?? htmlBody;

  let embedding: number[] = [];
  let category = '';
  try {
    const emailContent = `${subject}\n\n${textBody}`;
    embedding = await getEmbedding(emailContent);
    category = await classifyWithElasticsearch(embedding);
    console.log(`🧠 [${accountUser} | ${mailbox}] RAG Classified as: ${category}`);
  } catch (err) {
    console.error(`⚠️ [${accountUser} | ${mailbox}] Classification error:`, err);
  }

  const doc = {
    subject,
    text: parsed.text ?? '',
    html: htmlBody,
    date: msg.envelope.date!,
    from: fromAddrs[0] ?? '',
    to: toAddrs,
    folder: mailbox,
    account: accountUser,
    uid: msg.uid!,
    category,
    vector: embedding,
  };

  if (category === 'Interested') {
    await sendSlackNotification(subject, fromAddrs[0] ?? '', accountUser);
    await triggerWebhook(doc);
  }

  await saveEmailToElasticsearch(doc);
}
```

### Step 4: Configure Server with IMAP Accounts
```typescript
// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { ImapAccountConfig } from './config/imapConfig';
import { syncEmails } from './services/imapService';
import dotenv from 'dotenv';
import router from './routes/index';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', router);

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

app.listen(3000, async () => {
  console.log('🚀 Server running on port 3000');
  try {
    console.log('🔁 Starting initial email sync...');
    await syncEmails(IMAP_ACCOUNTS);
    console.log('✅ Initial email sync completed.');
  } catch (err) {
    console.error('❌ Error during initial sync:', err);
  }
});
```

### Step 5: Environment Variables
```env
# .env
IMAP_HOST1=imap.gmail.com
IMAP_PORT1=993
IMAP_USER1=your-email@gmail.com
IMAP_PASSWORD1=your-app-password

IMAP_HOST2=imap.outlook.com
IMAP_PORT2=993
IMAP_USER2=your-second-email@outlook.com
IMAP_PASSWORD2=your-second-app-password
```

### Step 6: Add API Route for Manual Sync
```typescript
// src/routes/index.ts
import express, { Request, Response } from 'express';
import { syncEmails } from '../services/imapService';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const { accounts } = req.body;
  try {
    await syncEmails(accounts);
    res.sendStatus(200);
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ error: 'Failed to sync emails' });
  }
});

export default router;
```

### Step 7: Test the Implementation
```bash
# Start the server
npm run start

# Test with Postman
POST http://localhost:3000/api/sync
Content-Type: application/json

{
  "accounts": [
    {
      "host": "imap.gmail.com",
      "port": 993,
      "user": "your-email@gmail.com",
      "password": "your-app-password"
    }
  ]
}
```

## Key Features Implemented

✅ **Multiple IMAP Accounts**: Support for 2+ email accounts
✅ **Real-time Updates**: IDLE mode for instant email notifications
✅ **30-Day History**: Fetches last 30 days of emails
✅ **Persistent Connections**: Maintains connections for real-time updates
✅ **Error Handling**: Robust error handling for connection issues
✅ **Folder Filtering**: Skips system folders (trash, spam, drafts)
✅ **Email Processing**: Parses and stores emails with metadata

## Production Considerations

1. **Connection Pooling**: Implement connection pooling for multiple accounts
2. **Retry Logic**: Add exponential backoff for failed connections
3. **Monitoring**: Add health checks for IMAP connections
4. **Security**: Use OAuth2 for Gmail instead of app passwords
5. **Rate Limiting**: Implement rate limiting to avoid IMAP server limits 