# PC Deals India - Full-Stack E-Commerce Platform

A full-stack e-commerce website for selling software license keys, inspired by pcdealsindia.com.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Payments:** Razorpay Integration
- **Email:** Nodemailer (SMTP)
- **WhatsApp:** Gupshup API
- **Invoices:** PDF-lib

## Features

### Customer Features
- Browse products by category (Windows, Office, Antivirus, etc.)
- Product pages with price, MRP, discount, key delivery info
- Shopping cart & checkout with Razorpay payment
- Instant delivery - keys sent via Email & WhatsApp
- GST Invoice download (PDF)
- Wallet system: 25% cashback (max ₹500) on first order, 2% on prepaid
- User account with order history, saved keys, invoices
- Login/Register with JWT authentication

### Admin Features
- Dashboard with sales, orders, inventory stats
- Product & Category management
- Inventory manager with CSV bulk upload
- Order management (view, refund, resend keys)
- User management with wallet adjust
- CMS: Banners, Testimonials, FAQs, USP features
- Settings: SMTP, WhatsApp API, GST, Cashback rules

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account
- SMTP email account
- Gupshup WhatsApp API account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

## API Endpoints

### Public
- `GET /api/products` - List products
- `GET /api/products/:slug` - Single product
- `GET /api/categories` - List categories
- `GET /api/cms/banners` - Active banners
- `GET /api/cms/testimonials` - Active testimonials
- `GET /api/cms/faqs` - Active FAQs
- `GET /api/cms/usps` - Active USP features

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profile (auth)
- `PUT /api/auth/profile` - Update profile (auth)

### Orders (auth required)
- `POST /api/orders/create` - Create order + Razorpay order
- `POST /api/orders/verify` - Verify payment
- `GET /api/orders/my-orders` - User's orders

### Wallet (auth required)
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Cashback history

### Admin (admin auth required)
- `GET /api/admin/dashboard` - Dashboard stats
- CRUD for Products, Categories, Inventory, Orders, Users
- CMS management for Testimonials, FAQs, Banners, USPs
- Settings management

## Project Structure

```
backend/
├── config/db.js
├── middleware/auth.js
├── models/ (User, Product, Category, Order, Inventory, etc.)
├── routes/ (auth, categories, products, orders, wallet, cms, admin, invoices)
├── utils/ (razorpay, email, whatsapp, invoice, delivery)
├── server.js
└── .env.example

frontend/
├── app/ (Next.js 14 App Router)
│   ├── page.tsx (Home)
│   ├── category/[slug]/page.tsx
│   ├── product/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── payment-success/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── account/ (orders, wallet, invoices, saved-keys)
│   ├── admin/ (dashboard, products, inventory, orders, users, cms, settings)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/ (Header, Footer)
├── lib/ (api.ts, utils.ts)
├── public/
└── .env.example
```

## Deployment

### Backend (Render / Railway / VPS)
```bash
cd backend
npm install
npm start
```

### Frontend (Vercel)
```bash
cd frontend
npm install
npm run build
npm start
```

## License

Private - All Rights Reserved
