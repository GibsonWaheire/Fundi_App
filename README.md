# 🛠️ FundiMatch – Professional Fundi Management Platform

**FundiMatch** is a comprehensive platform that connects homeowners, tenants, and project managers in Kenya with verified and professional fundis (craft workers), contractors, and engineers. The platform provides both a modern web interface and a powerful command-line interface for complete fundi management.

## 🎯 Problem Statement

In Kenya and many other regions, finding reliable fundis (contractors such as electricians, plumbers, and masons) is a significant challenge. Clients often rely on word of mouth, which is unreliable, while fundis lack a structured way to showcase their skills and get consistent work. This results in inefficiency, wasted time, and poor trust between clients and service providers.

**FundiMatch** solves this challenge by providing a comprehensive platform that connects clients to fundis based on their skills, experience, and availability.

---

## 🚀 Key Features

### 🌐 Web Application
- **🔐 Multi-Role Authentication**: Admin, Client, and Fundi user types
- **🎯 Role-Based Dashboards**: Customized interfaces for each user type
- **👥 Fundi Discovery**: Browse and filter fundis by specialization
- **📋 Job Management**: Create, assign, and track job progress
- **⭐ Review System**: Rate and review completed work
- **💰 Payment Tracking**: Monitor financial transactions
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔒 Protected Routes**: Secure access control

### 💻 Command-Line Interface (CLI)
- **🏗️ Professional Architecture**: Object-oriented design with SQLAlchemy ORM
- **👤 User Management**: Complete CRUD operations for all user types
- **🛠️ Fundi Profiles**: Professional profiles with skills, ratings, and availability
- **📊 Job Tracking**: Create, assign, and monitor job status
- **📂 Category System**: Organized service categories
- **📈 Analytics**: System statistics and reporting
- **💾 Database Seeding**: Import data from web application

### 🔐 Authentication & Security
- **Multi-Role Access Control**: Different experiences for Admin, Client, and Fundi
- **Dedicated Fundi Portal**: Separate signup/login for service providers
- **Session Management**: Secure user sessions and logout
- **Input Validation**: Comprehensive form validation and error handling

---

## 🏗️ Architecture

### Web Application Architecture
```
📊 Frontend (React.js)
├── Components (Modular UI components)
├── Contexts (Authentication state management)
├── Services (API communication)
└── Routes (Protected navigation)

📊 Backend (JSON Server)
├── db.json (Data storage)
├── RESTful API endpoints
└── Real-time data updates
```

### CLI Application Architecture
```
📊 Database Layer (SQLAlchemy ORM)
├── models.py (Database schema)
├── migrations/ (Database versioning)
└── seed.py (Data population)

📊 Business Logic Layer
├── main.py (CLI entry point)
├── helpers.py (Business operations)
└── cli.py (Legacy CLI)

📊 Data Storage
├── fundimatch.db (SQLite database)
└── db.json (Web app data source)
```

### Database Schema
```
📊 Core Entities:
├── users (Authentication & profiles)
├── fundis (Service provider profiles)
├── categories (Service categories)
├── jobs (Work requests & assignments)
├── reviews (Client feedback)
└── payments (Financial transactions)

📊 Key Relationships:
├── User → Jobs (One-to-Many)
├── Fundi → Jobs (One-to-Many)
├── Category → Jobs (One-to-Many)
├── Job → Reviews (One-to-Many)
└── Job → Payments (One-to-Many)
```

---

## 🛠️ Technology Stack

### Web Application
- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Backend**: JSON Server (RESTful API)
- **Authentication**: Custom session management
- **Build Tool**: Vite

### CLI Application
- **Language**: Python 3.8+
- **ORM**: SQLAlchemy
- **Database**: SQLite
- **Dependencies**: Pipenv
- **Architecture**: Object-oriented design
- **Documentation**: Comprehensive README

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ (for web application)
- Python 3.8+ (for CLI application)
- Git

### Web Application Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GibsonWaheire/Fundi_App.git
   cd Fundi_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npx json-server --watch db.json --port 3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Web App: http://localhost:5173
   - API Server: http://localhost:3001

### CLI Application Setup

1. **Navigate to CLI directory**
   ```bash
   cd Fundi_App
   ```

2. **Setup Python environment**
   ```bash
   pip install pipenv
   pipenv install
   pipenv shell
   ```

3. **Seed the database**
   ```bash
   python lib/db/seed.py
   ```

4. **Run the CLI**
   ```bash
   python lib/main.py
   ```

---

## 🎮 Usage Guide

### Web Application

#### 👤 Guest Users
- Browse available fundis
- View service categories
- Access "For Fundis" portal

#### 👤 Clients
- Register/Login through main site
- Browse and hire fundis
- Create job requests
- Track job progress
- Leave reviews and ratings

#### 🛠️ Fundis
- Register/Login through "For Fundis" portal
- Create professional profiles
- View assigned jobs
- Update job status
- Track earnings

#### 🔧 Admins
- Manage all users and fundis
- Monitor system activity
- Generate reports
- Database maintenance

### CLI Application

#### 👤 Guest Menu
- Login to existing account
- Register as new client or fundi
- View available fundis
- Browse categories

