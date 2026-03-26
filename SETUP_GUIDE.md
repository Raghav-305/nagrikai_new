# Nagrik AI - Full Stack Setup Guide

## 📋 Project Overview

Nagrik AI is a full-stack Government Complaint Management System with AI-powered categorization.

### Tech Stack
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + React Router + Axios
- **AI Service**: FastAPI (Python)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or cloud connection)
- Python 3.8+ (for FastAPI)

---

## 1️⃣ Backend Setup

### Navigate to server directory
```bash
cd server
```

### Install dependencies
```bash
npm install
```

### Configure .env file
Edit `server/.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nagrik_ai
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FASTAPI_URL=http://localhost:8000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

### Start the backend
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

---

## 2️⃣ Frontend Setup

### Navigate to client directory
```bash
cd ../client
```

### Install dependencies
```bash
npm install
```

### Configure .env file (already done)
`client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Start the frontend
```bash
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 3️⃣ FastAPI (AI Service) Setup

### Navigate to FastAPI directory (if it exists)
```bash
cd ../fastapi-service
```

### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install dependencies
```bash
pip install fastapi uvicorn pillow numpy
```

### Create `main.py` with analyze endpoint
See FastAPI integration guide below.

### Start FastAPI
```bash
uvicorn main:app --reload --port 8000
```

FastAPI will run on: **http://localhost:8000**

---

## 📁 Project Structure

```
Nagrik_AI/
├── server/                 # Backend (Node.js/Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── .env
│   └── server.js
│
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── fastapi-service/        # AI Service (Python)
    ├── main.py
    ├── requirements.txt
    └── venv/
```

---

## 🔐 User Roles & Access

### 1. Citizen
- Register/Login
- Create complaints with photo
- Track complaint status
- View updates from department

### 2. Officer
- Login with department assignment
- View complaints for their department
- Update complaint status (pending → in-progress → resolved)
- Add notes and updates
- Filter complaints by status/priority

### 3. Admin
- Access admin dashboard
- View system statistics
- Manage all users
- Monitor complaints by department

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - User login
```

### Complaints (Citizen)
```
POST   /api/complaints          - Create new complaint
GET    /api/complaints          - Get user's complaints
GET    /api/complaints/:id      - Get complaint details
```

### Department
```
GET    /api/department/complaints         - Get department complaints
PUT    /api/department/complaint/:id/status  - Update status
PUT    /api/department/complaint/:id/assign  - Assign complaint
```

### Admin
```
GET    /api/admin/users         - Get all users
GET    /api/admin/stats         - Get system statistics
DELETE /api/admin/users/:id     - Delete user
PUT    /api/admin/users/:id/role - Update user role
```

---

## 🤖 FastAPI Integration

The FastAPI service should implement an `/analyze` endpoint:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ComplaintRequest(BaseModel):
    title: str
    description: str

@app.post("/analyze")
async def analyze_complaint(request: ComplaintRequest):
    # Your AI logic here
    return {
        "category": "water",  # or electricity, roads, sanitation, healthcare
        "priority": "high",   # low, medium, high, critical
        "sentiment": "negative",
        "action_plan": "Send inspection team"
    }
```

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "citizen" | "officer" | "admin",
  department: String (optional, required for officers),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint
```javascript
{
  user: ObjectId (ref: User),
  text: String,
  image: String (base64),
  ticket_id: String (unique),
  department: String,
  priority: "low" | "medium" | "high" | "critical",
  assignedTo: ObjectId (ref: User),
  action_plan: String,
  department_notes: [{officer, note, timestamp}],
  status: "pending" | "in-progress" | "resolved",
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

---

## 🔐 Security Features Implemented

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Role-based access control
✅ Input validation
✅ Duplicate complaint detection
✅ Spam detection
✅ Error handling & logging
✅ Protected API routes

---

## 🧪 Testing the System

### 1. Create Citizen Account
- Register at http://localhost:3000/register
- Role: Citizen
- Submit complaint with photo

### 2. Create Officer Account
- Register at http://localhost:3000/register  
- Role: Officer
- Department: Water / Electricity / Roads / Sanitation / Healthcare
- View complaints for your department
- Update status with notes

### 3. Admin Account
- Created manually in database (contact system admin)
- View statistics and manage users

---

## 📱 Frontend Features

✅ Responsive design (mobile/tablet/desktop)
✅ Real-time status updates
✅ Image upload & preview
✅ Form validation
✅ Error handling with user-friendly messages
✅ Loading states
✅ Protected routes
✅ Role-based navigation

---

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Check backend is running on http://localhost:5000
- Check `.env` file has correct API URL
- Check browser console for CORS errors

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database exists

### JWT token expired
- Login again to get new token
- Token expires after 7 days by default

### Image upload not working
- Check file size (should be reasonable)
- Check image format (jpg, png)
- Ensure base64 encoding is working

---

## 📞 Support

For issues or questions:
1. Check the error message in console
2. Verify all services are running (backend, frontend, mongodb)
3. Check `.env` configuration
4. Review API logs for detailed errors

---

## 🎯 Next Steps

1. **Complete AI Integration**: Connect FastAPI for image analysis
2. **Email Notifications**: Send updates to citizens
3. **Dashboard Analytics**: Add charts and statistics
4. **Mobile App**: Use React Native for mobile
5. **Deployment**: Deploy to cloud (AWS, Azure, Heroku)

