# Full Frontend Integration Guide

## Overview

This comprehensive guide explains how the new frontend integrates with your Nagrik AI backend and documentation system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Home, Login, Complaints, Docs, Dashboard     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components: Navbar, Sidebar, Tables, Alerts          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Hooks: useAuth, useComplaints, useDocumentation    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Utils: API Client, Theme, Markdown Parser           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                    (HTTP/REST + JWT Auth)
                                      │
                    ┌─────────────────▼──────────────┐
                    │   Backend (Node.js Express)    │
                    │  ┌─────────────────────────┐   │
                    │  │ Auth Routes & JWT       │   │
                    │  └─────────────────────────┘   │
                    │  ┌─────────────────────────┐   │
                    │  │ Complaint Routes        │   │
                    │  └─────────────────────────┘   │
                    │  ┌─────────────────────────┐   │
                    │  │ Department Routes       │   │
                    │  └─────────────────────────┘   │
                    │  ┌─────────────────────────┐   │
                    │  │ Admin Routes            │   │
                    │  └─────────────────────────┘   │
                    └─────────────────┬──────────────┘
                                      │
                    ┌─────────────────▼──────────────┐
                    │   MongoDB Database             │
                    └────────────────────────────────┘

                    ┌──────────────────────────────┐
                    │  Markdown Docs (/docs/*.md)  │
                    │  Loaded automatically by UI  │
                    └──────────────────────────────┘
```

## Backend Integration

### Expected Backend Endpoints

The frontend expects these endpoints on `http://localhost:5000/api`:

#### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login and get JWT
GET    /auth/me                # Get current user profile
```

#### Complaints
```
POST   /complaints             # Create complaint
GET    /complaints             # List complaints (with filters)
GET    /complaints/:id         # Get complaint details
PUT    /complaints/:id         # Update complaint
DELETE /complaints/:id         # Delete complaint
```

#### Departments
```
GET    /departments            # List all departments
GET    /departments/:id        # Get department details
```

#### Admin
```
GET    /admin/dashboard        # Dashboard data
GET    /admin/stats            # Statistics
```

### Expected Response Format

All endpoints should return JSON in this format:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Success message (optional)"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Frontend Structure

### 1. Pages (User Views)

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page with features |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Complaints | `/complaints` | View and manage complaints |
| Create Complaint | `/create-complaint` | Submit new complaint |
| Docs | `/docs`, `/docs/:docName` | View documentation |
| Dashboard | `/dashboard` | Admin statistics |

### 2. Components (Reusable UI)

| Component | Purpose |
|-----------|---------|
| `Navbar` | Top navigation with theme toggle |
| `Sidebar` | Side navigation with doc links |
| `MarkdownRenderer` | Renders markdown with syntax highlighting |
| `ApiDataTable` | Displays complaint/data tables |
| `StatusBadge` | Status/priority indicators |
| `Alert` | Toast notifications |
| `LoadingSpinner` | Loading states |
| `Footer` | Footer with info |

### 3. Hooks (Data Management)

| Hook | Purpose |
|------|---------|
| `useAuth()` | User authentication state |
| `useComplaints()` | Complaint CRUD operations |
| `useDepartments()` | Department data fetching |
| `useDocumentation()` | Markdown docs loading |

### 4. Services (API Layer)

| Service | Purpose |
|---------|---------|
| `apiClient` | HTTP client with JWT auth |
| Constants | API endpoints and predefined values |

### 5. Utilities (Helpers)

| Utility | Purpose |
|---------|---------|
| `theme.ts` | Dark/light mode management |
| `helpers.ts` | String formatting, validation |
| `markdown.ts` | Markdown parsing and extraction |

## Documentation Integration

### How Docs Are Loaded

1. **Automatic Detection**: On app startup, the frontend scans for `.md` files in `/docs/`
2. **Parsing**: Each file is parsed to extract headings and structure
3. **Display**: Files appear in the sidebar and can be viewed in the Docs page
4. **Rendering**: Markdown is converted to HTML with syntax highlighting

### Adding Documentation

1. Create markdown files in `/docs/`:
   ```
   /docs/
     ├── README.md              # Overview
     ├── GETTING_STARTED.md     # Setup guide
     ├── API_GUIDE.md           # API documentation
     ├── TROUBLESHOOTING.md     # FAQ and troubleshooting
     └── USER_MANUAL.md         # User guide
   ```

2. Files appear automatically in:
   - Sidebar navigation
   - Docs page
   - Table of contents for that doc

### Markdown Features Supported

```markdown
# Headings (h1-h6)
**Bold** and *italic*
[Links](https://example.com)
`Inline code`

    Code blocks with language
    ```javascript
    const example = "code";
    ```

> Blockquotes

| Tables | Are | Supported |
|--------|-----|-----------|

- Bullet lists
1. Numbered lists

![Images](image.png)
```

## Authentication Flow

### Login Flow

```
User → Login Page → Submit credentials
  ↓
API Client → POST /auth/login → Backend
  ↓
Backend validates → Returns { token, user }
  ↓
Frontend stores token in localStorage
  ↓
All subsequent API calls include: Authorization: Bearer <token>
```

### Protected Routes

Routes requiring authentication:
- `/complaints` - View complaints
- `/create-complaint` - Create complaint
- `/dashboard` - Admin dashboard

Unauthenticated users are redirected to `/login`

## API Integration Example

### Creating a Complaint

```typescript
import { useComplaints } from '@hooks/useComplaints';

export function MyComponent() {
  const { createComplaint } = useComplaints();

  const handleCreate = async () => {
    try {
      const complaint = await createComplaint({
        title: 'Pothole',
        description: 'Large pothole on Main St',
        category: 'Infrastructure',
        department: 'dept-id-123',
        status: 'open',
        priority: 'high'
      });
      console.log('Created:', complaint);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

## Environment Configuration

### `.env` File

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# App Display Name
VITE_APP_NAME=Nagrik AI

# Docs Folder Path
VITE_MARKDOWN_DOCS_PATH=/docs
```

### Configuration for Different Environments

**Development** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Staging** (`.env.staging`):
```env
VITE_API_BASE_URL=https://api-staging.example.com/api
```

**Production** (`.env.production`):
```env
VITE_API_BASE_URL=https://api.example.com/api
```

## Deployment

### Production Build

```bash
# Build optimized bundle
npm run build

# Output in /frontend/dist/
```

### Deployment Options

#### 1. Static Hosting (Vercel, Netlify)
```bash
# Deploy dist/ folder
npm run build
# Upload dist/ to hosting service
```

#### 2. Docker Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### 3. Docker Compose
```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - VITE_API_BASE_URL=http://server:5000/api
  depends_on:
    - server
```

### Docker Compose Setup

From the project root:

```bash
docker-compose build
docker-compose up
```

Frontend will be available at `http://localhost:3000`

## Styling System

### TailwindCSS Integration

The frontend uses TailwindCSS for styling:

- **Configuration**: `tailwind.config.js`
- **Colors**: Extended color palette with blue theme
- **Dark Mode**: Built-in `dark:` modifier support
- **Responsive**: Mobile-first, `sm:`, `md:`, `lg:` breakpoints

### Custom CSS

Global styles in `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom markdown styles */
.markdown-content h1 { /* ... */ }

/* Custom animations */
@keyframes fadeIn { /* ... */ }
```

### Dark Mode Classes

```html
<!-- Light mode -->
<div class="bg-white text-gray-900">

<!-- Dark mode (automatically applied on dark: prefix) -->
<div class="dark:bg-gray-900 dark:text-white">
```

## Performance Optimization

### Bundle Optimization

- Code splitting with dynamic imports
- Tree-shaking removes unused code
- Minification of JS/CSS
- Image optimization

### Runtime Performance

- Memoization of expensive calculations
- Efficient re-renders with React hooks
- Lazy loading of pages and components
- API response caching

### Network Optimization

- Gzip compression
- HTTP caching headers
- Minimal JavaScript bundle
- Optimized images

## Error Handling

### API Errors

```typescript
try {
  await apiClient.getComplaints();
} catch (error) {
  // Automatically redirects to login on 401
  // Other errors are thrown for handling
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
}
```

### User Feedback

```typescript
// Alert notifications
<Alert
  type="error"
  message="Failed to load data"
  onClose={() => setAlertClosed(true)}
/>

// Loading states
{isLoading && <LoadingSpinner />}

// Empty states
{data.length === 0 && <div>No data found</div>}
```

## Testing the Integration

### 1. Setup
```bash
# Start backend
cd server && npm run dev  # Runs on http://localhost:5000

# Start frontend (in new terminal)
cd frontend && npm run dev  # Runs on http://localhost:3000
```

### 2. Test Auth Flow
- Register new user at `/register`
- Login at `/login`
- Verify token in localStorage
- Check navbar shows logged-in state

### 3. Test Complaint Flow
- Create complaint at `/create-complaint`
- View list at `/complaints`
- Filter by status/priority
- Verify API calls in Network tab

### 4. Test Docs
- Check `/docs` folder exists with `.md` files
- Visit `/docs` to see sidebar
- Click doc to view content
- Verify syntax highlighting works

## Troubleshooting

### Frontend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API calls failing

1. Ensure backend is running: `http://localhost:5000/api`
2. Check network tab in DevTools
3. Verify `VITE_API_BASE_URL` in `.env`
4. Check CORS configuration on backend

### Docs not loading

1. Check `/docs` folder exists
2. Ensure `.md` files are present
3. Verify file permissions
4. Check browser console for errors

### Dark mode not working

1. Check `dark` class on `<html>` element
2. Clear browser cache
3. Check `localStorage` for theme preference

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` file
3. ✅ Add markdown files to `/docs/`
4. ✅ Start backend on port 5000
5. ✅ Run `npm run dev`
6. ✅ Test at `http://localhost:3000`

## Support Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **TailwindCSS**: https://tailwindcss.com/
- **React Router**: https://reactrouter.com/

## File Reference

- `./frontend/` - Frontend root directory
- `./frontend/src/` - Source code
- `./frontend/package.json` - Dependencies
- `./frontend/.env` - Environment variables
- `./docs/` - Markdown documentation

---

**Last Updated**: 2024
**Frontend Version**: 1.0.0
**Status**: Production Ready
