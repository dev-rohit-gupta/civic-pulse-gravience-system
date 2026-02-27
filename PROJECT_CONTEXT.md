# Civic Pulse - Grievance Management System - Complete Project Context

## 🎯 Project Overview
**Civic Pulse** is a comprehensive grievance management system for handling citizen complaints in a structured, role-based workflow. It enables citizens to lodge complaints, track their status, and allows government departments to manage and resolve issues efficiently.

---

## 🏗️ Architecture & Tech Stack

### **Monorepo Structure (TurboRepo)**
```
civic-pulse-gravience-system/
├── apps/
│   ├── client/          # React Frontend (Vite)
│   └── server/          # Express Backend (TypeScript)
├── packages/
│   ├── schemas/         # Shared Zod schemas & TypeScript types
│   ├── utils/           # Shared utility functions
│   ├── ai-engine/       # AI-powered complaint analysis (Gemini)
│   └── similarity-ai-detect/  # Python-based duplicate detection
└── docs/, k8s/, logs/
```

### **Technology Stack**

#### **Frontend (apps/client)**
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router 7.13.1
- **Styling**: Tailwind CSS 4.2.1 + Custom CSS
- **HTTP**: Native Fetch API (migrated from Axios)
- **State Management**: React Context API (AppContext)

#### **Backend (apps/server)**
- **Runtime**: Node.js with TypeScript 5.5
- **Framework**: Express 4.19.2
- **Database**: MongoDB with Mongoose 8.5.0
- **Authentication**: JWT using `jose` library (HS256)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **Email**: Nodemailer 8.0.1 (Ethereal for dev, Gmail SMTP for prod)
- **Validation**: Zod 4.3.6

#### **AI & Analytics**
- **AI Engine**: Google Gemini API (complaint categorization, priority analysis)
- **Similarity Detection**: Python ML model for duplicate complaint detection
- **Cloud Storage**: AWS S3 for complaint attachments

---

## 👥 Role-Based System

### **Four User Roles:**

1. **Citizen** (`role: "citizen"`)
   - Register complaints (public portal - no login required)
   - Track complaints via Reference ID
   - View complaint history (after login)
   - No department association

2. **Operator** (`role: "operator"`)
   - View assigned department's complaints
   - Update complaint status (In Progress, Resolved)
   - Add comments/updates
   - Linked to specific department

3. **Department** (`role: "department"`)
   - Manage department-specific complaints
   - Create operators for their department
   - Escalate complaints
   - View department analytics

4. **Admin** (`role: "admin"`)
   - Full system access
   - Create departments and categories
   - Manage all users (department heads, operators)
   - View global analytics and activity logs
   - System-wide complaint management

---

## 🔑 Core Features

### **1. Complaint Management**
- **Public Submission**: Citizens can submit complaints without login
  - Fields: Name, Phone, Email, Aadhaar, Category, Description, Location
  - Optional: Attachments (images/PDFs uploaded to S3)
  - Auto-generated Reference ID for tracking

- **Status Workflow**: 
  ```
  Pending → In Progress → Resolved → Closed
  ```

- **Assignment Logic**:
  - Auto-assigned to department based on complaint category
  - Department can reassign to operators
  - Operators handle resolution

- **Tracking System**:
  - Public complaint tracking via Reference ID (no login)
  - Real-time status updates
  - Email notifications on status changes

### **2. User Management**
- **Registration Flow**:
  - Admin creates Department users
  - Department users create Operators
  - Citizens self-register or submit anonymous complaints
  
- **Authentication**:
  - JWT-based (Access Token with 1-day expiry)
  - Stored in cookies (httpOnly, secure in prod)
  - Auto-login on app load if valid token exists

- **User Schema** (MongoDB):
  ```typescript
  {
    id: String (custom ID: USR_xxx, DEP_xxx, etc.),
    fullname: String,
    email: String (unique),
    password: String (bcrypt hashed),
    aadhaar: String (hashed),
    phone: String,
    role: "citizen" | "operator" | "department" | "admin",
    department: ObjectId (ref to Department, null for citizen/admin),
    createdAt, updatedAt
  }
  ```

### **3. Department & Category System**
- **Department Model**:
  ```typescript
  {
    id: String (DEP_xxx),
    title: String,
    description: String,
    category: String (linked to Category),
    createdAt, updatedAt
  }
  ```

- **Category Model**:
  ```typescript
  {
    id: String (CAT_xxx),
    name: String,
    description: String,
    icon: String (emoji),
    isActive: Boolean,
    createdAt, updatedAt
  }
  ```

- **Common Categories**:
  - 🚧 Road & Infrastructure
  - 💧 Water Supply
  - ⚡ Electricity
  - 🗑️ Waste Management
  - 🏗️ Construction Issues
  - 🚦 Traffic & Transport
  - 🌳 Parks & Environment

