# 🛒 PaySphere — Full-Stack E-Commerce Platform

**PaySphere** is a modern, full-stack e-commerce web application built with **Next.js 15**, **Firebase Authentication**, **MySQL (Aiven Cloud)**, **Razorpay Payments**, and **Redux Toolkit**. It features a customer storefront, a seller dashboard, and an admin panel — all in one unified platform.

---

## ✨ Features

### 🛍️ Customer-Facing Storefront
- **Product Browsing** — Browse products by category, search by name, and view detailed product pages
- **Shopping Cart** — Add/remove items with quantity controls, persisted in `localStorage` via Redux
- **Order Placement** — Checkout with address selection, coupon codes, and payment method choice
- **User Authentication** — Sign up / Sign in with Email & Password or Google OAuth via Firebase
- **Email Verification** — Accounts require email verification before login is allowed
- **Order History** — View past orders with status tracking (Placed → Processing → Shipped → Delivered)
- **User Profile** — View and manage profile information and saved addresses
- **Newsletter Subscription** — Subscribe to receive updates via email
- **Ratings & Reviews** — Rate and review purchased products

### 🏪 Seller (Store) Dashboard
- **Store Registration** — Apply to become a seller with store details submitted for admin approval
- **Seller Dashboard** — View total products, earnings, orders, and customer reviews at a glance
- **Product Management** — Add new products and manage existing inventory
- **Order Management** — Track and manage incoming orders

### 🔐 Admin Panel
- **Admin Dashboard** — Overview with total products, revenue, orders, and stores with area chart visualization
- **Store Approval** — Review and approve/reject seller store applications
- **Coupon Management** — Create and manage discount coupons
- **Store Management** — View and manage all registered stores

### 💳 Payments
- **Cash on Delivery (COD)** — Place orders without upfront payment
- **Razorpay Integration** — Secure online payments with signature verification
- **Webhook Support** — Server-side Razorpay webhooks for reliable payment confirmation
- **Payments Tracking** — All transactions recorded in a dedicated `Payments` table

### 📧 Notifications
- **Order Confirmation Emails** — Automated emails sent on successful order placement via Nodemailer
- **Newsletter Emails** — Confirmation emails on newsletter subscription
- **Twilio Integration** — SMS notification support (configured, ready for use)

---

## 🛠️ Tech Stack

