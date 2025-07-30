# OneBox Frontend

A modern React/TypeScript frontend for the OneBox email aggregator with real-time email management, search capabilities, and AI-powered features.

## 🚀 Features

- **Modern UI**: Clean, responsive design with dark/light themes
- **Real-time Email Sync**: Live updates from backend
- **Advanced Search**: Full-text search with filters
- **Email Categorization**: Visual indicators for AI categories
- **AI Reply Suggestions**: Intelligent reply generation
- **Responsive Design**: Works on desktop and mobile
- **TypeScript**: Full type safety and better development experience

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React hooks
- **HTTP Client**: Fetch API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Backend server running (see [Backend README](../backend/README.md))
- Modern web browser

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, use your deployed backend URL:
```env
VITE_API_BASE_URL=https://onebox-backend-mxen.onrender.com/api
```

### 3. Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   │   ├── badge.tsx   # Badge component
│   │   │   ├── button.tsx  # Button component
│   │   │   ├── card.tsx    # Card component
│   │   │   ├── input.tsx   # Input component
│   │   │   ├── select.tsx  # Select component
│   │   │   └── separator.tsx # Separator component
│   │   ├── EmailCard.tsx   # Email list item
│   │   ├── EmailList.tsx   # Email list container
│   │   ├── EmailPreview.tsx # Email preview panel
│   │   ├── EmailView.tsx   # Full email view
│   │   ├── FilterPanel.tsx # Search and filter panel
│   │   ├── ReplySuggestion.tsx # AI reply suggestions
│   │   └── SearchBar.tsx   # Search input component
│   ├── pages/              # Page components
│   │   └── EmailDashboard.tsx # Main dashboard page
│   ├── services/           # API services
│   │   └── emailService.ts # Email API integration
│   ├── utils/              # Utility functions
│   │   └── selectValidation.ts # Form validation
│   ├── lib/                # Library configurations
│   │   └── utils.ts        # Utility functions
│   ├── assets/             # Static assets
│   │   └── react.svg       # React logo
│   ├── App.tsx             # Main app component
│   ├── main.tsx           # App entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
├── public/                 # Public assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite configuration
└── components.json        # UI components config
```

## 🎨 UI Components

### Core Components

#### EmailCard
Displays individual email items in the list with:
- Subject, sender, and date
- Category badge with color coding
- Preview of email content
- Click handler for selection

#### EmailList
Container for email list with:
- Virtual scrolling for performance
- Loading and error states
- Empty state handling
- Responsive grid layout

#### EmailPreview
Side panel showing email details:
- Full email content
- Metadata (from, to, date, folder)
- Category information
- Reply suggestion button

#### EmailView
Full-screen email view with:
- Complete email rendering
- HTML content support
- Back navigation
- Reply functionality

#### FilterPanel
Advanced filtering and search:
- Account selection
- Folder filtering
- Category filtering
- Search input with debouncing

#### ReplySuggestion
AI-powered reply generation:
- Context-aware suggestions
- Copy to clipboard functionality
- Loading states
- Error handling

### UI Components

#### Button
Versatile button component with:
- Multiple variants (default, destructive, outline, secondary, ghost, link)
- Size options (default, sm, lg, icon)
- Disabled states
- Loading indicators

#### Card
Container component with:
- Header, content, and footer sections
- Flexible layout options
- Consistent spacing

#### Input
Form input component with:
- Type safety
- Placeholder support
- Disabled states
- Focus management

#### Select
Dropdown component with:
- Search functionality
- Multi-select support
- Keyboard navigation
- Custom styling

#### Badge
Status indicator with:
- Color variants
- Size options
- Custom content

## 🔌 API Integration

### Email Service (`emailService.ts`)

#### Types
```typescript
interface Email {
  subject: string;
  text: string;
  folder: string;
  account: string;
  date: string;
  from: string;
  to: string[];
  category: string;
  uid: string;
}

interface SearchParams {
  query?: string;
  folder?: string | null;
  account?: string | null;
  page?: number;
  size?: number;
  category?: string;
  sort?: "date" | "date_asc" | "date_desc";
}
```

#### Functions
- `fetchEmails(params)` - Search and filter emails
- `fetchAccounts()` - Get available email accounts
- `fetchFolders()` - Get available folders
- `suggestReply(emailText)` - Generate AI reply suggestions

### API Endpoints Used
- `GET /api/emails` - Email search and filtering
- `GET /api/accounts` - Available accounts
- `GET /api/folders` - Available folders
- `POST /api/suggest-reply` - AI reply suggestions

## 🎯 Features

### Email Management
- **Real-time Updates**: Automatic refresh of email list
- **Search & Filter**: Full-text search with multiple filters
- **Pagination**: Efficient loading of large email lists
- **Sorting**: Date-based sorting options

### AI Integration
- **Category Display**: Visual indicators for AI categories
- **Reply Suggestions**: Context-aware reply generation
- **Smart Filtering**: Filter by AI categories

### User Experience
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error recovery
- **Keyboard Navigation**: Full keyboard support

## 🎨 Styling

### Design System
- **Colors**: Consistent color palette with dark/light themes
- **Typography**: Clear hierarchy with proper spacing
- **Spacing**: Consistent spacing scale
- **Components**: Reusable component library

### CSS Classes
- **Utility-first**: Tailwind CSS for rapid development
- **Custom Components**: Styled components for complex UI
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Workflow
1. Start backend server (see Backend README)
2. Start frontend: `npm run dev`
3. Open browser to `http://localhost:5173`
4. Make changes and see live updates

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000/api  # Backend API URL
```

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically on push to main branch

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://onebox-backend-mxen.onrender.com/api
```

## 🧪 Testing

### Manual Testing
1. **Email Loading**: Verify emails load from backend
2. **Search Functionality**: Test search with various queries
3. **Filtering**: Test account, folder, and category filters
4. **Reply Suggestions**: Test AI reply generation
5. **Responsive Design**: Test on different screen sizes

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Verify backend server is running
   - Check `VITE_API_BASE_URL` environment variable
   - Ensure CORS is configured on backend

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Test with browser dev tools

### Debug Commands
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Build and check for errors
npm run build
```

## 📈 Performance

### Optimization Features
- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Prevents excessive API calls
- **Virtual Scrolling**: Efficient rendering of large lists
- **Caching**: Browser caching for static assets

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

- **Environment Variables**: Sensitive data in environment variables
- **Input Validation**: Client-side validation for user inputs
- **XSS Prevention**: Safe rendering of HTML content
- **CORS**: Proper CORS configuration with backend

## 📝 License

This project is built for the ReachInbox Associate Backend Engineer assignment.

---

**Developer**: [Subhadip Saha](https://subhadip.me) 