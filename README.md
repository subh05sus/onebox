# OneBox - AI-Powered Email Aggregator

A feature-rich email aggregator with real-time synchronization, AI-powered categorization, and intelligent reply suggestions. Built for the ReachInbox Associate Backend Engineer assignment.

## 🌐 Live Demo

- **Frontend**: [https://onebox-mails.vercel.app/](https://onebox-mails.vercel.app/)
- **Backend API**: [https://onebox-backend-mxen.onrender.com/](https://onebox-backend-mxen.onrender.com/) (may take a moment to start after inactivity)

## 🚀 Features Implemented

### ✅ Core Features
- **Real-Time Email Synchronization**: Syncs multiple IMAP accounts using persistent IDLE connections
- **Elasticsearch Storage**: Searchable email storage with advanced filtering
- **AI Email Categorization**: Automatically categorizes emails into 5 categories
- **Slack & Webhook Integration**: Real-time notifications for interested emails
- **Modern Frontend Interface**: React-based UI with search and filtering
- **AI-Powered Reply Suggestions**: RAG-based intelligent reply generation

### 🎯 Email Categories
- **Interested**: Emails showing interest in proposals/services
- **Meeting Booked**: Scheduled meetings and appointments
- **Not Interested**: Declined offers and rejections
- **Spam**: Promotional and irrelevant content
- **Out of Office**: Automatic replies and availability notices

### 🔧 Technical Stack
- **Backend**: Node.js, TypeScript, Express
- **Frontend**: React, TypeScript, Vite
- **Database**: Elasticsearch (Docker)
- **AI**: Google Gemini API for classification and reply generation
- **Email**: IMAPFlow for real-time email sync
- **Deployment**: Render (Backend), Vercel (Frontend)

## 📋 Assignment Requirements Status

| Requirement | Status | Details |
|-------------|--------|---------|
| Real-Time IMAP Sync | ✅ Complete | 2 accounts, IDLE mode, 30+ days |
| Elasticsearch Storage | ✅ Complete | Searchable, filterable, indexed |
| AI Categorization | ✅ Complete | 5 categories, hybrid classification |
| Slack/Webhook | ✅ Complete | Real-time notifications |
| Frontend Interface | ✅ Complete | Modern UI with search/filter |
| AI Reply Suggestions | ✅ Complete | RAG-based intelligent replies |

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+
- Docker (for Elasticsearch)
- IMAP email accounts
- Google Gemini API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd onebox
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure your .env file with IMAP and API credentials
npm run build
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Elasticsearch (Docker)
```bash
cd backend
docker-compose up -d
```

## 📁 Project Structure

```
onebox/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   └── docker-compose.yml  # Elasticsearch setup
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── public/             # Static assets
└── README.md              # This file
```

## 🔌 API Endpoints

### Email Management
- `GET /api/emails` - Search and filter emails
- `GET /api/accounts` - Get available email accounts
- `GET /api/folders` - Get available folders
- `POST /api/sync` - Manual email sync

### AI Features
- `POST /api/classify-email` - Classify single email
- `POST /api/suggest-reply` - Generate AI reply suggestions

### Notifications
- `POST /api/notify-slack` - Send Slack notification
- `POST /api/trigger-webhook` - Trigger webhook
- `POST /api/test-slack` - Test Slack connection
- `POST /api/test-webhook` - Test webhook connection

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test-notifications
```

### Manual Testing
1. Configure IMAP accounts in `.env`
2. Start Elasticsearch: `docker-compose up -d`
3. Start backend: `npm start`
4. Start frontend: `npm run dev`
5. Test email sync and categorization

## 🚀 Deployment

### Backend (Render)
- Automatic deployment from GitHub
- Environment variables configured in Render dashboard
- Elasticsearch cloud service (Bonsai/Elastic Cloud)

### Frontend (Vercel)
- Automatic deployment from GitHub
- Environment variables for API endpoints
- Optimized for performance

## 📊 Performance Features

- **Real-time Sync**: Persistent IMAP connections with IDLE mode
- **Efficient Search**: Elasticsearch with vector embeddings
- **Smart Caching**: Category embeddings cached for performance
- **Hybrid Classification**: AI + Vector + Keyword classification
- **Responsive UI**: Modern React components with TypeScript

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for production
- Input validation and sanitization
- Secure IMAP connections with SSL/TLS

## 📝 License

This project is built for the ReachInbox Associate Backend Engineer assignment.

## 👨‍💻 Developer

**Subhadip Saha**
- **Portfolio**: [https://thatdevguy.in](https://thatdevguy.in)
- **GitHub**: [@subh05sus](https://github.com/subh05sus)
- **LinkedIn**: [Subhadip Saha](https://linkedin.com/in/subhadipsahaofficial)

---

## 📚 Detailed Documentation

- [Backend Documentation](./backend/README.md) - Detailed backend setup and API docs
- [Frontend Documentation](./frontend/README.md) - Frontend components and features

## 🎯 Assignment Completion

This project successfully implements all requirements from the ReachInbox assignment:

1. ✅ **Real-Time Email Synchronization** - Multiple IMAP accounts with IDLE mode
2. ✅ **Searchable Storage** - Elasticsearch with advanced indexing
3. ✅ **AI-Based Categorization** - 5-category classification system
4. ✅ **Slack & Webhook Integration** - Real-time notifications
5. ✅ **Frontend Interface** - Modern React-based UI
6. ✅ **AI-Powered Reply Suggestions** - RAG-based intelligent replies

The implementation demonstrates end-to-end development capabilities with production-ready features and deployment. 