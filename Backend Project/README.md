# Node.js Express REST API Starter

A production-ready Node.js REST API boilerplate built with **Express.js (ES Modules)**, **Prisma ORM**, **JWT Authentication**, and **Morgan Logging**.

## 🚀 Features

- **ES Modules (`import`/`export`)**: Native modern JavaScript syntax.
- **Prisma ORM**: Type-safe database queries with schema migrations (PostgreSQL / MySQL / SQLite).
- **JWT & bcryptjs Authentication**: Secure user registration, password hashing, and token-based protected routes.
- **Robust Error Handling**: Centralized error and 404 middleware.
- **Morgan Logger & CORS**: Standard request logging and cross-origin resource sharing support.
- **Clean Project Structure**: Organized into controllers, routes, middlewares, and configurations.

---

## 📁 Project Structure

```
.
├── prisma/
│   └── schema.prisma         # Prisma database schema
├── src/
│   ├── config/
│   │   └── prisma.js         # Prisma client instance
│   ├── controllers/
│   │   └── authController.js # Authentication logic (register, login, profile)
│   ├── middlewares/
│   │   ├── authMiddleware.js # JWT verification & role authorization
│   │   └── errorHandler.js   # Global error & 404 handlers
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoint definitions
│   │   └── index.js          # Master API router
│   └── server.js             # Express app setup & listener
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` with your database credentials and secrets:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/backend_db?schema=public"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="1d"
```

### 3. Database Migration & Prisma Client
When your database is running, generate the client and apply migrations:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate
```

### 4. Start the Application
```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Welcome message | Public |
| `GET` | `/api/health` | Service health check | Public |
| `POST` | `/api/auth/register` | Register user (`name`, `email`, `password`) | Public |
| `POST` | `/api/auth/signin` | Sign in user (`email`, `password`) | Public |
| `POST` | `/api/auth/login` | Alias for `/api/auth/signin` | Public |
| `POST` | `/api/auth/signout` | Sign out user & clear cookie | Public |
| `POST` | `/api/auth/logout` | Alias for `/api/auth/signout` | Public |
| `GET` | `/api/auth/me` | Current user profile | Bearer Token / Cookie |
