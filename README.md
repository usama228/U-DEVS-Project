# UDEVS Multi-Tasking Employee Portal

<div align="center">
  <img src="src/assets/images/logo-full.png" alt="UDEVS Logo" width="200"/>
  
  **Designed to empower teams, streamline processes, and build the future.**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Implementation Status](#implementation-status)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support](#support)

---

## 🎯 Overview

The UDEVS Multi-Tasking Employee Portal is an enterprise-grade web application designed to centralize and automate employee and administrative workflows. Built with modern web technologies, it provides a comprehensive solution for managing employees, attendance, leaves, tasks, and projects within the UDEVS organization.

### Key Benefits
- **Centralized Management**: All employee data and workflows in one place
- **Role-Based Access**: Tailored dashboards and permissions for different user types
- **Automated Workflows**: Streamlined approval processes and notifications
- **Real-time Tracking**: Live attendance, task, and project monitoring
- **Scalable Architecture**: Built to grow with your organization

---

## 🚀 Implementation Status

### ✅ **Fully Implemented**
- **Frontend Framework**: React.js with Vite build system
- **State Management**: Redux with proper action/reducer structure
- **JWT Authentication**: Token-based authentication with mock services
- **Database Schema**: Complete PostgreSQL schema with all required tables
- **Routing**: React Router with protected routes and navigation
- **UI Components**: Bootstrap-based responsive design
- **Error Handling**: Error boundaries and proper error management
- **Development Environment**: Hot reload, ESLint, and development tools
- **Calendar UI**: FullCalendar components for event display

### ⏳ **Partially Implemented (Backend Services Ready)**
- **User Management**: Database services created, needs UI integration
- **Attendance System**: Database services created, needs UI components
- **Leave Management**: Database services created, needs UI components
- **Task Management**: Database services created, needs UI components
- **Class Scheduling**: Database services created, calendar UI exists but not integrated
- **Project Management**: Database services created, needs UI components

### 🔄 **In Progress**
- **Backend API**: Express.js server needs to be created
- **Real Database Integration**: Currently using mock services
- **Email Notifications**: Email workflow system
- **Role-Based UI**: Different dashboards for different user roles

### 📋 **Planned Features**
- **Advanced Reporting**: Analytics and reporting dashboards
- **Mobile Responsiveness**: Enhanced mobile experience
- **Real-time Notifications**: WebSocket integration
- **File Upload**: Document management system
- **Calendar Integration**: Google Calendar/Outlook integration
- **API Documentation**: Swagger/OpenAPI documentation

---

## ✨ Features

### 🔐 Authentication & User Management
- ✅ **JWT-based Authentication**: Secure token-based authentication system
- ❌ **Role-Based Access Control**: Different permissions for Admin, Team Lead, Junior Engineer, QA Engineer, and Intern
- ❌ **User Registration Workflow**: Email-based approval system for new registrations
- ❌ **Password Management**: Secure password handling with bcrypt encryption

### 👥 Employee Management
- ❌ **Employee Profiles**: Complete employee information management
- ❌ **Work Mode Tracking**: Remote/Onsite work mode support
- ❌ **Approval System**: Admin approval for employee registrations
- ❌ **Role Assignment**: Dynamic role assignment and management

### ⏰ Attendance System
- ❌ **Check-in/Check-out**: Real-time attendance tracking
- ❌ **Break Management**: Automatic break time calculation
- ❌ **Work Hour Calculation**: Automatic total work hours computation
- ❌ **Attendance Reports**: Comprehensive reporting and analytics

### 📅 Leave Management
- ❌ **Leave Applications**: Employee leave request system
- ❌ **Approval Workflow**: Admin approval/rejection process
- ❌ **Leave Types**: Support for different leave categories
- ❌ **Leave History**: Complete leave tracking and history

### 📚 Task Management
- ❌ **Task Submission**: Daily/weekly task submission for interns
- ❌ **Task Approval**: Admin review and approval system
- ❌ **Status Tracking**: Real-time task status updates
- ❌ **Task History**: Complete task logs and history

### 🎓 Class Scheduling (Interns)
- ❌ **Schedule Creation**: Admin can create class schedules
- ❌ **Time Slot Management**: Flexible time slot configuration
- ⏳ **Calendar Integration**: Visual calendar interface (UI exists, needs data integration)
- ❌ **Schedule Viewing**: Intern access to class schedules

### 📊 Project Management
- ❌ **Project Assignment**: Admin can assign projects to employees/interns
- ❌ **Project Tracking**: Real-time project status monitoring
- ❌ **Team Management**: Team-based project assignments
- ❌ **Progress Reporting**: Project progress and completion tracking

---

## 🛠 Technology Stack

### Frontend ✅
- **React.js 18.3.1**: Modern UI library for building user interfaces
- **Vite 5.4.1**: Fast build tool and development server
- **Redux Toolkit**: State management with Redux
- **React Router DOM**: Client-side routing
- **Bootstrap**: Responsive CSS framework
- **SCSS**: Advanced CSS preprocessing
- **Axios**: HTTP client for API communication

### Backend ⏳
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database management system
- **Sequelize/Prisma**: Object-Relational Mapping (ORM)
- **JWT**: JSON Web Token authentication
- **Nodemailer**: Email service integration

### Development Tools ✅
- **ESLint**: Code linting and formatting
- **Sass**: CSS preprocessor
- **Git**: Version control system

---

## 📁 Project Structure

```
package/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.png
│   └── vite.svg
├── src/
│   ├── assets/            # Static resources ✅
│   │   ├── css/          # Compiled CSS
│   │   ├── icons/        # Icon libraries
│   │   ├── images/       # Image assets
│   │   ├── scss/         # SCSS source files
│   │   └── vendor/       # Third-party libraries
│   ├── components/       # Reusable components ✅
│   │   └── ErrorBoundary.jsx
│   ├── config/          # Configuration files ✅
│   │   └── database.js
│   ├── context/         # React context providers ✅
│   │   └── ThemeContext.jsx
│   ├── jsx/             # Main application components ✅
│   │   ├── components/  # Feature-specific components
│   │   ├── layouts/     # Layout components
│   │   └── pages/       # Page components
│   ├── services/        # API and business logic services ✅
│   │   ├── AuthService.js
│   │   ├── AxiosInstance.js
│   │   ├── DatabaseService.js
│   │   ├── MockBackendService.js
│   │   └── PostsService.js
│   ├── store/           # Redux store configuration ✅
│   │   ├── actions/     # Redux actions
│   │   ├── reducers/    # Redux reducers
│   │   └── selectors/   # Redux selectors
│   ├── utils/           # Utility functions ✅
│   │   ├── dbTest.js
│   │   └── helpers.js
│   ├── App.jsx          # Main application component ✅
│   └── main.jsx         # Application entry point ✅
├── database/            # Database schema and migrations ✅
│   └── schema.sql
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

---

## 🗄 Database Schema ✅

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cnic VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    work_mode VARCHAR(50) DEFAULT 'full_time',
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    break_time INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leaves Table
```sql
CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Classes Table
```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v15 or higher) ⏳ *Required for full functionality*
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd package
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup ⏳
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE USER akademi_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE akademi_db OWNER akademi_user;
GRANT ALL PRIVILEGES ON DATABASE akademi_db TO akademi_user;
\q

# Run database schema
psql -U akademi_user -d akademi_db -f database/schema.sql
```

### Step 4: Environment Configuration
Create a `.env` file in the project root:
```env
# Database Configuration (Optional for development with mock services)
DB_USER=akademi_user
DB_HOST=localhost
DB_NAME=akademi_db
DB_PASSWORD=your_secure_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend API URL
VITE_API_URL=http://localhost:3001/api
```

### Step 5: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Note**: Currently using mock services for development. Database setup is optional until backend is implemented.

---

## ⚙ Environment Configuration

### Development Environment ✅
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
```

### Production Environment ⏳
```env
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com/api
```

### Database Configuration ⏳
```env
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

---

## 📖 Usage

### Current Functionality ✅
1. **Authentication**
   - Login with mock credentials (demo@example.com / 123456)
   - Registration form (mock backend)
   - JWT token management
   - Protected routes

2. **Basic Navigation**
   - Dashboard layout
   - Sidebar navigation
   - Responsive design

3. **Calendar Interface**
   - FullCalendar component available
   - Event display and management
   - Drag-and-drop functionality

### For Administrators ❌
1. **User Management**
   - Approve/reject employee registrations
   - Manage employee profiles and roles
   - Reset user passwords

2. **Attendance Management**
   - View attendance reports
   - Mark attendance for employees
   - Generate attendance analytics

3. **Leave Management**
   - Review and approve/reject leave applications
   - View leave history and reports

4. **Task Management**
   - Review submitted tasks
   - Approve/reject intern tasks
   - Monitor task completion

5. **Project Management**
   - Assign projects to employees/interns
   - Track project progress
   - Manage project status

### For Employees ❌
1. **Attendance**
   - Check-in/check-out daily
   - Track break times
   - View attendance history

2. **Leave Management**
   - Submit leave applications
   - Track leave status
   - View leave history

3. **Task Management** (Interns)
   - Submit daily/weekly tasks
   - Track task approval status
   - View task history

4. **Class Schedule** (Interns)
   - View class schedules
   - Check class timings
   - Access calendar view

---

## 🔌 API Documentation ⏳

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/me
```

### User Management
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/approve
```

### Attendance Management
```
GET    /api/attendance
GET    /api/attendance/user/:userId
POST   /api/attendance/checkin
POST   /api/attendance/checkout
PATCH  /api/attendance/break
```

### Leave Management
```
GET    /api/leaves
GET    /api/leaves/user/:userId
POST   /api/leaves
PATCH  /api/leaves/:id/status
DELETE /api/leaves/:id
```

### Task Management
```
GET    /api/tasks
GET    /api/tasks/user/:userId
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

### Class Management
```
GET    /api/classes
GET    /api/classes/date/:date
POST   /api/classes
PUT    /api/classes/:id
DELETE /api/classes/:id
```

### Project Management
```
GET    /api/projects
GET    /api/projects/user/:userId
POST   /api/projects
PUT    /api/projects/:id
PATCH  /api/projects/:id/status
DELETE /api/projects/:id
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel) ✅
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Set `VITE_API_URL` to your production API URL
   - Configure other production environment variables

