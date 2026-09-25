# AnimeMax Admin Panel — UI Design Prompt

## Objective
Design and build the **owner admin dashboard** (`/admin`) for AnimeMax, an anime merchandise e-commerce store. Visual direction: a clean, modern, dark-sidebar SaaS dashboard — not a generic admin table screen. Reference aesthetic: dark near-black sidebar, off-white content area, rounded cards, lime-green + lavender accent palette, bold numeric stats.

---

## 1. Layout Structure

**Left Sidebar** (fixed, full height, `#0B0B0B`–`#121212` background):
- Logo/wordmark at top (e.g. "AnimeMax" + small icon mark).
- Owner profile block below logo: avatar, name, email, small dropdown chevron.
- Navigation list, icon + label, optional count badge on the right of each item:
  - Dashboard
  - Products
  - Orders *(badge = pending order count)*
  - Customers
  - Messages / Support
- **Active nav item** = white rounded pill standing out against the dark sidebar; inactive items are plain icon + light gray text.
- Bottom of sidebar: rounded promo/upsell card with a short headline, subtext, small illustration, and a dark CTA button (e.g. "Add your first product" / "Set up automated payments").

**Main Content Area:**
- Light off-white background (`#F5F5F3`-ish).
- Generous padding around content.
- All cards: `rounded-2xl`, soft drop shadow, internal padding (`p-6`).

**Top Bar** (within main content, above page header):
- Rounded pill search input with search icon (search products/orders).
- Notification bell icon with small unread-count badge.

---

## 2. Page Header
- Large bold title: **"Shop Overview"**.
- Muted subtitle line beneath: e.g. "Track your store's performance today."
- Right-aligned date/range dropdown control (e.g. "Today ▾") to filter stats by day/week/month.

---

## 3. Stat Cards (Top Row — 3 cards)
Each card: icon in a soft circular badge (top-left), small "⋮" overflow menu (top-right), large bold number, unit/label beneath, small lime-green **% delta pill** next to the number (e.g. "+5%").

| Card | Content |
|---|---|
| **Revenue Today** | Total ₹ from confirmed orders, % change vs. yesterday |
| **Orders Today** | Order count, average order value shown as secondary stat |
| **Stock Health** | % of products in stock vs. sold out, visualized as a small dot-matrix grid (rows/columns of dots, filled dots = in-stock ratio) |

---

## 4. Order Status Breakdown (Nested Circle Chart)
- Large nested/overlapping colored circles, each sized proportionally to order count in that status: `pending`, `confirmed`, `shipped` — using the lime-green / near-black / lavender palette.
- Below the chart: horizontal progress bars, one per status, each with a colored dot, percentage value, and label (e.g. "Pending 45%", "Shipped 30%", "Cancelled 25%").

---

## 5. Sales Analysis Panel (Bottom, Full Width)
- Header row: "Sales Analysis" title + "Monthly ▾" dropdown filter.
- Two headline stats, top-left, each with a small colored square marker:
  - Lime marker → e.g. "92% Orders Fulfilled"
  - Lavender marker → e.g. "₹18,400 Avg Monthly Revenue"
- Bar chart below: one bar per month.
  - Most bars: muted, subtle striped/textured dark fill.
  - **Current month highlighted**: solid two-tone bar pairing lime-green + lavender, rounded top corners, clearly standing out from the rest.
  - Month labels along the x-axis (Jun, Jul, Aug, Sept, Oct, Nov, Dec).

---

## 6. Color & Style Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg-dark` | `#0B0B0B` | Sidebar background |
| `--bg-light` | `#F5F5F3` | Main content background |
| `--accent-lime` | `#D6FF4A` | Primary accent — CTAs, highlights, positive deltas |
| `--accent-lavender` | `#B8A4FF` | Secondary accent — secondary data series, active/selected states |
| `--card-bg` | `#FFFFFF` | Card backgrounds |
| `--text-primary` | `#111111` | Headings, large numeric stats |
| `--text-muted` | `#8A8A8A` | Subtitles, secondary labels |

- **Typography:** bold, slightly rounded sans-serif (Inter, Manrope, or similar) for large numbers; regular weight for labels/subtext.
- **Corners:** consistently rounded — `rounded-2xl` on cards, `rounded-full` on pills/badges/active nav states.
- **Shadows:** soft, low-opacity `shadow-sm` on cards — avoid harsh borders.
- **Icons:** simple line icons inside soft circular badges (`lucide-react` icon set recommended).

---

## 7. Component/Library Notes
- **Charts:** `recharts` for the bar chart and progress bars; nested-circle breakdown can be custom SVG or a lightweight bubble chart.
- **Icons:** `lucide-react`.
- **Scope:** this styling applies to the **admin panel only** (`/admin` and its sub-pages — Products, Orders, Customers). The public storefront uses its own separate e-commerce-focused layout and is not part of this prompt.
- Extend this same visual language (sidebar, card style, color tokens) consistently across the **Products** management page and **Orders** management page so the whole admin panel feels like one cohesive product, not just the dashboard home.
