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