### **4. Activity Logging**
- Tracks all system actions with metadata:
  ```typescript
  {
    activityType: "complaint" | "user" | "department" | "category",
    action: "created" | "updated" | "deleted" | "escalated",
    performedBy: ObjectId (User),
    details: Object,
    ipAddress: String,
    timestamp: Date
  }
  ```

### **5. AI Integration**
- **AI Engine (Gemini)**:
  - Automatic complaint priority detection
  - Category suggestion based on description
  - Sentiment analysis
  - Summary generation
  
- **Duplicate Detection**:
  - Python-based similarity matching
  - Prevents duplicate complaints
  - Suggests similar existing complaints

### **6. Email Notifications**
- **Events**: Complaint registration, status updates, assignments
- **Configuration**:
  - Development: Ethereal Email (cornelius51@ethereal.email)
  - Production: Gmail SMTP (port 587, STARTTLS)
- **Templates**: HTML emails with complaint details

---

## 📂 Key Files & Structure

### **Frontend (apps/client/src/)**

#### **Pages**:
- `Dashboard.jsx` - Role-based dashboard with stats & charts
- `Complaints.jsx` - Complaint listing & management
- `Activity.jsx` - System activity logs
- `Contractors.jsx` - Operator management
- `Departments.jsx` - Department CRUD
- `Categories.jsx` - Category CRUD
- `CivicPulsePortal.jsx` - Public complaint submission & tracking
- `login.jsx` - Login/Register with beautiful UI
- `AdminRegister.jsx` - Admin self-registration

#### **Services (API Layer)**:
All migrated to **native Fetch API**:
- `api.js` - Base API wrapper with auth headers
- `authService.js` - Login, register, logout
- `complaintService.js` - CRUD operations for complaints
- `userService.js` - User management
- `activityService.js` - Activity logs
- `categoryService.js` - Category operations
- `departmentService.js` - Department operations
- `dashboardService.js` - Analytics data
- `publicComplaintService.js` - Public complaint submission & tracking

#### **Context**:
- `AppContext.jsx` - Global state management
  - User authentication state
  - Complaints, operators, activity logs
  - Dashboard stats
  - CRUD handlers
  - **Recent Fix**: useEffect dependency changed from `[user]` to `[]` to prevent infinite loops

#### **Components**:
- `Header.jsx` - Navigation bar with role-based menu
- `Sidebar.jsx` - Side navigation
- `Notification.jsx` - Toast notifications
- `modals/` - Edit complaint, edit operator modals

### **Backend (apps/server/src/)**

#### **Models**:
- `user.model.ts` - User schema with bcrypt & JWT methods
- `complaint.model.ts` - Complaint schema with status tracking
- `department.model.ts` - Department configuration
- `category.model.ts` - Complaint categories
- `role.model.ts` - Role definitions
- `activity.model.ts` - Activity logging

#### **Services (Business Logic)**:
- `user.login.service.ts` - Login logic with JWT generation
- `user.register.service.ts` - Registration for all roles
- `complaint.service.ts` - Complaint CRUD & status updates
- `activity.service.ts` - Role-based activity filtering
- `department.service.ts` - Department management
- `category.service.ts` - Category operations

#### **Controllers**:
- `login.controller.ts` - Login endpoint
- `register.controller.ts` - Registration endpoint
- `complaint.controller.ts` - Complaint endpoints
- `update.controller.ts` - Update user/complaint
- `department.controller.ts` - Department endpoints
- `category.controller.ts` - Category endpoints

#### **Middleware**:
- `auth.middleware.ts` - JWT verification (jose library)
- `error.middleware.ts` - Global error handler
- `multer.middleware.ts` - File upload handling

