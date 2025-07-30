# Email Sync Backend

This backend service implements real-time email synchronization using IMAP connections with IDLE mode.

## Features

- ✅ Multiple IMAP account support
- ✅ Real-time email monitoring (IDLE mode with polling fallback)
- ✅ Persistent IMAP connections (no cron jobs!)
- ✅ 30-day email history sync
- ✅ Email parsing and processing
- ✅ Folder filtering (skips trash, spam, drafts)
- ✅ Error handling and logging
- ✅ Automatic reconnection handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp env.example .env
```

3. Configure your IMAP accounts in `.env`:
```env
IMAP_HOST1=imap.gmail.com
IMAP_PORT1=993
IMAP_USER1=your-email@gmail.com
IMAP_PASSWORD1=your-app-password

IMAP_HOST2=imap.outlook.com
IMAP_PORT2=993
IMAP_USER2=your-second-email@outlook.com
IMAP_PASSWORD2=your-second-app-password
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Troubleshooting

### Elasticsearch Index Mapping Issues

If you encounter the error `mapper [vector] cannot be changed from type [float] to [long]`, this means the Elasticsearch index was created with an incorrect mapping. To fix this:

```bash
npm run fix-index
```

This will delete and recreate the index with the correct mapping for the `vector` field as a `dense_vector` type.

## Scripts

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run index-replies` - Index reply knowledge base
- `npm run seed-rag` - Seed RAG context
- `npm run fix-index` - Fix Elasticsearch index mapping issues

## API Endpoints

### POST /api/sync
Manually trigger email synchronization.

Request body:
```json
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

## TODO Features

See [TODO.md](./TODO.md) for features that will be implemented later:
- Webhook integration
- Slack notifications
- AI embeddings
- Email classification
- Elasticsearch storage

## Notes

- For Gmail, you'll need to use an App Password instead of your regular password
- The service will automatically sync the last 30 days of emails on startup
- Real-time IDLE mode is active and will show emails immediately when they arrive
- If IDLE mode fails, the service falls back to polling every 30 seconds
- Email processing logs are output to console
- Persistent connections are maintained for real-time updates 