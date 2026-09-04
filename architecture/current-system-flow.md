# 🏰 Shiv Shakti Events Mart — System Architecture & Flow Specification

> **Target Audience:** AI Engineering Agents, Senior Architects, Full-Stack Developers  
> **Status:** Production / Active  
> **Version:** 2.0.0 (PostgreSQL + Prisma ORM + Express API + React 19 / SCSS)  
> **Repository Root:** `c:\Users\123ch\OneDrive\Desktop\Shiv Shakti\`

---

## 1. Executive Summary & High-Level Architecture

**Shiv Shakti Events Mart** is an end-to-end luxury wedding and event infrastructure platform. It bridges the gap between commercial event suppliers (mandaps, German hangars, luxury banquet furniture, catering equipment, climate control, custom fabrication) and event planners / wedding clients.

The system is structured as a **decoupled client-server architecture**:
- **Frontend SPA (`Project/Shiv-Shakti-Events-Mart`):** Built with **React 19**, **TypeScript**, **Vite**, **React Router v7**, and a custom **SCSS design system** (migrated from Tailwind utility classes to bespoke luxury SCSS modules).
- **Backend REST API (`Backend Project`):** Built with **Node.js (ES Modules)**, **Express.js**, **Prisma ORM**, **PostgreSQL** (with Prisma client abstraction), **JWT & Cookie authentication**, **Google OAuth 2.0 verification**, and **Cloudinary CDN integration**.
- **Media Delivery:** Handled via **Cloudinary API** streaming for direct asset uploads and CDN delivery.

```mermaid
graph TB
    subgraph "Client Layer (Browser / SPA)"
        UI["React 19 SPA (Vite @ port 5173)"]
        Router["React Router v7 (AppRoutes.tsx)"]
        Layout["MainLayout.tsx (Global State & Outlet)"]
        Views["Views: HomePage, LoginPage, CheckoutPage"]
        AdminView["AdminDashboard.tsx (Protected Route)"]
        SCSS["SCSS Design System (variables, mixins, components)"]
    end

    subgraph "Vite Dev / Reverse Proxy"
        Proxy["Vite Proxy ('/api' -> 'http://localhost:5000')"]
    end

    subgraph "API Layer (Express.js @ port 5000)"
        Server["server.js (Express Application)"]
        Middlewares["Middlewares: CORS, Cookies, Morgan, ErrorHandler"]
        AuthMid["authMiddleware (authenticate, optionalAuth, authorize)"]
        
        subgraph "Route Controllers"
            AuthCtrl["authController.js (JWT, Google Auth)"]
            ProdCtrl["productController.js (CRUD + Cloudinary)"]
            OrderCtrl["orderController.js (Orders & Items)"]
            QuoteCtrl["quoteController.js (Bespoke Quotes)"]
            AdminCtrl["adminController.js (KPI Stats, Statuses)"]
            SearchCtrl["searchController.js (Global Search)"]
        end
    end

    subgraph "Data & Cloud Infrastructure"
        Prisma["Prisma ORM (PrismaClient)"]
        Postgres[(PostgreSQL Database)]
        Cloudinary[("Cloudinary Media CDN")]
        GoogleOAuth["Google Identity Services (GSI)"]
    end

    UI --> Router
    Router --> Layout
    Layout --> Views
    Router --> AdminView
    UI -.-> Proxy
    Proxy --> Server
    Server --> Middlewares
    Middlewares --> AuthMid
    AuthMid --> AuthCtrl
    AuthMid --> ProdCtrl
    AuthMid --> OrderCtrl
    AuthMid --> QuoteCtrl
    AuthMid --> AdminCtrl
    AuthMid --> SearchCtrl

    AuthCtrl -.-> GoogleOAuth
    ProdCtrl -.-> Cloudinary
    AuthCtrl --> Prisma
    ProdCtrl --> Prisma
    OrderCtrl --> Prisma
    QuoteCtrl --> Prisma
    AdminCtrl --> Prisma
    SearchCtrl --> Prisma
    Prisma --> Postgres
