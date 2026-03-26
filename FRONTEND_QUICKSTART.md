# 🚀 Quick Start Guide - Frontend

Get the Nagrik AI frontend running in 5 minutes!

## Step 1: Install Dependencies (2 min)

```bash
cd frontend
npm install
```

## Step 2: Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Nagrik AI
```

## Step 3: Add Documentation (1 min - Optional)

Create `/docs` folder in project root:
```bash
mkdir -p ../docs
echo "# Getting Started" > ../docs/README.md
```

## Step 4: Start Backend (Before Frontend)

```bash
# In another terminal, from /server folder
npm start  # Runs on http://localhost:5000
```

## Step 5: Start Frontend

```bash
npm run dev  # From /frontend folder
```

✅ **Done!** Open http://localhost:3000

---

## Available Commands

```bash
npm run dev      # Start development server (HMR enabled)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## Default Credentials (for testing)

You can use these to test:

1. **Register** a new account at `/register`
2. Or **Login** with test credentials (once registered)

---

## What You Get

- 🎨 Beautiful UI with dark mode
- 📱 Fully responsive design
- 🔐 JWT authentication
- 📊 Complaint management
- 📚 Auto-loading documentation
- ⚡ Lightning-fast with Vite
- 🎯 Type-safe with TypeScript

---

## Project Structure

```
frontend/
  ├── src/
  │   ├── components/      # 8 UI components
  │   ├── pages/          # 7 pages
  │   ├── hooks/          # 4 custom hooks
  │   ├── utils/          # API client, helpers
  │   ├── types/          # TypeScript types
  │   └── styles/         # TailwindCSS
  ├── package.json        # Dependencies
  ├── vite.config.ts      # Build config
  └── README.md           # Full documentation
```

---

## Pages Available

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Complaints | `/complaints` | View complaints |
| Create | `/create-complaint` | Submit complaint |
| Docs | `/docs` | Documentation |
| Dashboard | `/dashboard` | Admin stats |

---

## Key Features

### ✨ Authentication
- Login/Register with JWT
- Role-based access
- Secure token storage

### 📱 Responsive
- Works on all screen sizes
- Touch-friendly navigation
- Mobile-optimized

### 🌙 Dark Mode
- Auto-detect system preference
- Manual toggle in navbar
- Persistent storage

### 📚 Documentation
- Auto-loads markdown files
- Syntax highlighting
- Table of contents

### 📊 Data Management
- Create, read, update, delete complaints
- Filter by status, priority, category
- Real-time updates

---

## Troubleshooting

### Q: Port 3000 already in use?
**A:** Change port in `vite.config.ts`:
```typescript
server: { port: 3001 }
```

### Q: Cannot connect to backend?
**A:** Ensure:
1. Backend is running: `npm start` in `/server`
2. `VITE_API_BASE_URL` in `.env` is correct
3. CORS is enabled on backend

### Q: Docs not showing?
**A:** Create `/docs` folder with `.md` files:
```bash
mkdir docs
echo "# Docs" > docs/README.md
```

### Q: Dark mode not working?
**A:** Clear localStorage:
```javascript
localStorage.clear()
```

---

## Key Files to Know

- **`package.json`** - All dependencies and scripts
- **`.env`** - Environment configuration
- **`src/App.tsx`** - Main app with routing
- **`src/utils/apiClient.ts`** - API communication
- **`src/context/AuthContext.tsx`** - Authentication
- **`tailwind.config.js`** - Styling configuration

---

## Next Steps

1. ✅ Install: `npm install`
2. ✅ Configure: Create `.env` file
3. ✅ Start backend: `npm start` (in `/server`)
4. ✅ Start frontend: `npm run dev`
5. ✅ Register new account
6. ✅ Create a complaint
7. ✅ View in dashboard

---

## Full Documentation

- **[Frontend README](./frontend/README.md)** - Features and usage
- **[Setup Guide](./FRONTEND_SETUP.md)** - Detailed installation
- **[Integration Guide](./FRONTEND_INTEGRATION_GUIDE.md)** - Backend integration
- **[Complete Summary](./FRONTEND_COMPLETE_SUMMARY.md)** - Full project overview

---

## Support

- Check browser console (F12) for errors
- Review network tab for API calls
- Read the documentation files
- Check backend logs if API fails

---

**Ready? Let's go! 🚀** `npm run dev`
