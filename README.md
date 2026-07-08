# Zosh Bazaar Ecommerce Marketplace

A full-stack multi-vendor ecommerce application built with a React + TypeScript frontend and a Node.js + Express + MongoDB backend. The project supports customer shopping flows, seller workflows, admin-style management endpoints, product browsing, cart and wishlist features, orders, reviews, payments, coupons, and chatbot-assisted interactions.

Live Demo - https://saas-e-commerce-website-1.onrender.com



## Tech Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, React Router, Material UI, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, Razorpay, Stripe, Gemini API
- Tooling: npm/pnpm lockfiles, ESLint, PostCSS, Vite

## Project Structure

```text
F:\Ecommerce_Website
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── domain
│   │   ├── exceptions
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routers
│   │   ├── services
│   │   └── utils
│   ├── package.json
│   └── .env
├── frontend
│   ├── src
│   │   ├── Config
│   │   ├── admin
│   │   ├── customer
│   │   ├── routes
│   │   ├── seller
│   │   └── Theme
│   ├── package.json
│   └── vite.config.ts
└── product images
```

## Features

### Customer

- Browse products and categories
- Search and filter products
- Manage cart and wishlist
- Place and track orders
- Write and read product reviews
- Use coupon codes during checkout
- Chat with the built-in chatbot routes

### Seller

- Seller registration and verification flow
- Product management APIs
- Order and revenue reporting endpoints
- Seller-specific report and transaction routes

### Payments

- Razorpay integration
- Stripe support in the backend dependencies
- Payment order and payment status handling

### Admin / Platform

- Auth and user management routes
- Home category and deal management routes
- Coupon and revenue endpoints
- Transaction and review endpoints

## Prerequisites

- Node.js 18+ recommended
- npm or pnpm
- MongoDB Atlas or local MongoDB instance
- Optional: Razorpay, Stripe, and Gemini API credentials if you want those features to work fully

## Environment Variables

Create a `backend/.env` file with the required values:

```env
PORT=8080
MONGO_URI=your-mongodb-connection-string
SECERET_KEY=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
```

Notes:

- The backend reads `MONGO_URI` in `backend/src/config/db.js`.
- The JWT helper reads `SECERET_KEY` from the environment.
- The chatbot service reads `GEMINI_API_KEY`.
- The frontend points to `http://localhost:8080` by default in `frontend/src/Config/Api.ts`.

## Install Dependencies

From the workspace root:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

If you prefer pnpm, use it consistently in each folder instead of npm.

## Run the Application

### 1. Start the backend

```powershell
cd F:\Ecommerce_Website\backend
npm run dev
```

The backend runs on port `8080` by default.

### 2. Start the frontend

Open a second terminal:

```powershell
cd F:\Ecommerce_Website\frontend
npm run dev
```

Vite usually serves the app on `http://localhost:5173`.

### 3. Open the app

- Frontend: `http://localhost:5173`
- Backend health/root endpoint: `http://localhost:8080`

## Build and Preview Frontend

```powershell
cd F:\Ecommerce_Website\frontend
npm run build
npm run preview
```

## Backend Scripts

```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

## API Overview

The backend exposes route groups for:

- `/auth`
- `/api/users`
- `/sellers`
- `/products`
- `/api/sellers/product`
- `/api/cart`
- `/api/orders`
- `/api/seller/orders`
- `/api/transactions`
- `/api/wishlist`
- `/api/sellers/report`
- `/api/payment`
- `/home`
- `/admin/deals`
- `/admin`
- `/api/coupons`
- `/api/sellers/revenue`
- `/api/reviews`
- `/chat`

## Troubleshooting

### Backend exits immediately

- Verify `MONGO_URI` is valid and reachable.
- Make sure the `.env` file is inside `backend/`.
- Confirm no other process is using port `8080`.

### Chatbot or AI features fail

- Set a real `GEMINI_API_KEY`.
- If you do not need chatbot features, you can ignore those routes.

### Payment flows fail

- Check Razorpay and Stripe configuration in the backend services.
- Make sure webhook or credential values are configured where required.

### Frontend cannot reach the backend

- Confirm the backend is running on `http://localhost:8080`.
- Check `frontend/src/Config/Api.ts` if you need to point the frontend to another backend URL.

## Notes

- The repository contains a `product images/` folder with sample product assets.
- There is an existing frontend README template in `frontend/README.md`, but this root README is the main project guide.
- The backend codebase contains a few route and file name inconsistencies, so if a specific route fails, check the matching router/controller file pair first.

## License

No license file is currently included in the repository.
