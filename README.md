# 🍢 Veer Ji Malai Chaap Wale — Food Delivery Website

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Vipin--Gupta--07-181717?logo=github)](https://github.com/Vipin-Gupta-07)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-FF6B35?logo=vercel)](https://veerji-chaap-food-delivery.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://veerji-chaap-food-delivery.vercel.app)

A **fully production-ready** food delivery website for **Veer Ji Malai Chaap Wale**, F Block, Noida.
Built with Next.js 14, Tailwind CSS, Framer Motion, Zustand, and MongoDB.

---------


## 🌐 Live Demo

👉 **[https://veerji-chaap-food-delivery.vercel.app](https://veerji-chaap-food-delivery.vercel.app)**

💻 **GitHub:** [https://github.com/Vipin-Gupta-07/veerji-food-delivery](https://github.com/Vipin-Gupta-07/veerji-food-delivery)

---

## ⚠️ Legal Notice

> Menu data, descriptions, and pricing are extracted/researched from the public Swiggy listing of Veer Ji Malai Chaap Wale for **DEMO/EDUCATIONAL purposes only**.
> Images are sourced from Unsplash (royalty-free). Do not use this project commercially without permission from the restaurant.
> Web scraping Swiggy may violate their Terms of Service. Use the scraper only for personal/educational use.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, React 18 |
| Styling | Tailwind CSS, custom CSS |
| Animation | Framer Motion |
| State | Zustand (cart + auth) |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Scraping | Puppeteer + Cheerio |
| Fonts | Baloo 2 (display) + Nunito (body) |

---

## 📁 Project Structure

```
veerji-food-delivery/
├── app/
│   ├── layout.tsx              # Root layout with Navbar, CartSidebar, Toaster
│   ├── globals.css             # Global styles + Tailwind
│   ├── page.tsx                # Home page (hero, bestsellers, features)
│   ├── restaurant/page.tsx     # Full menu with search & category filter
│   ├── cart/page.tsx           # Cart page
│   ├── checkout/page.tsx       # Checkout with address + payment
│   ├── order-success/page.tsx  # Order success + tracking
│   ├── login/page.tsx          # Auth: Login
│   ├── signup/page.tsx         # Auth: Sign Up
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── menu/page.tsx       # Menu CRUD management
│   │   └── orders/page.tsx     # Order management
│   └── api/
│       ├── menu/route.ts       # GET, POST /api/menu
│       ├── menu/[id]/route.ts  # GET, PUT, DELETE /api/menu/:id
│       ├── orders/route.ts     # GET, POST /api/orders
│       ├── orders/[id]/route.ts# GET, PATCH /api/orders/:id
│       ├── auth/
│       │   ├── login/route.ts  # POST /api/auth/login
│       │   └── signup/route.ts # POST /api/auth/signup
│       ├── admin/
│       │   ├── menu/route.ts   # Admin-protected menu API
│       │   └── orders/route.ts # Admin orders + stats
│       └── scrape-swiggy/route.ts # Seed from extracted data
├── components/
│   ├── Navbar.tsx              # Sticky responsive navbar
│   ├── CartSidebar.tsx         # Slide-in cart sidebar
│   ├── BottomCartBar.tsx       # Mobile bottom cart bar
│   └── FoodCard.tsx            # Food item card with add-to-cart
├── models/
│   ├── User.ts                 # User schema
│   ├── Restaurant.ts           # Restaurant schema
│   ├── MenuItem.ts             # Menu item schema (full-text indexed)
│   ├── Category.ts             # Category schema
│   ├── Cart.ts                 # Cart schema
│   └── Order.ts                # Order schema
├── store/
│   ├── cartStore.ts            # Zustand cart (persisted to localStorage)
│   └── authStore.ts            # Zustand auth (persisted to localStorage)
├── lib/
│   ├── mongodb.ts              # MongoDB singleton connection
│   ├── auth.ts                 # JWT sign/verify, bcrypt helpers
│   ├── utils.ts                # Price formatter, order ID generator, etc.
│   └── data.ts                 # Static menu/restaurant data (seed source)
└── scripts/
    ├── seed.js                 # Database seeder
    └── scraper.js              # Puppeteer Swiggy scraper
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Vipin-Gupta-07/veerji-food-delivery.git
cd veerji-food-delivery
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://...your MongoDB Atlas URI...
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed the Database

```bash
npm run seed
```

Output:
```
✅ Restaurant: Veer Ji Malai Chaap Wale
✅ Categories: 9 seeded
✅ Menu Items: 21 seeded
✅ Users: 2 seeded

Demo accounts:
  Admin: admin@veerji.com / Admin@123456
  User:  user@veerji.com / User@123456
```

### 4. Start Development Server

```bash
npm run dev
```

Open (https://veerji-chaap-food-delivery.vercel.app/)

---

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (M0)
3. Create a database user
4. Allow IP access: Add `0.0.0.0/0` for development
5. Get connection string: Click **Connect → Drivers**
6. Paste into `.env.local` as `MONGODB_URI`

---

## 🕷️ Scraping Data from Swiggy

> Use only for personal/educational purposes!

```bash
npm run scrape
```

### Alternatively — Seed via API

```bash
curl -X POST https://veerji-chaap-food-delivery.vercel.app/api/scrape-swiggy
```

---

## 🌐 Deploy on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Vipin-Gupta-07/veerji-food-delivery.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js**

### 3. Set Environment Variables on Vercel

```
MONGODB_URI         = mongodb+srv://...
JWT_SECRET          = your-secret-key
NEXT_PUBLIC_APP_URL = https://veerji-chaap-food-delivery.vercel.app
```

### 4. Deploy

Click **Deploy**. Your app is live! 🎉

---

## 🔑 API Reference

### Menu
```
GET    /api/menu              → All available menu items
GET    /api/menu?category=xyz → Items by category
GET    /api/menu?search=chaap → Search items
POST   /api/menu              → Create item (admin)
GET    /api/menu/:id          → Single item
PUT    /api/menu/:id          → Update item (admin)
DELETE /api/menu/:id          → Delete item (admin)
```

### Orders
```
POST  /api/orders            → Place order
GET   /api/orders            → Get orders (auth required)
GET   /api/orders/:orderId   → Get single order by orderId
PATCH /api/orders/:orderId   → Update order status (admin)
```

### Auth
```
POST /api/auth/signup  → Register user
POST /api/auth/login   → Login user
POST /api/auth/logout  → Logout user
GET  /api/auth/me      → Get current user
```

### Admin (JWT required, role=admin)
```
GET  /api/admin/menu    → All menu items
POST /api/admin/menu    → Create item
GET  /api/admin/orders  → All orders + stats
```

### Utility
```
POST /api/scrape-swiggy → Seed database from extracted data
GET  /api/health        → Health check + DB status
```

---

## 🎨 Features

### Customer
- 🏠 Home page with hero, bestsellers, features, offers
- 🍽️ Full restaurant menu with category navigation
- 🔍 Real-time search across items
- 🛒 Add to cart / remove / quantity update
- 📱 Cart sidebar (desktop) + bottom bar (mobile)
- 💳 Checkout with address form + payment (COD/UPI/Card)
- ✅ Order success page with live tracking UI
- 🔐 Login / Signup with JWT auth

### Admin
- 📊 Dashboard with order stats + revenue
- 🍢 Menu CRUD — add, edit, toggle availability, delete
- 📦 Order management — view all orders, update status
- 🔄 Data seeding from API endpoint

### Technical
- ⚡ Next.js 14 App Router (server + client components)
- 🎭 Framer Motion animations throughout
- 🐻 Zustand state management (cart + auth, localStorage persisted)
- 🔒 JWT authentication with HTTP-only cookies
- 📦 MongoDB with Mongoose schemas + indexes
- 📱 Fully responsive, mobile-first design
- 🖼️ Next.js Image optimization
- 🔔 Toast notifications (react-hot-toast)
- 💅 Tailwind CSS with custom brand theme

---

## 🎨 Design System

```
Brand Orange:      #FF6B35
Brand Orange Dark: #E85520
Brand Saffron:     #F59E0B
Brand Dark:        #1A1A1A
Brand Cream:       #FFF8F0

Display Font: Baloo 2 (headings)
Body Font:    Nunito (paragraphs)
```

---

## 🛠️ Available Scripts

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # ESLint
npm run seed    # Seed MongoDB database
npm run scrape  # Scrape Swiggy (Puppeteer)
```

---

## 📸 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Hero, bestsellers, features, CTA |
| `/restaurant` | Full menu with search + category filter |
| `/cart` | Cart page with summary |
| `/checkout` | Customer details, address, payment |
| `/order-success` | Confirmation + tracking |
| `/login` | Sign in |
| `/signup` | Register |
| `/admin` | Dashboard with stats |
| `/admin/menu` | Menu item CRUD |
| `/admin/orders` | Order status management |

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first for major changes.

---

## 📄 License

MIT — for demo/educational use only.
Restaurant data © Veer Ji Malai Chaap Wale. Used without permission for demo only.
Images from [Unsplash](https://unsplash.com) (free to use).

---

## 🌐 Links

| | |
|---|---|
| 🚀 Live Site | [https://veerji-chaap-food-delivery.vercel.app](https://veerji-chaap-food-delivery.vercel.app) |
| 💻 GitHub | [https://github.com/Vipin-Gupta-07/veerji-food-delivery](https://github.com/Vipin-Gupta-07/veerji-food-delivery) |

---

Built with ❤️ by [Vipin Gupta](https://github.com/Vipin-Gupta-07) for Veer Ji Malai Chaap Wale, Noida 🍢

> ⭐ If you found this useful, please star the repo on [GitHub](https://github.com/Vipin-Gupta-07/veerji-food-delivery)!