```

---

## 2. Directory Structure & File Map

```
c:\Users\123ch\OneDrive\Desktop\Shiv Shakti\
├── .gitignore
├── architecture/
│   └── current-system-flow.md            # Master Architecture & Flow Documentation (This File)
│
├── Backend Project/                       # Node.js + Express + Prisma REST API
│   ├── .env                              # Environment variables (DB URL, JWT secrets, Cloudinary keys)
│   ├── .env.example                      # Template for backend environment config
│   ├── package.json                      # Backend dependencies & npm scripts
│   ├── prisma/
│   │   ├── schema.prisma                 # Master Database Schema definition (PostgreSQL)
│   │   └── dev.db                        # SQLite fallback database file (if used locally)
│   └── src/
│       ├── server.js                     # Express app initialization, middleware mounting & server start
│       ├── config/
│       │   └── prisma.js                 # Global PrismaClient singleton instance
│       ├── controllers/
│       │   ├── adminController.js        # KPI overview, admin order/quote management, status transitions
│       │   ├── authController.js         # Register, Login, Google OAuth, Profile, Logout
│       │   ├── orderController.js        # Create order, get user orders, get all orders
│       │   ├── productController.js      # Public product queries, Admin CRUD, Cloudinary streaming upload
│       │   ├── quoteController.js        # Instant Quote generation & retrieval
│       │   └── searchController.js       # Federated global search (posts, orders, quotes)
│       ├── middlewares/
│       │   ├── authMiddleware.js         # JWT cookie/header extraction, user attachment, RBAC guard
│       │   └── errorHandler.js           # Central 404 handler and Global 500 error serializer
│       ├── routes/
│       │   ├── adminRoutes.js            # Admin-protected sub-routes (/api/admin/*)
│       │   ├── authRoutes.js             # Authentication sub-routes (/api/auth/*)
│       │   ├── index.js                  # Master API Router (/api mounting health, search, and sub-routes)
│       │   ├── orderRoutes.js            # Orders sub-routes (/api/orders/*)
│       │   ├── productRoutes.js          # Products sub-routes (/api/products/*)
│       │   └── quoteRoutes.js            # Quotes sub-routes (/api/quotes/*)
│       └── scripts/
│           ├── extract.ts                # Data extraction utility
│           ├── listUsers.js              # CLI script to inspect registered database users
│           ├── makeAdmin.js              # CLI tool: node makeAdmin.js <email> to elevate user role
│           ├── products_seed.json        # Static JSON snapshot of seed products
│           ├── seedProducts.js           # Compiled JavaScript DB seeder
│           └── seedProducts.ts           # TypeScript DB seeder from mockData into PostgreSQL
│
└── Project/
    └── Shiv-Shakti-Events-Mart/          # React 19 + TypeScript + Vite SPA
        ├── index.html                    # Root HTML template (loads Google GSI client script & fonts)
        ├── package.json                  # Frontend dependencies (React 19, Lucide, SASS, Vite)
        ├── vite.config.ts                # Vite dev server configuration + /api reverse proxy
        ├── tsconfig.json / tsconfig.app  # TypeScript configuration
        ├── SCSS_MIGRATION_GUIDE.md       # SCSS design token reference
        └── src/
            ├── main.tsx                  # React DOM entry point (<StrictMode><App /></StrictMode>)
            ├── App.tsx                   # BrowserRouter provider and root AppRoutes mount
            ├── App.css / index.css       # Global CSS reset and SCSS bundle imports
            ├── constants/
            │   ├── categories.ts         # Hierarchical category taxonomy (6 core verticals + 32 subsections)
            │   ├── colors.ts             # Palette definitions (Deep Teal, Warm Gold, Grayscale, Shadows)
            │   ├── index.ts              # Re-export barrel for all constants
            │   └── mockData.ts           # Static catalog seed (~990 products), customizer options, FAQs
            ├── hooks/
            │   ├── useCart.ts            # Cart state, item increment/decrement, shortlist management
            │   ├── useProducts.ts        # Dynamic product fetcher with in-memory TTL caching
            │   └── useToast.ts           # Ephemeral notification toast dispatch system
            ├── layouts/
            │   └── MainLayout.tsx        # Master shell (Header, Mega-Menu, Cart Drawer, Outlet, Footer)
            ├── pages/
            │   ├── admin/
            │   │   ├── AdminDashboard.tsx# Full-featured Admin Portal (KPIs, Products, Orders, Quotes, Upload)
            │   │   └── AdminRoute.tsx    # Role-based route guard verifying ADMIN role before render
            │   ├── checkout/
            │   │   ├── CheckoutPage.tsx  # Multi-method Payment Gateway Simulation & Order Dispatch
            │   │   ├── CheckoutPage.scss # SCSS styling for checkout and order receipt
            │   │   └── CheckoutPage.css  # Compiled CSS
            │   ├── home/
            │   │   └── HomePage.tsx      # Landing page: Hero, Mega Showcase, Catalog, 3D Studio, Quote Wizard
            │   └── login/
            │       ├── LoginPage.tsx     # Privilege Club Login, Signup, Google One-Tap GSI integration
            │       └── LoginPage.scss    # Luxury login modal SCSS styling
            ├── routes/
            │   └── AppRoutes.tsx         # Route tree definition (/admin, /, /login, /checkout)
            ├── services/
            │   └── api.ts                # Type-safe API Client SDK wrapping native fetch with auth headers
            └── styles/
                ├── index.scss            # Master SCSS barrel
                ├── variables.scss        # SCSS design variables (colors, typography, radii, spacing)
                ├── mixins.scss           # SASS mixins (responsive breakpoints, buttons, cards)
                ├── globals.scss          # Base element resets, animations, utility classes
                ├── components.scss       # Header, Hero, Catalog grid, Product cards, Studio styles
                ├── additional.scss       # Quote Wizard, Modals, Drawers, Footers
                └── categories_megamenu.scss # Pepperfry-style Multi-column Mega-Menu dropdown styling
