# Email Dashboard Frontend

A modern React TypeScript application built with Vite and shadcn/ui components for email management and search.

## Features

- **Modern UI**: Built with shadcn/ui components for a consistent and beautiful design
- **Email Search**: Full-text search across email subjects, content, and metadata
- **Advanced Filtering**: Filter by folder, account, and category
- **Email View**: Detailed view of individual emails with metadata
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Automatic loading and error handling

## Components

### Core Components
- `EmailDashboard`: Main dashboard page with search and filtering
- `EmailCard`: Individual email card with preview
- `EmailView`: Detailed email view with full content
- `SearchBar`: Search input with real-time filtering
- `FilterPanel`: Advanced filtering controls
- `EmailList`: Alternative list view for emails

### UI Components (shadcn/ui)
- `Button`: Interactive buttons with variants
- `Card`: Content containers with headers and sections
- `Input`: Form input fields
- `Select`: Dropdown selection components
- `Badge`: Status and category indicators
- `Separator`: Visual dividers

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── EmailCard.tsx
│   ├── EmailList.tsx
│   ├── EmailView.tsx
│   ├── FilterPanel.tsx
│   └── SearchBar.tsx
├── pages/
│   └── EmailDashboard.tsx
├── services/
│   └── emailService.ts
└── App.tsx
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`:

- `GET /api/emails` - Search and filter emails
- `GET /api/accounts` - Get available email accounts
- `GET /api/folders` - Get available email folders

## Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons
- **Custom CSS**: Additional utilities and animations

## Development

The project uses:
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting and formatting
- **React 19**: Latest React features

## Features

### Search and Filter
- Real-time search across email content
- Filter by email folder
- Filter by email account
- Filter by email category (Interested, Spam, etc.)

### Email Display
- Card-based email preview
- Category badges with color coding
- Metadata display (sender, date, folder, account)
- Full email view with complete content

### User Experience
- Loading states and error handling
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Pagination for large result sets
