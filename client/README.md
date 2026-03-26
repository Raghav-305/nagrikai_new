# Nagrik AI - Frontend

React-based frontend for the Nagrik AI Complaint Management System.

## Installation

```bash
cd client
npm install
```

## Running the Frontend

```bash
npm start
```

The frontend will start at `http://localhost:3000`

## Features

### Citizen Features
- Register/Login
- Create new complaints with photo upload
- View complaint status and updates
- Track complaint resolution

### Officer Features
- View complaints assigned to department
- Filter by status and priority
- Update complaint status
- Add notes and updates
- Assign complaints (optional)

### Admin Features
- Dashboard with system statistics
- View all users
- Delete users
- View complaints by department

## Project Structure

```
client/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API client
│   ├── context/        # React Context (Auth)
│   ├── styles/         # CSS styles
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── package.json
└── .env                # Environment variables
```

## API Connection

The frontend connects to the backend at `http://localhost:5000/api` (configurable in `.env`)

## Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically sent with each request via interceptor
- Expired tokens redirect to login page

## Styling

Uses custom CSS with:
- CSS Grid for layouts
- Flexbox for alignment
- CSS Variables for theming
- Responsive design

## Notes

- Make sure the backend server is running before starting the frontend
- Default API URL: http://localhost:5000/api
- Update `.env` file if using different backend URL
