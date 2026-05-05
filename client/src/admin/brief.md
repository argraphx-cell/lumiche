# LUMÍCHE — Project Brief

## Brand
Luxury fashion brand. Quiet luxury, radical scarcity. Every piece is a limited edition — 1/1, 1/50, etc. No restocks. Ever.

## Design Tokens
- Background: #EEEEEE (off-white)
- Text: #111111 (off-black)
- Hero/slideshow background: #FFFFFF
- Font: Cormorant Garamond (editorial/italic), Inter 300 (body)
- No gradients, no drop shadows, wide tracking on UI labels

## Stack
- React + Vite + TypeScript
- React Router for navigation
- Tailwind CSS
- Cloudflare Pages (frontend)
- Cloudflare Workers (backend — not yet built)
- Cloudflare D1 (database — not yet built)
- Cloudflare Images (shared with Harlem Homage — $5/mo)
- Stripe (separate config from Harlem Homage — Phase 2)
- GitHub: argraphx-cell/lumiche
- Domain: lumíche.com (punycode: xn--lumche-0ra.com) via GoDaddy → Cloudflare

## Local Dev
- Path: C:\Users\thela\lumiche
- Dev server: npm run dev (runs on localhost:5173 or next available port)
- Primary dev tool: Claude Code (claude in VS Code terminal)

## Pages (Phase 1 — Live)
- / — Hero slideshow (3 slides, canvas mosaic dissolve, top-aligned, img tags, navbar-height offset via ResizeObserver)
- /collection — Kickstarter tier cards (Patron $150, Founder Sweater $300, Collector $500, Archive $1000)
- /authentication — Certificate of Authenticity teaser + placeholder search field
- /about — Brand story, pull quote, 3-column values, Kickstarter CTA

## Components
- Navbar: LUMÍCHE wordmark centered (italic serif), links right, height measured dynamically
- Footer: wordmark + email capture + subscribe button + copyright
- HeroSlideshow: 3 slides, canvas mosaic dissolve at 8px blocks, auto-advances every 5s, dot indicators, "Back This Project" button at bottom center

## Phase 1 — Kickstarter Pre-Launch
- No cart, no checkout
- All tier CTAs link to Kickstarter campaign
- Email capture in footer (non-functional placeholder)
- Authentication Library is a teaser only

## Phase 2 — Post Kickstarter
- Full e-commerce with Stripe
- Authentication Library goes live (D1 database, certificate serial lookup)
- Admin panel for product and edition management

## Pending
- Connect lumíche.com domain via Cloudflare (GoDaddy nameserver flip)
- Deploy to Cloudflare Pages
- Build Cloudflare Worker backend
- Set up Stripe account for LUMÍCHE
- Replace placeholder hero images with original photography
- Wire up email capture
- Build Authentication Library database (D1)
