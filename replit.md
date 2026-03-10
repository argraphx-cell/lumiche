# LUMÍCHE — Luxury Clothing Ecommerce

A high-end luxury fashion ecommerce site built with React, Express, Stripe checkout, and PostgreSQL.

## Architecture

- **Frontend**: React + Vite + TypeScript, Wouter routing, TanStack Query, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Drizzle ORM) — orders table
- **Payments**: Stripe (stripe-replit-sync for product sync & webhooks)
- **Design**: Luxury fashion aesthetic — Playfair Display headings, gold accents, cream/black palette

## Pages

- `/` — Homepage: hero, featured products, collections, newsletter
- `/shop` — Product catalog with category filtering and sorting
- `/product/:id` — Product detail with size/quantity selection, add to cart
- `/checkout/success` — Order confirmation
- `/checkout/cancel` — Cancelled order

## Key Features

- Cart managed via localStorage + React Context (`useCart`)
- Stripe Checkout (one-time payment mode, not subscription)
- Products stored in Stripe, synced to PostgreSQL `stripe` schema via stripe-replit-sync
- Product images served from `/public/images/` (AI-generated)
- Category filtering: All, Women, Men, Knitwear, Tops, Trousers, New Arrivals

## Products

LUMÍCHE specializes in luxury sweaters and tops for men and women. All products seeded into Stripe via `script/seed-products.ts`. Custom fields stored as Stripe metadata: `localImage`, `category`, `gender`, `material`, `care`, `origin`, `isNew`, `featured`.

Current catalog (8 pieces):
- Women's Knitwear: Cashmere Ribbed Turtleneck ($895), Merino Oversized Crewneck ($595), Fine-Gauge Cashmere Cardigan ($1,150)
- Women's Tops: Silk-Cashmere Sleeveless Top ($745)
- Men's Knitwear: Heavy-Gauge Cashmere Crewneck ($895), Camel Wool Ribbed Pullover ($795)
- Men's Tops: Extra-Fine Merino Henley ($495), Cotton-Linen Relaxed Crewneck ($295)

## Design Tokens

- Primary font: Playfair Display (headings), Open Sans (body)
- Gold color: `gold` Tailwind class (hsl 38 44% 56%)
- Dark/light mode supported

## API Endpoints

- `GET /api/products` — List all products with prices
- `GET /api/products/:id` — Single product
- `POST /api/checkout` — Create Stripe checkout session (items: [{priceId, quantity}])
- `GET /api/checkout/session/:sessionId` — Retrieve session details
- `GET /api/stripe/publishable-key` — Get Stripe publishable key
- `POST /api/stripe/webhook` — Stripe webhook handler

## Database

- `public.orders` — Stores completed order data (stripeSessionId, customerEmail, etc.)
- `stripe.*` — Managed by stripe-replit-sync (products, prices, etc.)