```

---

## 3. Database Schema & Data Models (Prisma ORM)

The database schema is defined in [schema.prisma](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Backend%20Project/prisma/schema.prisma) using **PostgreSQL**.

```mermaid
erDiagram
    User ||--o{ Order : "places"
    User ||--o{ Quote : "requests"
    User ||--o{ Post : "authors"
    Order ||--|{ OrderItem : "contains"

    User {
        String id PK "uuid"
        String email UK
        String name
        String password "bcrypt hash"
        String role "USER | ADMIN"
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        String id PK "uuid"
        String name
        String categoryId "wedding, furniture, catering, etc."
        String subcategoryId "mandaps, tents, chairs, etc."
        String style "Traditional, Modern, Royal, etc."
        Float price
        Float rating "default 4.5"
        Int reviews "default 0"
        String image "URL or Cloudinary"
        String description
        Json features "Array of spec strings"
        Boolean isFeatured "default false"
        String tag "Bestseller, Grand Entry, etc."
        Boolean inStock "default true"
        DateTime createdAt
        DateTime updatedAt
    }

    Order {
        String id PK "uuid"
        String orderNumber UK "e.g. MC-839201"
        String customerName
        String customerEmail
        Float totalAmount
        Float discountAmount "default 0"
        Float grandTotal
        String paymentMethod "card | upi | netbanking"
        String status "CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED"
        String userId FK "nullable (supports guest orders)"
        DateTime createdAt
        DateTime updatedAt
    }

    OrderItem {
        String id PK "uuid"
        String orderId FK
        String itemId "Product ID reference"
        String name
        Float price
        Int quantity "default 1"
        String itemType "events | boutique"
        String image
        DateTime createdAt
    }

    Quote {
        String id PK "uuid"
        String email
        String scale "intimate | premium | royal"
        String venue "banquet | garden | beach | fort | residence"
        String drapes "standard | heavy | glass"
        Float estimated
        String status "PENDING | REVIEWED | APPROVED | REJECTED"
        String userId FK "nullable"
        DateTime createdAt
        DateTime updatedAt
    }

    Post {
        String id PK "uuid"
        String title
        String content
        Boolean published "default false"
        String authorId FK
        DateTime createdAt
        DateTime updatedAt
    }
```

### Key Schema Characteristics
1. **Hybrid Identity System:** Orders and Quotes can be placed either by authenticated `User`s (linked via `userId` foreign key) or by unauthenticated guest users (recording `customerEmail`/`customerName` directly).
2. **Product Flexibility:** Product features are stored as native JSON (`Json features`) allowing dynamic attribute arrays without schema churn.
3. **OrderItem Immutability:** An order snapshot records the item name, price, quantity, and image at the exact moment of order placement. If a product price later updates, historical order integrity is preserved.

---

## 4. Backend REST API Architecture

The backend operates on **Express.js** with ES Module imports (`"type": "module"`).

### 4.1 Global Middleware Pipeline ([server.js](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Backend%20Project/src/server.js))
1. `cors({ origin: true, credentials: true })`: Enables cross-origin requests with cookie passing.
2. `cookieParser()`: Parses HTTP cookies for secure JWT token reading (`req.cookies.token`).
3. `express.json()` & `express.urlencoded({ extended: true })`: Body parsing for payloads up to default limits.
4. `morgan('dev' | 'combined')`: Standardized HTTP request logging.
5. `notFoundHandler`: Catches undefined endpoints and returns structured 404 JSON.
6. `errorHandler`: Centralized error boundary returning `{ success: false, message: ... }` with stack traces in development mode.

### 4.2 Complete API Route Matrix

| Method | Endpoint | Handler Controller | Auth / Guard | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **System** | | | | |
| `GET` | `/` | Anonymous inline | Public | API entry point & version string |
| `GET` | `/api/health` | `index.js` inline | Public | Service health verification |
| `GET` | `/api/search` | `globalSearch` | `optionalAuth` | Federated search across Posts, Orders (scoped), and Quotes (scoped) |
| **Auth** | | | | |
| `POST` | `/api/auth/register` | `authController.register` | Public | Register new user, hashes password with bcrypt, sets JWT cookie |
| `POST` | `/api/auth/login` | `authController.signIn` | Public | Validate credentials, returns token & sets HTTP-only cookie |
| `POST` | `/api/auth/signin` | `authController.signIn` | Public | Alias for `/login` |
| `POST` | `/api/auth/google-login`| `authController.googleLogin` | Public | Verifies Google ID token via `google-auth-library`, auto-provisions user |
| `GET` | `/api/auth/google-client-id` | `authController.getGoogleClientId` | Public | Returns server-configured `GOOGLE_CLIENT_ID` for frontend GSI init |
| `POST` | `/api/auth/logout` | `authController.signOut` | Public | Clears `token` HTTP-only cookie |
| `POST` | `/api/auth/signout` | `authController.signOut` | Public | Alias for `/logout` |
| `GET` | `/api/auth/me` | `authController.getProfile` | `authenticate` | Returns logged-in user profile payload |
| **Products** | | | | |
| `GET` | `/api/products` | `productController.getProducts` | Public | Query products with category, subcategory, style, search, and pagination |
| `GET` | `/api/products/:id` | `productController.getProductById` | Public | Single product details |
| `POST` | `/api/products` | `productController.createProduct` | `authenticate`, `authorize('ADMIN')` | Create a new product entry |
| `PUT` | `/api/products/:id` | `productController.updateProduct` | `authenticate`, `authorize('ADMIN')` | Update existing product details |
| `DELETE` | `/api/products/:id` | `productController.deleteProduct` | `authenticate`, `authorize('ADMIN')` | Delete a product |
| `POST` | `/api/products/upload-image` | `productController.uploadImage` | `authenticate`, `authorize('ADMIN')` | Multer memory upload -> Cloudinary CDN stream |
| **Orders** | | | | |
| `POST` | `/api/orders` | `orderController.createOrder` | `optionalAuth` | Create new order (guest or authenticated user) |
| `GET` | `/api/orders/my-orders` | `orderController.getMyOrders` | `authenticate` | Get authenticated user's order history |
| `GET` | `/api/orders` | `orderController.getAllOrders` | Public / Admin | Get all system orders |
| **Quotes** | | | | |
| `POST` | `/api/quotes` | `quoteController.createQuote` | `optionalAuth` | Submit a bespoke event decor quote request |
| `GET` | `/api/quotes` | `quoteController.getAllQuotes` | Public / Admin | Get all submitted quotes |
| **Admin** | | | | |
| `GET` | `/api/admin/stats` | `adminController.getStats` | `authenticate`, `authorize('ADMIN')` | Aggregated dashboard metrics & recent orders |
| `GET` | `/api/admin/orders` | `adminController.getAllOrders` | `authenticate`, `authorize('ADMIN')` | Paginated admin order view with user relations |
| `GET` | `/api/admin/quotes` | `adminController.getAllQuotes` | `authenticate`, `authorize('ADMIN')` | Paginated admin quote view |
| `PATCH` | `/api/admin/quotes/:id/status` | `adminController.updateQuoteStatus` | `authenticate`, `authorize('ADMIN')` | Update quote status (`PENDING`, `REVIEWED`, etc.) |
| `PATCH` | `/api/admin/orders/:id/status` | `adminController.updateOrderStatus` | `authenticate`, `authorize('ADMIN')` | Update order status (`CONFIRMED`, `SHIPPED`, etc.) |

### 4.3 Security & Authentication Engine ([authMiddleware.js](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Backend%20Project/src/middlewares/authMiddleware.js))

The authentication engine operates with a **dual-token discovery mechanism**:
1. **Cookie Inspection:** Checks `req.cookies.token` (Set with `httpOnly: true`, `sameSite: 'lax'`).
2. **Bearer Header Fallback:** Checks `req.headers.authorization` for `Bearer <token>` (useful for mobile clients, scripts, or explicit token passing).

```mermaid
flowchart TD
    Req[Incoming HTTP Request] --> CheckToken{Token in Cookie or Header?}
    CheckToken -- No --> OptionalCheck{Is Route optionalAuth?}
    OptionalCheck -- Yes --> NextGuest[req.user = null -> proceed as Guest]
    OptionalCheck -- No --> Deny401[401 Unauthorized: No token provided]

    CheckToken -- Yes --> VerifyJWT{jwt.verify with JWT_SECRET}
    VerifyJWT -- Invalid/Expired --> TokenErr{Is Route optionalAuth?}
    TokenErr -- Yes --> NextGuest
    TokenErr -- No --> Deny401Expired[401 Unauthorized: Invalid or expired token]

    VerifyJWT -- Valid --> FetchUser[Prisma: findUnique user by ID]
    FetchUser -- User Not Found --> Deny401User[401 Unauthorized: User no longer exists]
    FetchUser -- Found --> AttachUser[req.user = user]
    AttachUser --> RoleGuard{Is authorize role specified?}
    RoleGuard -- No (Public/Private) --> Proceed[next -> Execute Controller]
    RoleGuard -- Yes (e.g. ADMIN) --> CheckRole{user.role == requiredRole?}
    CheckRole -- Yes --> Proceed
    CheckRole -- No --> Deny403[403 Forbidden: Insufficient permissions]
```

---

## 5. Frontend Architecture & State Management

### 5.1 Component Tree & Routing ([AppRoutes.tsx](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Project/Shiv-Shakti-Events-Mart/src/routes/AppRoutes.tsx))

```
App.tsx
└── BrowserRouter
    └── AppRoutes
        ├── Route: /admin  ──> AdminRoute ──> AdminDashboard (Isolated fullscreen admin cockpit)
        └── Route: /       ──> MainLayout (Site Header, Mega-Menu, Cart Drawer, Footer)
            ├── Route: index (/)      ──> HomePage (Hero, Mega Showcase, Catalog, 3D Studio, Wizard)
            ├── Route: login (/login) ──> LoginPage (Privilege Login & Google Auth)
            └── Route: checkout (/checkout) ──> CheckoutPage (Payment processing & confirmation)
```

### 5.2 Global Layout Context (`useOutletContext`)

[MainLayout.tsx](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Project/Shiv-Shakti-Events-Mart/src/layouts/MainLayout.tsx) is the master container for the consumer-facing application. Rather than introducing third-party state managers like Redux or Zustand, state is managed via React primitives (`useState`, `useCallback`, `useRef`) and broadcast to child pages using React Router's `<Outlet context={...} />`.

```mermaid
graph TD
    subgraph "MainLayout State Container"
        CartState["Cart State: cart, handleAddToCart, handleDecrementCart, handleRemoveFromCart"]
        ShortlistState["Shortlist State: shortlist, handleToggleShortlist"]
        UserState["User State: currentUser, setCurrentUser (Restored via /api/auth/me)"]
        NavState["Nav State: selectedCategory, selectedSubcategory, selectedStyleFilter"]
        SearchState["Search State: searchQuery, debouncedQuery, globalSearchResults"]
        CatalogHook["useProducts Hook: products, isLoadingProducts, refetchProducts"]
        ToastHook["useToast Hook: toastMessage, showToast"]
    end

    MainLayout -->|Outlet Context| HomePage
    MainLayout -->|Outlet Context| LoginPage
    MainLayout -->|Outlet Context| CheckoutPage

    HomePage -.->|Dispatches| CartState
    HomePage -.->|Reads/Filters| CatalogHook
    HomePage -.->|Updates| NavState
    CheckoutPage -.->|Consumes & Clears| CartState
    LoginPage -.->|Sets| UserState
```

### 5.3 High-Performance Data Fetching & In-Memory Cache ([useProducts.ts](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Project/Shiv-Shakti-Events-Mart/src/hooks/useProducts.ts))

The platform catalog contains hundreds of high-res event staging elements. To prevent redundant network calls on page navigation:
- An in-memory cache (`cachedProducts`) stores the complete dataset with a **5-minute Time-To-Live (TTL)**.
- `useProducts()` serves immediate cached results when available.
- When an administrator modifies or creates products in the `AdminDashboard`, `invalidateProductCache()` is triggered, immediately zeroing the cache and forcing a fresh fetch.

### 5.4 Progressive Batch Catalog Pagination

To guarantee smooth 60 FPS rendering of hundreds of product cards on the `HomePage`:
- Items are filtered in memory via `useMemo` (`displayedItems`).
- A progressive batch limiter (`visibleCount`, default 24) renders only the visible slice (`displayedItems.slice(0, visibleCount)`).
- A luxury progress bar shows percentage loaded, with an intuitive `Load More Products (+24)` button.

---

## 6. Core Subsystems & User Flow Walkthroughs

### 6.1 Flow 1: E-Commerce Catalog Browsing, Filtering & Checkout

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Event Planner
    participant Header as MainLayout (Mega-Menu / Search)
    participant Home as HomePage (Catalog Grid)
    participant Cart as useCart Hook
    participant Checkout as CheckoutPage
    participant API as orderApi (/api/orders)
    participant DB as PostgreSQL (Prisma)

    Customer->>Header: Hovers over 'Wedding' in Category Navbar
    Header-->>Customer: Displays Pepperfry-style Mega-Menu with 7 subcategories & promo card
    Customer->>Header: Clicks 'Mandaps' subsection
    Header->>Home: Sets selectedCategory='wedding', selectedSubcategory='mandaps'
    Home->>Home: Filters displayed products & resets visibleCount to 24
    Customer->>Home: Clicks "Add to Order" on 'Royal Marigold Mandap'
    Home->>Cart: handleAddToCart(product, 'events')
    Cart-->>Customer: Shows Toast: '"Royal Marigold Mandap" added to booking cart! ✨'
    Customer->>Header: Clicks Cart Icon -> Opens Cart Drawer
    Customer->>Header: Clicks "Checkout and Secure Slots"
    Header->>Checkout: Navigates to /checkout
    Customer->>Checkout: Enters details / Applies promo 'ROYALMAJESTY' (₹15,000 off)
    Customer->>Checkout: Clicks "Pay & Confirm Booking"
    Checkout->>API: POST /api/orders (Customer details, items, amounts, paymentMethod)
    API->>DB: prisma.order.create (creates Order and nested OrderItems)
    DB-->>API: Returns created Order with orderNumber (e.g. 'MC-492018')
    API-->>Checkout: 201 Created { success: true, data: { order } }
    Checkout->>Cart: clearCart()
    Checkout-->>Customer: Displays confirmed booking screen with order reference
```

---

### 6.2 Flow 2: 3D Interactive Stage & Mandap Studio (Live Customizer)

```mermaid
sequenceDiagram
    autonumber
    actor User as Client
    participant Studio as HomePage (#studio Customizer)
    participant Toast as useToast Hook

    User->>Studio: Selects Venue: 'Palace Courtyard'
    Studio->>Studio: Updates preview backdrop image
    User->>Studio: Selects Floral Theme: 'Crimson Velvet & Brass' (+₹35,000)
    Studio->>Studio: Rerenders SVG/CSS gradient curtains to rich crimson velvet
    User->>Studio: Selects Couple Seating: 'Teakwood Royal Swing' (+₹12,000)
    Studio->>Studio: Updates central seating emoji & typography label
    Studio->>Studio: Dynamically computes customizerTotalPrice (Base ₹85,000 + ₹35,000 + ₹12,000 = ₹1,32,000)
    User->>Studio: Clicks 'Book Custom Setup' / 'Shortlist'
    Studio->>Toast: showToast("✨ Bespoke design saved successfully!...")
    Studio-->>User: Toggles button state to '✓ Saved'
```

---

### 6.3 Flow 3: 3-Step Instant Cost Estimator (Quote Wizard)

```mermaid
sequenceDiagram
    autonumber
    actor User as Client
    participant Wizard as HomePage (#wizard Section)
    participant API as quoteApi (/api/quotes)
    participant DB as PostgreSQL (Prisma)

    User->>Wizard: Step 1: Selects Scale: 'Premium (200 - 600 Guests)'
    User->>Wizard: Step 2: Selects Venue: 'Indoor Banquet Hall'
    User->>Wizard: Step 3: Selects Drapes: 'Heavy Velvet, Orchid Arches' & inputs email
    User->>Wizard: Clicks "Request Proposal & Pricing"
    Wizard->>API: POST /api/quotes { email, scale, venue, drapes, estimated }
    API->>DB: prisma.quote.create ({ email, scale, venue, drapes, estimated, status: 'PENDING' })
    DB-->>API: Quote record created
    API-->>Wizard: 201 Created { success: true, data: { quote } }
    Wizard-->>User: Displays completed proposal card + Toast notification
```

---

### 6.4 Flow 4: Authentication & Google Identity Services (GSI)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Login as LoginPage
    participant Google as Google Identity Services
    participant API as authApi (/api/auth)
    participant DB as PostgreSQL (Prisma)

    alt Standard Email/Password
        User->>Login: Enters email & password -> Clicks Sign In
        Login->>API: POST /api/auth/login { email, password }
        API->>DB: prisma.user.findUnique({ where: { email } })
        API->>API: bcrypt.compare(password, user.password)
        API->>API: jwt.sign({ id: user.id })
        API-->>Login: Sets HTTP-Only Cookie + Returns { user, token }
        Login-->>User: Redirects to Home with privilege state
    else Google One-Tap / Button Login
        Login->>API: GET /api/auth/google-client-id
        API-->>Login: Returns GOOGLE_CLIENT_ID
        Login->>Google: Initializes google.accounts.id with client_id
        User->>Google: Selects Google Account
        Google-->>Login: Returns JWT credential string
        Login->>API: POST /api/auth/google-login { credential }
        API->>Google: OAuth2Client.verifyIdToken({ idToken, audience })
        Google-->>API: Returns payload { email, name }
        API->>DB: findUnique or create User record
        API->>API: jwt.sign({ id: user.id })
        API-->>Login: Sets HTTP-Only Cookie + Returns { user, token }
        Login-->>User: Redirects to Home with privilege state
    end
```

---

### 6.5 Flow 5: Admin Management & Direct Cloudinary Asset Upload

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant Guard as AdminRoute.tsx
    participant Dash as AdminDashboard.tsx
    participant ProdAPI as productApi (/api/products)
    participant AdminAPI as adminApi (/api/admin)
    participant Cloudinary as Cloudinary API
    participant Cache as useProducts (Cache Invalidator)
    participant DB as PostgreSQL (Prisma)

    Admin->>Guard: Navigates to /admin
    Guard->>Guard: Verifies user.role === 'ADMIN'
    Guard->>Dash: Renders Admin Dashboard
    Dash->>AdminAPI: GET /api/admin/stats
    AdminAPI->>DB: Aggregates revenue, product/order/quote counts
    DB-->>Dash: Displays KPI metric cards & recent activity
    
    alt Image Upload to Cloudinary
        Admin->>Dash: Drops image file into Upload Panel
        Dash->>ProdAPI: POST /api/products/upload-image (FormData)
        ProdAPI->>Cloudinary: Streams buffer to 'shiv-shakti-events' folder
        Cloudinary-->>ProdAPI: Returns secure CDN URL (https://res.cloudinary.com/...)
        ProdAPI-->>Dash: Returns image URL
        Dash-->>Admin: Copies CDN URL to clipboard + populates form
    end

    alt Product Creation / Edit
        Admin->>Dash: Submits Product Form (Name, Price, Category, Features, Image URL)
        Dash->>ProdAPI: POST /api/products or PUT /api/products/:id
        ProdAPI->>DB: prisma.product.create / update
        DB-->>ProdAPI: Product saved
        ProdAPI-->>Dash: 200/201 Success
        Dash->>Cache: invalidateProductCache()
        Dash-->>Admin: Updates product table + Toast notification
    end
```

---

## 7. Configuration & Environment Reference

### 7.1 Backend Environment Variables (`Backend Project/.env`)

```ini
# Server Port & Environment
PORT=5000
NODE_ENV=development

# Database Connection (PostgreSQL Connection String)
DATABASE_URL="postgresql://postgres:password@localhost:5432/shiv_shakti_db?schema=public"

# JWT Authentication
JWT_SECRET="super_secret_jwt_encryption_key_production_grade"
JWT_EXPIRES_IN="1d"

# Google Identity Services (OAuth2)
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

### 7.2 Frontend Reverse Proxy Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

## 8. Seeding & Database Migration Playbook

### Running Database Migrations
```bash
cd "Backend Project"

# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Database Migrations
npm run prisma:migrate
```

### Seeding Catalog Products (~990 Items)
```bash
cd "Backend Project"

# Run TypeScript Seed script via tsx
npx tsx src/scripts/seedProducts.ts
```

### Promoting a User to Admin
```bash
cd "Backend Project"

# Run Admin promotion CLI tool
node src/scripts/makeAdmin.js user@example.com
```

---

## 9. AI Developer Guide: Extending the System

When writing new features for this codebase, follow these established rules:

1. **Adding a New Category / Subcategory:**
   - Add category metadata to [categories.ts](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Project/Shiv-Shakti-Events-Mart/src/constants/categories.ts).
   - Ensure products in DB have matching `categoryId` and `subcategoryId`.
2. **Adding a New API Endpoint:**
   - Create the handler in `src/controllers/<domain>Controller.js`.
   - Mount the route in `src/routes/<domain>Routes.js` with appropriate middleware (`authenticate`, `authorize('ADMIN')`, or `optionalAuth`).
   - Add the typed fetch method in `Project/Shiv-Shakti-Events-Mart/src/services/api.ts`.
3. **Modifying Styles:**
   - Do NOT introduce utility-first class frameworks. Use existing SASS variables in `src/styles/variables.scss` and mixins in `src/styles/mixins.scss`.
   - Maintain the Deep Teal (`#0f2f2f`, `#1a4d4d`) and Warm Gold (`#d4af37`) luxury aesthetic.
4. **Cache Invalidation:**
   - Whenever adding an administrative action that mutates the catalog, always invoke `invalidateProductCache()` from [useProducts.ts](file:///c:/Users/123ch/OneDrive/Desktop/Shiv%20Shakti/Project/Shiv-Shakti-Events-Mart/src/hooks/useProducts.ts) to guarantee immediate user visibility without cache lag.
