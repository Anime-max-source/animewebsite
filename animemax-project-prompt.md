# AnimeMax E-Commerce Platform — Project Specification Prompt

## 1. Project Overview

**Project Name:** AnimeMax
**Type:** E-commerce website for an anime merchandise shop (figures, posters, clothing, accessories)
**Core Model:** Manual-payment MVP — buyers place orders online; payment is completed via UPI QR code sent manually by the owner through WhatsApp after order placement. Designed to scale toward automated payment gateways later.

**Primary Goals:**
- Allow the shop owner to list, edit, and manage products (including marking sold out).
- Allow buyers to browse products, add to cart, and place orders without needing an account.
- Notify the owner instantly when a new order is placed.
- Keep the codebase structured so payment automation (Razorpay/Cashfree/UPI deep-link) can be added later without a rebuild.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React (Vite) | Single codebase, route-based split for buyer/admin |
| Styling | Tailwind CSS | Fast, consistent design system |
| Backend/DB | Supabase (Postgres) | Database, Storage, Row Level Security |
| Auth | Clerk | Buyer sign-up/login + owner login; issues JWT consumed by Supabase for RLS |
| Image Storage | Supabase Storage (or Cloudinary free tier) | Compress/resize before upload |
| Notifications | WhatsApp Business API / Twilio / Email (Supabase Edge Function trigger) | Order alert to owner's phone |
| Hosting | Vercel / Netlify | Free tier sufficient at MVP stage |

---

## 3. Folder Structure

```
animemax/
├── public/
│   └── favicon, static assets
├── src/
│   ├── assets/                  # Images, logos, icons
│   ├── components/
│   │   ├── common/              # Buttons, Loader, Modal, Navbar, Footer
│   │   ├── storefront/          # ProductCard, ProductGrid, CartDrawer, CheckoutForm
│   │   └── admin/                # ProductForm, ProductTable, OrderTable, AdminSidebar
│   ├── pages/
│   │   ├── storefront/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Checkout.jsx
│   │   ├── account/
│   │   │   ├── SignIn.jsx        # Clerk <SignIn /> component
│   │   │   ├── SignUp.jsx        # Clerk <SignUp /> component
│   │   │   ├── Account.jsx       # Buyer profile (name, phone, WhatsApp, saved address)
│   │   │   └── OrderHistory.jsx  # Buyer's own past orders
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   └── ManageOrders.jsx
│   │   └── OrderConfirmation.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── clerkClient.js       # Clerk config/helpers (JWT template for Supabase)
│   ├── routes/
│   │   ├── PublicRoute.jsx
│   │   ├── ProtectedBuyerRoute.jsx    # Gates /account and /orders behind buyer sign-in
│   │   └── ProtectedAdminRoute.jsx   # Uses Clerk's <SignedIn>/useAuth() to gate /admin
│   ├── utils/
│   │   ├── formatPrice.js
│   │   └── validators.js
│   ├── App.jsx                   # Wrapped in <ClerkProvider> at root
│   └── main.jsx
├── supabase/
│   ├── schema.sql               # Table definitions + RLS policies
│   └── functions/
│       └── notify-owner/        # Edge Function: triggers WhatsApp/SMS/email on new order
├── .env                          # Supabase URL + anon key, Clerk publishable + secret key
└── package.json
```

---

## 4. Database Schema (Supabase / Postgres)

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | auto-generated |
| name | text | required |
| description | text | optional |
| price | numeric | required |
| category | text | e.g. figures, posters, clothing |
| image_url | text | Supabase Storage / Cloudinary link |
| stock | integer | default 0 |
| in_stock | boolean | derived/manually toggled; false = "Sold Out" badge |
| created_at | timestamp | default now() |

### `buyer_profiles`
| Column | Type | Notes |
|---|---|---|
| user_id | text (PK) | Clerk user ID |
| phone | text | optional, reusable at checkout |
| whatsapp | text | optional, reusable at checkout |
| address | text | optional, reusable at checkout |
| updated_at | timestamp | default now() |

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | auto-generated |
| user_id | text | Clerk user ID; nullable — allows guest checkout too |
| buyer_name | text | required |
| buyer_phone | text | required |
| buyer_whatsapp | text | required — used for QR delivery |
| buyer_address | text | required |
| items | jsonb | array of {product_id, name, qty, price} |
| total_amount | numeric | computed at checkout |
| status | text | enum: `pending`, `qr_sent`, `payment_confirmed`, `shipped`, `cancelled` |
| created_at | timestamp | default now() |