#### 👤 Client Operations
- Find and hire fundis
- Create job requests
- Track job status
- Leave reviews
- View payment history

#### 🛠️ Fundi Operations
- View assigned jobs
- Update job status
- Set availability
- Track earnings
- Manage profile

#### 🔧 Admin Operations
- User management (CRUD)
- Fundi profile management
- Job monitoring
- System statistics
- Database maintenance

---

## 📊 Sample Data & Testing

### Testing Instructions

#### Web Application Testing
1. **Start JSON server**: `npx json-server --watch db.json --port 3001`
2. **Start development server**: `npm run dev`
3. **Test user flows**:
   - Guest → Client registration → Job creation
   - Guest → Fundi registration → Profile setup
   - Admin login → User management

#### CLI Application Testing
1. **Seed database**: `python lib/db/seed.py`
2. **Run CLI**: `python lib/main.py`
3. **Test all user roles**:
   - Guest operations
   - Client job management
   - Fundi profile management
   - Admin system management

### Sample Data Structure
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  ],
  "fundis": [
    {
      "id": 1,
      "username": "testfundi",
      "specialization": "Electrical",
      "rating": 4.8,
      "is_available": true
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Plumbing",
      "description": "Water and drainage systems"
    }
  ]
}
```

---

## 🔧 Development & Customization

### Adding New Features

#### Web Application
1. **Create new component** in `src/components/`
2. **Add route** in `src/App.jsx`
3. **Update navigation** in `src/components/Navbar.jsx`
4. **Add API endpoints** in `db.json`

#### CLI Application
1. **Add model** in `lib/db/models.py`
2. **Create helper functions** in `lib/helpers.py`
3. **Update CLI menu** in `lib/main.py`
4. **Update seeding** in `lib/db/seed.py`

### Database Migrations
```bash
# For CLI application
# Delete fundimatch.db and re-run seed.py for schema changes
python lib/db/seed.py
```

### Environment Variables
Create `.env` file for sensitive data:
```env
# Firebase Configuration (if using Firebase)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
```

---

## 🧪 Testing

### Web Application Testing
1. **Start JSON server**: `npx json-server --watch db.json --port 3001`
2. **Start development server**: `npm run dev`
3. **Test user flows**:
   - Guest → Client registration → Job creation
   - Guest → Fundi registration → Profile setup
   - Admin login → User management

### CLI Application Testing
1. **Seed database**: `python lib/db/seed.py`
2. **Run CLI**: `python lib/main.py`
3. **Test all user roles**:
   - Guest operations
   - Client job management
   - Fundi profile management
   - Admin system management

---

## 🚀 Deployment

### Web Application Deployment
1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to hosting service**
   - Vercel, Netlify, or Firebase Hosting
   - Update API endpoints for production

### CLI Application Distribution
1. **Create executable**
   ```bash
   pip install pyinstaller
   pyinstaller --onefile lib/main.py
   ```

2. **Distribute executable**
   - Share the generated executable
   - Include database file and dependencies

---

## 📈 Future Enhancements

### Phase 4 Improvements
- **Mobile Application**: React Native or Flutter
- **Real-time Features**: WebSocket integration
- **Payment Integration**: M-Pesa API
- **Location Services**: GPS-based matching
- **Advanced Analytics**: Business intelligence dashboard
- **AI Matching**: Machine learning for better fundi-client matching

### Technical Upgrades
- **Authentication**: JWT tokens and password hashing
- **API Development**: RESTful API with Express.js
- **Cloud Database**: PostgreSQL or MongoDB
- **Performance**: Caching and optimization
- **Security**: Input validation and SQL injection prevention

---

## 📚 Learning Objectives Demonstrated

### Web Development
- ✅ React.js with modern hooks and context
- ✅ Component-based architecture
- ✅ State management and routing
- ✅ API integration and data fetching
- ✅ Responsive design with Tailwind CSS

### Backend Development
- ✅ RESTful API design
- ✅ Database schema design
- ✅ User authentication and authorization
- ✅ Data validation and error handling
- ✅ File upload and storage

### CLI Development
- ✅ Python object-oriented programming
- ✅ SQLAlchemy ORM implementation
- ✅ Command-line interface design
- ✅ Database relationships and queries
- ✅ Error handling and user experience

### Software Engineering
- ✅ Project structure and organization
- ✅ Version control with Git
- ✅ Documentation and comments
- ✅ Testing and debugging
- ✅ Deployment and distribution

---

## 👨‍💻 Author Information

**Name**: Gibson Waheire  
**Email**: g.waheir00@gmail.com  
**School**: Moringa School  
**Phase**: 3 - Full-Stack Development  
**Project**: FundiMatch Platform  

## 📄 License

This project is created for educational purposes under Moringa School's Phase 3 requirements. All code and documentation are provided as-is for learning and demonstration purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support:
- **Email**: g.waheir00@gmail.com
- **GitHub Issues**: Create an issue in the repository

---

**🎉 Thank you for exploring FundiMatch! This project demonstrates the power of combining web development, CLI applications, and database management to solve real-world problems in Kenya's service industry.**
