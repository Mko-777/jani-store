# 🌸 JaNi Store — Premium Flower E-Commerce

A beautiful, production-ready e-commerce website for a premium flower shop, built with Next.js 14, Tailwind CSS, Prisma, and Stripe.

## ✨ Features

- 🛒 **Full Shopping Cart** — localStorage persistence, real-time updates
- 💳 **Stripe Payments** — secure checkout with tax calculation
- 🚚 **Shipping Options** — Standard, Express, Overnight (free shipping over $75)
- 🧾 **Tax Calculation** — state-based tax rates for all US states
- 🌸 **Beautiful Design** — luxurious, mobile-first design with animations
- 🔧 **Admin Panel** — manage products, view orders, track inventory
- 📱 **Mobile Responsive** — works perfectly on all screen sizes

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma ORM | Database |
| SQLite | Development DB |
| Stripe | Payments |
| React Context | State management |

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mko-777/jani-store.git
   cd jani-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your values (see Environment Variables below)

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser!

## ⚙️ Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | SQLite database path (`file:./dev.db`) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_`) | For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_`) | For payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | For webhooks |
| `ADMIN_EMAIL` | Admin panel login email | ✅ |
| `ADMIN_PASSWORD` | Admin panel login password | ✅ |
| `ADMIN_SESSION_SECRET` | Session security secret | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (e.g., `http://localhost:3000`) | ✅ |

## 💳 Stripe Setup

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys**
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env.local` file
5. For webhooks, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Click **"Deploy"**!

For the database in production, switch to [PlanetScale](https://planetscale.com) or [Supabase](https://supabase.com).

## �� Admin Panel

Access the admin panel at `/admin`:
- **Default email:** `admin@jani.com` (set in `ADMIN_EMAIL` env var)
- **Default password:** `changeme123` (set in `ADMIN_PASSWORD` env var)

Features:
- Dashboard with revenue, orders, product, and low-stock stats
- Product management (add, edit, delete)
- Order management with status tracking
- Inventory monitoring

## 🧪 Testing Payments

Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

---

Made with 🌸 and love.
