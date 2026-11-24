# OneBox Backend

A Node.js/TypeScript backend for the OneBox email aggregator with real-time IMAP synchronization, AI-powered categorization, and intelligent reply suggestions.

## 🚀 Features

- **Real-time IMAP Sync**: Persistent connections with IDLE mode
- **Elasticsearch Integration**: Searchable email storage with vector embeddings
- **AI Email Classification**: Hybrid classification system (AI + Vector + Keyword)
- **Slack & Webhook Notifications**: Real-time alerts for interested emails
- **RAG-based Reply Suggestions**: Intelligent reply generation using context
- **RESTful API**: Comprehensive endpoints for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Elasticsearch 8.4.0
- **Email**: IMAPFlow for IMAP connections
- **AI**: Google Gemini API
- **Deployment**: Render

## 📋 Prerequisites

- Node.js 18+ installed
- Docker (for local Elasticsearch)
- IMAP email accounts with app passwords
- Google Gemini API key
- Slack webhook URL (optional)
- Webhook.site URL (optional)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
```

Edit `.env` with your credentials:
```env
# IMAP Account 1
IMAP_HOST1=imap.gmail.com
IMAP_PORT1=993
IMAP_USER1=your-email@gmail.com
IMAP_PASSWORD1=your-app-password

# IMAP Account 2
IMAP_HOST2=imap.outlook.com
IMAP_PORT2=993
IMAP_USER2=your-second-email@outlook.com
IMAP_PASSWORD2=your-second-app-password

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Slack & Webhook Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
WEBHOOK_URL=https://webhook.site/your-unique-id
SLACK_CHANNEL=#email-notifications
WEBHOOK_TIMEOUT=5000
```

### 3. Start Elasticsearch
```bash
docker-compose up -d
```

### 4. Build and Start
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── elasticClient.ts # Elasticsearch client
│   │   ├── emailIndexMapping.ts # Email index schema
│   │   └── imapConfig.ts    # IMAP configuration
│   ├── data/                # Static data
│   │   └── reply_knowledge_base.json # RAG training data
│   ├── routes/              # API routes
│   │   └── index.ts         # Main router
│   ├── scripts/             # Utility scripts
│   │   ├── indexReplyKnowledge.ts # Index RAG data
│   │   └── seedContext.ts   # Seed RAG context
│   ├── services/            # Business logic
│   │   ├── aiService.ts     # AI classification
│   │   ├── classifierService.ts # Email classification
│   │   ├── elasticsearchService.ts # ES operations
│   │   ├── emailSearchService.ts # Email search
│   │   ├── imapService.ts   # IMAP sync
│   │   ├── notificationService.ts # Notifications
│   │   ├── ragService.ts    # RAG operations
│   │   └── replyKnowledgeService.ts # Reply knowledge
│   ├── utils/               # Utilities
│   │   ├── categories.ts    # Category definitions
│   │   ├── cosineSimilarity.ts # Vector similarity
│   │   ├── embedding.ts     # Text embeddings
│   │   ├── llm.ts          # LLM integration
│   │   ├── slackTemplates.ts # Slack message templates
│   │   └── webhookTemplates.ts # Webhook templates
│   └── server.ts            # Main server file
├── docker-compose.yml       # Elasticsearch setup
├── env.example             # Environment template
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health status

### Email Management
- `GET /api/emails` - Search and filter emails
  - Query params: `query`, `folder`, `account`, `category`, `page`, `size`, `sort`
- `GET /api/accounts` - Get available email accounts
- `GET /api/folders` - Get available folders
- `POST /api/sync` - Manual email synchronization
- `GET /api/search` - Search emails (legacy endpoint)

### AI Features
- `POST /api/classify-email` - Classify single email
  - Body: `{ subject: string, body: string }`
- `POST /api/suggest-reply` - Generate AI reply suggestions
  - Body: `{ emailText: string }`

### Notifications
- `POST /api/notify-slack` - Send Slack notification
  - Body: `{ message: string }`
- `POST /api/trigger-webhook` - Trigger webhook
  - Body: `{ url: string, data: any }`
- `POST /api/test-slack` - Test Slack connection
- `POST /api/test-webhook` - Test webhook connection

### Debug Endpoints
- `GET /api/debug/emails` - View all emails in database
- `GET /api/debug/env` - Check environment variables

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run index-replies # Index reply knowledge base
npm run seed-rag     # Seed RAG context
```

