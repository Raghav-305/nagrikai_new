# Frontend Setup Guide

## Quick Start

### 1. Prerequisites

Ensure you have:
- **Node.js** 16 or higher (download from nodejs.org)
- **npm** (comes with Node.js)
- **Backend server** running on port 5000

### 2. Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the `/frontend` directory:

```bash
cp .env.example .env
```

Edit `.env` to match your setup:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Nagrik AI
VITE_MARKDOWN_DOCS_PATH=/docs
```

### 4. Documentation Files

The frontend automatically loads markdown files from `/docs`. To enable documentation:

1. Create a `/docs` folder in the project root (if it doesn't exist)
2. Add `.md` files:
   - `README.md`
   - `GETTING_STARTED.md`
   - `API_GUIDE.md`
   - `USER_MANUAL.md`

Example structure:
```
/docs
  ├── README.md
  ├── GETTING_STARTED.md
  ├── API_GUIDE.md
  └── USER_MANUAL.md
```

### 5. Running the Frontend

Start the development server:

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Hot Module Replacement (HMR)

Changes to TypeScript/React files are instantly reflected in the browser without page refresh.

### Debugging

1. Open browser DevTools (F12)
2. Check the Console tab for errors
3. Use the Network tab to inspect API calls
4. Use React DevTools extension for component debugging

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── ApiDataTable.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Alert.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Footer.tsx
│   │
│   ├── pages/               # Page-level components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ComplaintsPage.tsx
│   │   ├── CreateComplaintPage.tsx
│   │   ├── DocsPage.tsx
│   │   └── DashboardPage.tsx
│   │
│   ├── services/            # External service integrations
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useComplaints.ts
│   │   ├── useDepartments.ts
│   │   └── useDocumentation.ts
│   │
│   ├── context/             # React Context (Auth, Theme, etc.)
│   │   └── AuthContext.tsx
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/               # Helper functions
│   │   ├── apiClient.ts     # API service client
│   │   ├── constants.ts     # App constants
│   │   ├── helpers.ts       # Utility functions
│   │   ├── markdown.ts      # Markdown utilities
│   │   └── theme.ts         # Theme management
│   │
│   ├── styles/              # Global styles
│   │   └── global.css
│   │
│   ├── App.tsx              # Root component with routing
│   └── main.tsx             # Entry point
│
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # TailwindCSS configuration
├── .env.example             # Environment variables template
├── .env                     # Environment variables (not committed)
└── README.md                # This file
```

## API Integration

The frontend communicates with the backend through the `apiClient`:

### Authentication Endpoints

```typescript
// Register
await apiClient.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'citizen'
});

// Login
await apiClient.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
await apiClient.getCurrentUser();

// Logout
await apiClient.logout();
```

### Complaint Endpoints

```typescript
// Create complaint
await apiClient.createComplaint({
  title: 'Pothole on Main Street',
  description: 'Large pothole affecting traffic...',
  category: 'Infrastructure',
  department: '<department_id>'
});

// Get complaints
await apiClient.getComplaints({
  status: 'open',
  priority: 'high',
  page: 1,
  limit: 10
});

// Get complaint detail
await apiClient.getComplaintById('<complaint_id>');

// Update complaint
await apiClient.updateComplaint('<complaint_id>', {
  status: 'in-progress',
  priority: 'high'
});

// Delete complaint
await apiClient.deleteComplaint('<complaint_id>');
```

### Department Endpoints

```typescript
// Get all departments
await apiClient.getDepartments();

// Get department details
await apiClient.getDepartmentById('<department_id>');
```

### Admin Endpoints

```typescript
// Get admin dashboard data
await apiClient.getAdminDashboard();

// Get statistics
await apiClient.getAdminStats();
```

## Features Overview

### 🔐 Authentication

- Login/Register with JWT tokens
- Automatic token injection in all API requests
- Auto-logout on 401 Unauthorized
- Role-based access (citizen, department, admin)

### 📱 Responsive Design

- Mobile-first approach
- Works on screens from 320px to 4K
- Touch-friendly navigation
- Adaptive layouts

### 🌙 Dark Mode

- Auto-detect system preference
- Manual toggle in navbar
- Persistent preference storage
- Smooth transitions

### 📚 Documentation

- Auto-loads markdown files from `/docs`
- Syntax highlighting for code blocks
- Table of contents for navigation
- Responsive sidebar layout

### 📊 Complaint Management

- Create new complaints
- Filter by status/priority
- View complaint details
- Update complaint status
- Track AI detection results

### 🎨 UI Components

- Pre-built, reusable components
- Consistent styling with TailwindCSS
- Accessible form inputs
- Loading states and error handling
- Toast notifications

## Troubleshooting

### Issue: Port 3000 is already in use

**Solution**: Change the port in `vite.config.ts`:
```typescript
server: {
  port: 3001,
}
```

### Issue: Cannot connect to backend

**Solution**: Ensure:
1. Backend is running on port 5000
2. `VITE_API_BASE_URL` in `.env` is correct
3. CORS is enabled on the backend

### Issue: CSS not loading properly

**Solution**: 
1. Clear browser cache
2. Rebuild: `npm run build`
3. Check that TailwindCSS is installed: `npm install`

### Issue: Dark mode not working

**Solution**: Ensure `dark` class is on the `<html>` element

### Issue: Markdown files not loading

**Solution**:
1. Ensure `.md` files are in the `/docs` folder (root level)
2. Files should be readable from the project root
3. Rebuild if using production build

## Performance Tips

### Development
- Use `npm run dev` for fast HMR
- Browser DevTools can impact performance
- Close unused browser tabs

### Production
- Use `npm run build` to create optimized bundle
- All assets are minified and compressed
- Tree-shaking removes unused code
- Images are optimized

### Optimization
- Code splitting for lazy loading
- Efficient API calls with caching
- Minimal re-renders with React hooks
- Optimized images and assets

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | Latest  |
| Firefox | Latest  |
| Safari  | Latest  |
| Edge    | Latest  |

## Useful Links

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **TailwindCSS**: https://tailwindcss.com/
- **MDN Web Docs**: https://developer.mozilla.org/

## Getting Help

1. Check the [README.md](./README.md) for feature details
2. Review component documentation in `src/components/`
3. Check API integration in `src/utils/apiClient.ts`
4. Inspect browser console for error messages
5. Check the backend logs for API issues

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env` file with backend URL
3. ✅ Create `/docs` folder with markdown files
4. ✅ Start backend on port 5000
5. ✅ Run `npm run dev`
6. ✅ Navigate to http://localhost:3000

## Support

For more information, see:
- [Frontend README](./README.md)
- [Backend API Docs](../server/docs/api.md)
- [Project Setup Guide](../SETUP_GUIDE.md)