### Backend Deployment (Render/EC2) ⏳
1. **Render Deployment**
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Configure environment variables

2. **EC2 Deployment**
   ```bash
   # Install Node.js and PM2
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   
   # Clone and setup
   git clone <repository-url>
   cd package
   npm install
   npm run build
   
   # Start with PM2
   pm2 start npm --name "akademi" -- start
   pm2 startup
   pm2 save
   ```

### Database Deployment ⏳
1. **PostgreSQL Setup**
   - Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
   - Configure connection strings
   - Run database migrations

2. **Environment Variables**
   ```env
   DB_HOST=your-production-db-host
   DB_NAME=your-production-db-name
   DB_USER=your-production-db-user
   DB_PASSWORD=your-production-db-password
   ```

---

## 🤝 Contributing

We welcome contributions to improve the UDEVS Multi-Tasking Employee Portal!

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Current Development Priorities
1. **Backend API Development** - Create Express.js server
2. **Database Integration** - Connect frontend to real database
3. **UI Components** - Build attendance, leave, task management interfaces
4. **Role-Based Dashboards** - Create different views for different user types
5. **Email Notifications** - Implement email workflow system
6. **Calendar Integration** - Connect existing calendar components to class data

---

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Email**: Contact the development team for urgent matters

### Common Issues
1. **Database Connection Issues** ⏳
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists and schema is applied

2. **Authentication Issues** ✅
   - Clear browser cache and localStorage
   - Verify JWT secret is configured
   - Check token expiration settings

3. **Build Issues** ✅
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all environment variables are set

4. **Mock Services** ✅
   - Currently using mock data for development
   - Login with: `demo@example.com` / `123456`
   - All API calls are simulated until backend is ready

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💼 About UDEVS

**Prepared by:** Usama Aslam  
**Designation:** CEO & Founder, UDEVS  
**Technology Stack:** MERN Stack (PostgreSQL as Database)

UDEVS is committed to building innovative solutions that empower teams and streamline business processes. This employee portal represents our dedication to creating efficient, user-friendly applications that drive organizational success.

---

<div align="center">
  <p><strong>UDEVS Multi-Tasking Portal</strong></p>
  <p><em>Designed to empower teams, streamline processes, and build the future.</em></p>
</div>