#### **Routes**:
- `auth.routes.ts` - /auth/login, /auth/register
- `complaint.route.ts` - /api/complaints/*
- `category.routes.ts` - /api/categories/*
- `department.routes.ts` - /api/departments/*
- `api.router.ts` - Main router aggregator

#### **Config**:
- `mongo.connection.config.ts` - MongoDB connection with autoIndex logic
- `cookie.config.ts` - Cookie settings (httpOnly, secure)

---

## 🔧 Recent Fixes & Optimizations

### **1. Infinite API Loop Fix** (Most Recent)
- **Problem**: useEffect in AppContext re-ran on every render
- **Cause**: `useEffect([user])` dependency triggered on user object changes
- **Solution**: Changed to `useEffect([])` - runs only once on mount
- **Impact**: Eliminated infinite API calls on all pages

### **2. Axios → Fetch Migration**
- **Why**: Simplify dependencies, reduce bundle size, native browser support
- **Changes**: Migrated all 9 service files to native fetch
- **Error Handling**: Changed `error.response?.data?.message` → `error.message`

### **3. TypeScript Build Errors**
- Fixed missing `allLogs` query in activity service
- Fixed duplicate `password` identifier in login service
- Fixed `_id` exclusion in login query (was causing undefined in JWT)

### **4. Mongoose Index Warnings**
- Set `autoIndex: true` in development, `false` in production
- Prevents duplicate index warnings during dev

### **5. Email Configuration**
- Ethereal Email for dev testing (cornelius51@ethereal.email)
- Gmail SMTP ready for production (with app password)

---

## 🚀 Running the Project

### **Prerequisites**:
- Node.js 20+
- MongoDB running (local or cloud)
- Python 3.9+ (for similarity detection)

### **Environment Variables (.env in apps/server/)**:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/civic-pulse

# JWT
ACCESS_TOKEN_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRY=1d

# Email (Ethereal - Dev)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=cornelius51@ethereal.email
SMTP_PASS=xXRgB3QEg6YHN9BwRv
EMAIL_FROM=noreply@civicpulse.com

# Email (Gmail - Production)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# AWS S3 (for attachments)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=civic-pulse-attachments
AWS_REGION=us-east-1

# Google Gemini AI
GEMINI_API_KEY=your-gemini-key
```

### **Commands**:
```bash
# Install dependencies
npm install

# Development (runs both client & server)
npm run dev

# Run only server
npm run dev:server

# Run only client
npm run dev:client

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## 🎨 UI/UX Highlights
- **Public Portal**: Beautiful gradient design for complaint submission
- **Dashboard**: Role-specific cards with stats & charts
- **Responsive**: Mobile-friendly design
- **Real-time**: Instant updates on complaint status changes
- **Notifications**: Toast notifications for user actions

---

## 🔐 Security Features
- JWT-based authentication
- Password & Aadhaar hashing (bcrypt)
- HTTP-only cookies
- CORS configured for frontend
- Input validation with Zod schemas
- File type restrictions on uploads
- SQL injection prevention (Mongoose ORM)

---

## 📊 Analytics & Reporting
- Complaint statistics by status
- Department-wise performance metrics
- Operator productivity tracking
- Category-wise complaint distribution
- Time-to-resolution analytics

---

## 🐛 Known Issues & Solutions

### **Issue 1: `this._id` undefined in JWT generation**
- **Cause**: `.select("-_id")` in login query
- **Fix**: Removed `-_id` from select, only exclude `__v`

### **Issue 2: Infinite API calls on page load**
- **Cause**: `useEffect([user])` dependency
- **Fix**: Changed to `useEffect([])` with eslint-disable

### **Issue 3: Error handling after axios removal**
- **Cause**: Code still using `error.response.data.message`
- **Fix**: Changed to `error.message` across all components

---

## 📝 Database Collections

1. **users** - All system users (citizens, operators, departments, admins)
2. **complaints** - All complaints with full lifecycle data
3. **departments** - Department configurations
4. **categories** - Complaint categories
5. **activitylogs** - Audit trail of all actions
6. **roles** - Role definitions and permissions

---

## 🎯 Future Enhancements (Planned)
- Multi-language support (Hindi, English)
- SMS notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Complaint priority queue
- Auto-assignment based on workload
- Chatbot for complaint guidance

---

## 📞 Support & Documentation
- **Main Contact**: team skoiv
- **Repository**: https://github.com/dev-rohit-gupta/civic-pulse-gravience-system
- **Additional Docs**: 
  - `DEPLOYMENT.md` - Deployment guide
  - `SECURITY.md` - Security best practices
  - `PERFORMANCE.md` - Performance optimization
  - `docs/EMAIL_NOTIFICATIONS.md` - Email configuration

---

## 💡 Quick Troubleshooting

**Login not working?**
- Check if `_id` is excluded in login query
- Verify JWT secret in .env
- Clear browser cookies/localStorage

**Infinite API calls?**
- Check useEffect dependencies in components
- Ensure AppContext useEffect has empty dependency array

**Build fails?**
- Run `npm run type-check` to see TypeScript errors
- Check all imports have proper extensions (.js for compiled files)

**Email not sending?**
- Verify SMTP credentials in .env
- Check Ethereal inbox: https://ethereal.email
- For Gmail: Generate App Password (not regular password)

---

## 🎓 Code Conventions
- **Frontend**: Functional components with hooks
- **Backend**: Service-Controller pattern
- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: ES6 modules (type: "module")
- **Error Handling**: Try-catch with proper error messages
- **TypeScript**: Strict mode enabled

---

This document provides complete context for any AI or developer to understand the Civic Pulse project architecture, features, and current state. Use this as a reference for onboarding, debugging, or feature development.