### Row Level Security (RLS) Rules
- Supabase is configured to accept **Clerk-issued JWTs** as third-party auth (Supabase supports Clerk as a native third-party auth provider — Clerk's session token is passed to Supabase and validated directly).
- `products`: public **read** access to all; **write** (insert/update/delete) restricted to requests carrying a valid Clerk JWT for the owner account.
- `orders`:
  - **Insert:** allowed for anyone (signed-in buyer or guest), so checkout never blocks on login.
  - **Read/Update by buyer:** a signed-in buyer can only read their own orders, where `orders.user_id` matches the Clerk JWT's `sub` claim.
  - **Read/Update by owner:** the owner's Clerk JWT bypasses the `user_id` check and can read/update all orders.
- `buyer_profiles`: a signed-in buyer can only read/write the row matching their own Clerk `user_id`; the owner can read all (to see saved buyer details alongside orders).
- Policies check the Clerk user ID (from the verified JWT `sub` claim) against a single hardcoded owner ID for admin-level access.

---

## 5. Feature Behavior Specification

### 5.1 Storefront (Public Browsing; Optional Buyer Account)
- **Home Page:** Displays product grid, filterable by category. Sold-out products show a "Sold Out" badge and disable "Add to Cart."
- **Product Detail Page:** Shows image, description, price, stock status, quantity selector, "Add to Cart" button.
- **Cart:** Persisted in browser (Context + localStorage) until checkout. Shows line items, quantity edit, remove item, subtotal.
- **Buyer Account (via Clerk):**
  - Buyers can **sign up / sign in** using Clerk's `<SignUp />` / `<SignIn />` components (email/password or social login).
  - Account creation is **optional** — guest checkout is still supported for buyers who skip sign-up.
  - Once signed in, a buyer's phone, WhatsApp number, and address are saved to `buyer_profiles` and auto-filled at future checkouts.
  - **Order History page:** signed-in buyers can view their own past orders and current status (`pending`, `qr_sent`, `payment_confirmed`, `shipped`).
- **Checkout Form:** Collects buyer name, phone, WhatsApp number, delivery address (pre-filled if signed in and a profile exists). On submit:
  1. Validates all fields (non-empty, valid phone format).
  2. Inserts a new row into `orders` with `status = 'pending'` and `user_id` set if signed in (null for guests).
  3. If signed in, upserts the entered phone/WhatsApp/address into `buyer_profiles` for next time.
  4. Triggers a notification to the owner (see 5.3).
  5. Redirects buyer to an **Order Confirmation** page: "Your order has been placed. You'll receive a payment QR code on WhatsApp shortly."

### 5.2 Admin Panel (Private, Login Required)
- **Route:** `/admin` — wrapped in `ProtectedAdminRoute`, which uses Clerk's `useAuth()`/`<SignedIn>` to check session state; redirects to Clerk's sign-in flow if not authenticated.
- **Login Page:** Clerk's pre-built `<SignIn />` component (email/password, or optionally Google/social login). Only one owner account is expected to exist — restrict sign-ups so no one else can self-register as admin (e.g. disable public sign-up in Clerk dashboard, or manually invite the owner account only).
- **Session → Database:** Clerk issues a session JWT on login; this JWT is forwarded with every Supabase request so RLS policies can verify the request is coming from the owner.
- **Dashboard:** Summary cards — total products, pending orders, sold-out items.
- **Manage Products:**
  - Add Product: form with name, description, price, category, image upload, stock quantity.
  - Edit Product: pre-filled form, same fields, updatable.
  - **Mark Sold Out:** single toggle/button per product row that sets `in_stock = false` (and optionally `stock = 0`) without deleting the product — it stays visible on storefront as sold out rather than disappearing.
  - Delete Product: removes row entirely (with confirmation modal).
- **Manage Orders:**
  - Table of all orders, sorted newest first, with buyer details, items, total, and status.
  - Owner manually updates status as they progress the order: `pending` → `qr_sent` → `payment_confirmed` → `shipped`.
  - No automatic payment verification at this stage — owner confirms manually after checking WhatsApp payment screenshot/UTR.

### 5.3 Order Notification Flow (Owner Alert)
- On new order insert, a Supabase **Edge Function** (or webhook) fires:
  1. Sends the owner an SMS/WhatsApp/email notification: "New order from [buyer_name] — ₹[total_amount]. View in admin panel."
  2. Owner opens Manage Orders, reviews the order, manually generates/sends a UPI QR code to the buyer's WhatsApp number listed in the order.
  3. Owner updates order status to `qr_sent`, then to `payment_confirmed` once payment screenshot/UTR is verified.

### 5.4 Non-Functional Requirements
- **Mobile-first responsive design** — majority of buyers expected to browse on phones.
- **Image optimization** — compress/resize before upload to stay within Supabase/Cloudinary free storage limits.
- **Basic input validation & sanitization** on all public-facing forms (checkout) to prevent bad data/spam orders.
- **No public account system required for buyers** — keeps checkout friction low.
- **Scalability path documented but not built yet:** architecture should allow swapping the manual WhatsApp QR step for an automated gateway (Razorpay/Cashfree) by replacing only the checkout confirmation step and adding a payment-status webhook — no changes needed to product/order schema.

---

## 6. Out of Scope (For This MVP)
- Automated payment gateway integration (planned as Phase 2)
- Multi-admin roles or permission levels
- Shipping/courier API integration
- Reviews, ratings, or wishlists

---

## 7. Success Criteria for MVP
- Owner can log in, add/edit/mark-sold-out products without touching code.
- Buyer can create an account (or check out as guest), add to cart, and check out.
- Signed-in buyers can view their own order history and status.
- Owner receives a real-time alert on every new order.
- Order and product data is safely separated via Supabase RLS (validated against Clerk JWTs) so buyers cannot edit products or view other buyers' orders.

---

## 8. Security Hardening — Preventing Buyer Access to Admin

Security is enforced in layers; no single layer is trusted alone.

### 8.1 Clerk: Owner Role via Metadata (not just "signed in")
- In the Clerk dashboard, set a **`publicMetadata.role = "owner"`** field on your own account only. Buyers who sign up get no such field.
- Never let a user set their own role from the frontend — `publicMetadata` is only editable from Clerk's backend/dashboard or a trusted server call, never from client-side code. This prevents a buyer from faking `role: "owner"` in their own browser.
- `ProtectedAdminRoute` checks `user.publicMetadata.role === "owner"` (not just `isSignedIn`) before rendering anything under `/admin`, and redirects immediately otherwise.

### 8.2 Supabase RLS: The Real Enforcement Layer
- Every policy on `products` (write) and `orders`/`buyer_profiles` (owner-level read/update) must check the **role claim inside the verified Clerk JWT** — not just that a JWT exists.
- Configure Clerk's JWT template to include the role claim, then in Supabase's policy: `(auth.jwt() ->> 'role') = 'owner'`.
- This means even if someone bypasses the frontend entirely — opens dev tools, calls the Supabase REST API directly with their own buyer session — the database itself rejects the request. This is the layer that actually matters; the frontend route guard is only there to avoid showing buyers a broken page.

### 8.3 Additional Hardening Measures
- **No admin logic in client-visible code that matters for security.** UI hiding (hiding an "Edit" button) is cosmetic only — always assume a buyer can open dev tools and call any exposed endpoint directly. Rely on RLS, not on hiding buttons.
- **Never expose the Supabase `service_role` key in frontend code.** Only the `anon` key (safe under RLS) belongs in the browser bundle. The `service_role` key (which bypasses RLS entirely) should only ever be used in a secure server context (e.g. a Supabase Edge Function), never shipped to the client.
- **Restrict Clerk sign-up** so the admin role can never be self-assigned — there is no "become owner" flow anywhere in the app; the role is set manually, once, by you in the Clerk dashboard.
- **Rate-limit and validate the checkout endpoint** (public insert on `orders`) to prevent spam/bot order flooding, since it's the one write endpoint open to anyone.
- **Log admin actions** (product edits, sold-out toggles, order status changes) with a timestamp and the acting user's ID, so any suspicious activity is traceable.
- **Rotate/secure environment variables** (Clerk secret key, Supabase service key) — keep them in `.env`, never commit to git, and set them only in your hosting provider's environment variable settings (Vercel/Netlify), not in the codebase.
