# Amazon Clone - Full-Stack E-commerce Portfolio Project

A representative full-stack e-commerce clone demonstrating modern web development practices. This project covers core shopping flows (product catalog, cart, checkout, orders), not a 1:1 Amazon replica.

## 🚀 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite + TypeScript | Fast dev loop, strict typing |
| Styling | Tailwind CSS | Rapid UI development |
| State | Redux Toolkit | Predictable state management |
| Backend | Node.js + Express + TypeScript | REST API with type safety |
| Database | PostgreSQL + Prisma | Relational data, great DX |
| Auth | JWT + Google OAuth | Industry-standard auth |
| Payments | Stripe (test mode) | Real payment integration |
| Images | Cloudinary | CDN-hosted product images |
| Deploy | Vercel + Render + Neon | Free-tier friendly |

## 📁 Monorepo Structure

```
amazon-clone/
├── client/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── api/
│   └── package.json
├── server/           # Express API backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── prisma/
│   └── package.json
├── shared/           # Shared TypeScript types
│   └── src/
│       └── index.ts
└── package.json      # Root workspace config
```

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client (Vite) │────▶│   Server (API)  │────▶│  PostgreSQL     │
│                 │     │                 │     │                 │
│ React + Redux   │     │ Express + TS    │     │ Prisma ORM      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TailwindCSS   │     │   Cloudinary    │     │   Stripe        │
│ (Styling)       │     │   (Images)      │     │   (Payments)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🗄️ ER Diagram (Simplified)

```
User ──< Cart >── CartItem (snapshots)
 │
 ├─< Order >── OrderItem (snapshots) ├─ OrderAddress (snapshots)
 │      │
 ├─< Review >── Product
 │
 └─< Wishlist >── WishlistItem (snapshots)
 
Address (user's saved addresses)
Category >── Products
```

Key design decisions:
- **Snapshot fields**: CartItem, WishlistItem, OrderItem, and OrderAddress store copies of data at the time of creation to preserve history
- **Product**: Core catalog entity with category relation and reviews
- **Review**: Unique constraint (userId, productId) preventing duplicate reviews per product

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon/Supabase suggested)
- Google OAuth credentials
- Stripe test keys

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd amazon-clone

# Install dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Run database migrations
cd server
npx prisma migrate dev

# Start development servers
npm run dev
```

### Development Commands

```bash
# Root level
npm run dev      # Start all packages
npm run build    # Build all packages
npm run lint     # Lint all packages

# Server specific
cd server
npm run prisma:studio  # Open Prisma Studio
npm run prisma:generate # Generate Prisma client
```

## 📅 Roadmap

- **Week 1**: Workspace setup, Prisma schema, Auth API ✅
- **Week 2**: Product/category API, seed script, image upload ✅
- **Week 3**: Frontend shell, product listing, search/filter ✅
- **Week 4**: Cart (Redux), checkout flow, Stripe integration ✅
- **Week 5**: Reviews, wishlist, addresses, admin dashboard ✅
- **Week 6**: Tests, CI/CD, polish, deploy, README + demo

## 🛒 Week 4 Implementation

### Cart System
- Redux slice for cart state management (`client/src/store/cartSlice.ts`)
- Cart API endpoints (`server/src/controllers/cart.controller.ts`):
  - `GET /api/cart` - Get user's cart
  - `POST /api/cart` - Add item to cart
  - `PUT /api/cart/:id` - Update cart item quantity
  - `DELETE /api/cart/:id` - Remove item from cart
  - `DELETE /api/cart` - Clear cart

### Checkout & Payments
- Stripe Checkout integration (`server/src/controllers/order.controller.ts`)
- Checkout session creation endpoint: `POST /api/orders/checkout`
- Order confirmation endpoint: `POST /api/orders/confirm`
- Address management API (`server/src/controllers/address.controller.ts`):
  - `GET /api/addresses` - Get all user addresses
  - `POST /api/addresses` - Create new address
  - `PUT /api/addresses/:id` - Update address
  - `DELETE /api/addresses/:id` - Delete address

### Frontend Pages
- **CartPage.tsx**: View cart items, update quantities, remove items
- **CheckoutPage.tsx**: Address selection, order summary
- **CheckoutSuccessPage.tsx**: Payment success confirmation
- **OrdersPage.tsx**: Order history with status badges

## 📅 Week 5 Implementation

### Reviews System
- Review API endpoints (`server/src/controllers/review.controller.ts`):
  - `GET /api/reviews/product/:productId` - Get product reviews
  - `POST /api/reviews` - Create review (protected)
  - `PUT /api/reviews/:id` - Update review (protected)
  - `DELETE /api/reviews/:id` - Delete review (protected)
- Automatic rating average calculation on product updates
- **ReviewForm.tsx**: Interactive review submission form
- Reviews displayed on ProductDetailPage

### Wishlist System
- Wishlist API endpoints (`server/src/controllers/wishlist.controller.ts`):
  - `GET /api/wishlist` - Get user's wishlist
  - `POST /api/wishlist` - Add item to wishlist
  - `DELETE /api/wishlist/:id` - Remove from wishlist
- **WishlistPage.tsx**: Wishlist management UI

### Admin Dashboard
- Admin API endpoints (`server/src/controllers/admin.controller.ts`):
  - `GET /api/admin/orders` - Get all orders
  - `PUT /api/admin/orders/:id/status` - Update order status
  - `GET /api/admin/stats` - Get dashboard statistics
- **AdminDashboardPage.tsx**: Overview with stats and order management
- Protected routes with `admin` middleware role check

## 🎯 What Makes This Portfolio-Worthy

1. **Type-safe end-to-end**: Shared types via npm workspaces
2. **Tests on critical logic**: Cart math, checkout flow
3. **Real deployments**: Live demo link on Vercel/Render
4. **Architecture documentation**: ER diagram, design decisions
5. **Honest scope**: Representative clone, not literal copy

## 📦 Seeding Data

To populate the database with sample data:

```bash
# Run seed script (requires database connection)
npm run seed --workspace=server
```

This creates:
- 10 categories (Electronics, Clothing, Home & Kitchen, etc.)
- 100 products with random images and prices
- 50 seed users
- 200 random reviews

## 🛠️ Development Commands

```bash
# Seed database
npm run seed --workspace=server

# Server specific
cd server
npm run prisma:studio  # Open Prisma Studio

```

## 📜 License

MIT
