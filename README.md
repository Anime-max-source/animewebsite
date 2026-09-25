# AnimeMax Storefront & Admin Portal

A modern, high-performance anime merchandise e-commerce platform built with React 19, Vite, Tailwind CSS, Supabase, and Clerk.

## Features

- **Storefront**: Dynamic hero banner, category filters, trending carousels, responsive product grid, real-time stock indicators.
- **Cart & Checkout**: Slide-out cart drawer, dynamic free shipping meter, UPI QR generation & WhatsApp manual payment proof flow.
- **Customer Portal**: Clerk authentication, order tracking, profile management.
- **Admin Dashboard**: Secure owner-only portal, real-time stats, order management (status updates & tracking links), product manager, banner management.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Routing**: React Router DOM v7
- **Authentication**: Clerk React
- **Backend & Database**: Supabase (PostgreSQL + RLS)
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Owner / Admin Configuration
VITE_OWNER_CLERK_ID=user_...
VITE_OWNER_WHATSAPP=+919876543210
VITE_OWNER_UPI_ID=animemax@upi
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Vercel Deployment

1. Import this repository in [Vercel](https://vercel.com/new).
2. Framework Preset will automatically detect **Vite**.
3. Under **Environment Variables**, add the variables from `.env.example`.
4. Deploy!
