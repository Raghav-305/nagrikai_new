# Nagrik AI - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
- JWT Bearer Token in Authorization header
- Format: `Authorization: Bearer <token>`

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen"
}
```

**Roles:** `citizen`, `department`, `admin`

---

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
```

---

## Complaint Endpoints

### Create Complaint
```
POST /complaints
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Pothole on Street",
  "description": "There's a large pothole on Main Street",
  "category": "Infrastructure",
  "department": "<department_id>"
}
```

---

### Get All Complaints
```
GET /complaints
Headers: Authorization: Bearer <token>
```

---

### Get Complaint by ID
```
GET /complaints/:id
Headers: Authorization: Bearer <token>
```

---

### Update Complaint
```
PUT /complaints/:id
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "in-progress",
  "assignedTo": "<user_id>"
}
```

---

### Delete Complaint
```
DELETE /complaints/:id
Headers: Authorization: Bearer <token>
```

---

## Department Endpoints

### Get All Departments
```
GET /departments
```

---

### Get Department by ID
```
GET /departments/:id
```

---

### Create Department
```
POST /departments
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

---

### Update Department
```
PUT /departments/:id
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

---

## Admin Endpoints

### Get All Users
```
GET /admin/users
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

---

### Get Dashboard Statistics
```
GET /admin/stats
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

---

### Update User Role
```
PUT /admin/users/:id/role
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

**Request Body:**
```json
{
  "role": "department"
}
```

---

### Delete User
```
DELETE /admin/users/:id
Headers: Authorization: Bearer <token>
```
**Required Role:** Admin

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```