| Layer          | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| **Framework**  | [Next.js 15](https://nextjs.org/) (App Router, Turbopack)       |
| **Frontend**   | React 19, Redux Toolkit, React Redux                             |
| **Styling**    | Tailwind CSS 4, Outfit (Google Font)                              |
| **Auth**       | Firebase Authentication (Email/Password + Google OAuth)          |
| **Database**   | MySQL (Aiven Cloud) via `mysql2/promise`                         |
| **Payments**   | Razorpay (Checkout + Webhooks)                                   |
| **Email**      | Nodemailer (Gmail SMTP)                                          |
| **SMS**        | Twilio (configured)                                              |
| **Icons**      | Lucide React                                                      |
| **Charts**     | Recharts                                                          |
| **Toasts**     | React Hot Toast                                                   |
| **Passwords**  | bcryptjs                                                          |
| **Dates**      | date-fns                                                          |

---

## 📁 Project Structure

```
PaySphere/
├── app/
│   ├── (public)/                  # Public-facing pages (with Navbar & Footer)
│   │   ├── page.jsx               # Homepage (Hero, Latest, Best Selling, Specs, Newsletter)
│   │   ├── layout.jsx             # Public layout (Banner + Navbar + Footer)
│   │   ├── cart/                   # Shopping cart page
│   │   ├── shop/                   # Product listing / search page
│   │   │   └── [username]/        # Store-specific product listing
│   │   ├── product/[productId]/   # Product detail page
│   │   ├── create-store/          # Seller store registration form
│   │   ├── pricing/               # Pricing / membership page
│   │   ├── orders/                # User order history
│   │   └── loading/               # Loading skeleton
│   ├── admin/                     # Admin panel
│   │   ├── page.jsx               # Admin dashboard (stats + area chart)
│   │   ├── layout.jsx             # Admin layout (sidebar + navbar)
│   │   ├── approve/               # Store approval management
│   │   ├── coupons/               # Coupon management
│   │   └── stores/                # Store management
│   ├── store/                     # Seller dashboard
│   │   ├── page.jsx               # Seller dashboard (stats + reviews)
│   │   ├── layout.jsx             # Store layout (sidebar + navbar)
│   │   ├── add-product/           # Add new product page
│   │   ├── manage-product/        # Manage existing products
│   │   └── orders/                # Seller order management
│   ├── login/                     # Authentication page (Sign in / Sign up)
│   ├── profile/                   # User profile page
│   ├── orders/                    # User orders page
│   ├── settings/                  # User settings page
│   ├── api/                       # API Routes (backend)
│   │   ├── register/              # POST — User registration (sync to MySQL)
│   │   ├── profile/               # GET — Fetch user profile + addresses
│   │   │   └── edit/              # Profile editing endpoint
│   │   ├── addresses/             # POST/PUT — Create/update addresses
│   │   ├── orders/
│   │   │   ├── create/            # POST — Create order + Razorpay order
│   │   │   ├── verify/            # POST — Verify Razorpay payment signature
│   │   │   └── user/              # GET — Fetch user's orders with items
│   │   ├── newsletter/            # POST — Newsletter subscription
│   │   └── webhooks/
│   │       └── razorpay/          # POST — Razorpay payment webhook
│   ├── StoreProvider.js           # Redux Provider + localStorage cart persistence
│   ├── layout.jsx                 # Root layout (Outfit font, Toaster, StoreProvider)
│   └── globals.css                # Global styles
├── components/
│   ├── Navbar.jsx                 # Main navigation bar with search, cart, user menu
│   ├── Hero.jsx                   # Hero banner section
│   ├── Banner.jsx                 # Top promotional banner
│   ├── Footer.jsx                 # Site footer with links and social icons
│   ├── ProductCard.jsx            # Product card component
│   ├── ProductDetails.jsx         # Product detail view
│   ├── ProductDescription.jsx     # Product description tab
│   ├── OrderSummary.jsx           # Checkout summary with payment & address selection
│   ├── OrderItem.jsx              # Individual order item display
│   ├── OrdersAreaChart.jsx        # Recharts area chart for admin dashboard
│   ├── AddressModal.jsx           # Modal for adding/editing addresses
│   ├── RatingModal.jsx            # Modal for submitting product ratings
│   ├── Rating.jsx                 # Star rating display
│   ├── Counter.jsx                # Quantity counter component
│   ├── Newsletter.jsx             # Newsletter subscription section
│   ├── BestSelling.jsx            # Best selling products section
│   ├── LatestProducts.jsx         # Latest products section
│   ├── OurSpec.jsx                # Specifications / features section
│   ├── CategoriesMarquee.jsx      # Scrolling categories marquee
│   ├── AuthProvider.jsx           # Firebase auth state listener → Redux
│   ├── Loading.jsx                # Loading spinner component
│   ├── PageTitle.jsx              # Page title component
│   ├── Title.jsx                  # Section title component
│   ├── admin/                     # Admin-specific components
│   │   ├── AdminLayout.jsx        # Admin layout wrapper (auth check)
│   │   ├── AdminNavbar.jsx        # Admin top navbar
│   │   ├── AdminSidebar.jsx       # Admin sidebar navigation
│   │   └── StoreInfo.jsx          # Store information display
│   ├── store/                     # Seller-specific components
│   │   ├── StoreLayout.jsx        # Store layout wrapper (seller check)
│   │   ├── StoreNavbar.jsx        # Store dashboard top navbar
│   │   └── StoreSidebar.jsx       # Store sidebar navigation
│   └── emails/                    # Email template components (React Email)
├── lib/
│   ├── db.js                      # MySQL connection pool (mysql2/promise)
│   ├── firebase.js                # Firebase app initialization + auth export
│   ├── email.js                   # Email utilities (order confirmation + newsletter)
│   ├── store.js                   # Redux store configuration
│   └── features/                  # Redux Toolkit slices
│       ├── auth/authSlice.js      # Auth state (login, logout, authLoading)
│       ├── cart/cartSlice.js      # Cart state (add, remove, delete, clear, set)
│       ├── product/productSlice.js # Product state management
│       ├── address/addressSlice.js # Address list state management
│       └── rating/ratingSlice.js  # Rating state management
├── assets/
│   ├── assets.js                  # Dummy product data, store data, images export
│   └── *.png / *.jpg / *.webp     # Static images (products, hero, profiles, etc.)
├── schema.sql                     # MySQL database schema (7 tables)
├── run_schema.mjs                 # Script to execute schema.sql against the database
├── package.json                   # Dependencies and scripts
├── next.config.mjs                # Next.js configuration (unoptimized images)
├── postcss.config.mjs             # PostCSS configuration for Tailwind
└── jsconfig.json                  # Path aliases (@/)
```

---

## 🗄️ Database Schema

The MySQL database (`paysphere`) consists of **7 tables**:

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Users   │────▶│  Stores  │────▶│ Products │
└──────────┘     └──────────┘     └──────────┘
     │                                  │
     ▼                                  │
┌──────────┐     ┌──────────┐          │
│Addresses │     │  Orders  │◀─────────┘
└──────────┘     └──────────┘
                      │
              ┌───────┴───────┐
              ▼               ▼
        ┌──────────┐   ┌──────────┐
        │OrderItems│   │ Payments │
        └──────────┘   └──────────┘
```

| Table         | Description                                             |
| ------------- | ------------------------------------------------------- |
| `Users`       | User accounts with bcrypt-hashed passwords              |
| `Stores`      | Seller stores with approval status (`pending/approved/rejected`) |
| `Products`    | Product catalog with MRP, price, images (JSON), category |
| `Addresses`   | User shipping addresses                                 |
| `Orders`      | Orders with status tracking and payment method           |
| `OrderItems`  | Line items for each order (composite PK: order + product) |
| `Payments`    | Payment records from Razorpay with transaction IDs       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MySQL** database (or [Aiven Cloud](https://aiven.io/) managed MySQL)
- **Firebase** project (for authentication)
- **Razorpay** account (for payment processing)
- **Gmail App Password** (for email notifications)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PaySphere.git
cd PaySphere
```

### 2. Install Dependencies

```bash
npm install
```


### 3. Set Up the Database

Run the schema migration script to create all tables:

```bash
node run_schema.mjs
```

This executes `schema.sql` which creates the `paysphere` database and all 7 tables.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| `POST` | `/api/register`              | Register a new user (sync to MySQL)  |
| `GET`  | `/api/profile?uid=`          | Fetch user profile + addresses       |
| `POST` | `/api/addresses`             | Create a new shipping address        |
| `PUT`  | `/api/addresses`             | Update an existing address           |
| `POST` | `/api/orders/create`         | Place a new order (COD or Razorpay)  |
| `POST` | `/api/orders/verify`         | Verify Razorpay payment signature    |
| `GET`  | `/api/orders/user?uid=`      | Get all orders for a user            |
| `POST` | `/api/newsletter`            | Subscribe to newsletter              |
| `POST` | `/api/webhooks/razorpay`     | Razorpay payment webhook handler     |

---

## 💳 Payment Flow

### COD (Cash on Delivery)
1. User places order → Order saved to DB with `is_paid = FALSE`
2. Confirmation email sent to user
3. Order appears in user's order history

### Razorpay (Online Payment)
1. User places order → Order saved to DB → Razorpay order created server-side
2. Razorpay checkout opens in the browser
3. On successful payment → Frontend calls `/api/orders/verify` with payment details
4. Server verifies the HMAC signature → Updates order to `is_paid = TRUE`
5. Payment record inserted into `Payments` table
6. Confirmation email sent to user
7. **Webhook backup:** Razorpay also sends `payment.captured` / `order.paid` events to `/api/webhooks/razorpay` for reliability

---

## 🔐 Authentication Flow

1. **Sign Up:** User creates account via Firebase → Profile synced to MySQL via `/api/register` → Verification email sent → User must verify before login
2. **Sign In:** Firebase email/password or Google OAuth → `onAuthStateChanged` listener updates Redux auth state → Only verified emails are allowed
3. **State Management:** Firebase auth state is observed globally via `AuthProvider` component, dispatching `login`/`logout` actions to Redux

---

## 🧩 State Management (Redux Toolkit)

| Slice      | Purpose                                           |
| ---------- | ------------------------------------------------- |
| `auth`     | Login state, user info, auth loading flag         |
| `cart`     | Cart items (product ID → quantity map), persisted in localStorage |
| `product`  | Product data state                                |
| `address`  | User's address list                               |
| `rating`   | Product rating state                              |

The Redux store is created per-request (via `makeStore()`) and wrapped with a `StoreProvider` that also handles cart persistence to/from `localStorage`.

---

## 📜 Available Scripts

| Script            | Command           | Description                          |
| ----------------- | ----------------- | ------------------------------------ |
| Development       | `npm run dev`     | Start dev server with Turbopack      |
| Build             | `npm run build`   | Create production build              |
| Start             | `npm start`       | Start production server              |
| Lint              | `npm run lint`    | Run Next.js linting                  |
| Run DB Schema     | `node run_schema.mjs` | Execute database migrations     |

---

## 📄 License

This project is private and not currently published under an open-source license.

---

<p align="center">
  Built with ❤️ using Next.js, Firebase, MySQL & Razorpay
</p>