### Testing Notifications
```bash
node test-notifications.js
```

## 🧠 AI Features

### Email Classification
The system uses a hybrid classification approach:

1. **AI Classification**: Google Gemini API for primary classification
2. **Vector Classification**: Cosine similarity with category embeddings
3. **Keyword Classification**: Fallback keyword-based classification

Categories:
- **Interested**: Shows interest in proposals/services
- **Meeting Booked**: Scheduled meetings/appointments
- **Not Interested**: Declined offers
- **Spam**: Promotional content
- **Out of Office**: Automatic replies

### RAG-based Reply Suggestions
- Stores product/outreach context in vector database
- Uses semantic search to find relevant context
- Generates contextual replies using LLM

## 📊 Elasticsearch Schema

### Email Index (`emails`)
```json
{
  "subject": "text",
  "text": "text", 
  "html": "text",
  "date": "date",
  "from": "keyword",
  "to": "keyword",
  "folder": "keyword",
  "account": "keyword",
  "uid": "integer",
  "category": "keyword",
  "vector": "dense_vector(384)"
}
```

### Reply Knowledge Index (`reply_knowledge`)
```json
{
  "text": "text",
  "vector": "dense_vector(384)"
}
```

## 🔄 Real-time Sync

### IMAP IDLE Mode
- Persistent connections to IMAP servers
- Real-time email notifications
- Automatic reconnection on connection loss
- Fallback to polling if IDLE fails

### Sync Process
1. Connect to IMAP accounts
2. Fetch last 30 days of emails
3. Process and classify emails
4. Store in Elasticsearch with embeddings
5. Trigger notifications for interested emails
6. Maintain IDLE connections for real-time updates

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for production
- Input validation and sanitization
- Secure IMAP connections with SSL/TLS
- API key authentication for AI services

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Deploy Elasticsearch to cloud service (Bonsai/Elastic Cloud)

### Environment Variables for Production
```env
IMAP_HOST1=imap.gmail.com
IMAP_PORT1=993
IMAP_USER1=your-email@gmail.com
IMAP_PASSWORD1=your-app-password
IMAP_HOST2=imap.outlook.com
IMAP_PORT2=993
IMAP_USER2=your-second-email@outlook.com
IMAP_PASSWORD2=your-second-app-password
GEMINI_API_KEY=your-gemini-api-key
ELASTICSEARCH_URL=https://your-elasticsearch-url
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
WEBHOOK_URL=https://webhook.site/your-unique-id
```

## 🐛 Troubleshooting

### Common Issues

1. **IMAP Connection Failed**
   - Check app passwords (not regular passwords)
   - Verify IMAP settings in email provider
   - Enable "Less secure app access" if needed

2. **Elasticsearch Connection Failed**
   - Ensure Docker is running
   - Check if port 9200 is available
   - Verify Elasticsearch container is healthy

3. **AI Classification Not Working**
   - Verify Gemini API key is valid
   - Check API quota and billing
   - Ensure internet connectivity

4. **Notifications Not Sending**
   - Verify webhook URLs are correct
   - Check Slack webhook permissions
   - Test with debug endpoints

### Debug Commands
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# Test IMAP connection
node -e "require('./dist/config/imapConfig').createImapClient({...})"

# Test AI classification
curl -X POST http://localhost:3000/api/classify-email \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","body":"Test email"}'
```

## 📈 Performance Optimization

- **Caching**: Category embeddings cached in memory
- **Batch Processing**: Bulk operations for Elasticsearch
- **Connection Pooling**: Reuse IMAP connections
- **Vector Indexing**: Optimized similarity search
- **Debounced Updates**: Prevent excessive API calls

## 📝 License

This project is built for the ReachInbox Associate Backend Engineer assignment.

---

**Developer**: [Subhadip Saha](https://thatdevguy.in) 