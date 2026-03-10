import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lumiche-admin-2025";

function checkAdmin(req: any, res: any): boolean {
  const pw = req.headers["x-admin-password"];
  if (pw !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.listProductsWithPrices();
      res.json({ data: products });
    } catch (err: any) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:productId", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.productId);
      if (!product) return res.status(404).json({ error: "Product not found" });
      const prices = await storage.getPricesForProduct(req.params.productId);
      res.json({ ...product, prices });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to get publishable key" });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const { items, customerEmail } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart items are required" });
      }

      const stripe = await getUncachableStripeClient();
      const host = req.headers.host || "localhost:5000";
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const baseUrl = `${protocol}://${host}`;

      const lineItems = items.map((item: any) => ({
        price: item.priceId,
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        customer_email: customerEmail || undefined,
        shipping_address_collection: {
          allowed_countries: ["US", "GB", "CA", "AU", "FR", "DE", "IT"],
        },
        metadata: {
          source: "lumiche_store",
        },
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (err: any) {
      console.error("Checkout error:", err);
      res.status(500).json({ error: err.message || "Checkout failed" });
    }
  });

  app.get("/api/checkout/session/:sessionId", async (req, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(
        req.params.sessionId,
        { expand: ["line_items", "line_items.data.price.product"] }
      );
      res.json({ session });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  });

  // ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ ok: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
      const { name, description, price, metadata } = req.body;
      if (!name || !price) return res.status(400).json({ error: "name and price required" });
      const stripe = await getUncachableStripeClient();
      const product = await stripe.products.create({ name, description, metadata: metadata || {} });
      const priceObj = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(Number(price) * 100),
        currency: "usd",
      });
      res.json({ product, price: priceObj });
    } catch (err: any) {
      console.error("Admin create product error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/products/:id", async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
      const { name, description, metadata } = req.body;
      const stripe = await getUncachableStripeClient();
      const update: any = {};
      if (name) update.name = name;
      if (description !== undefined) update.description = description;
      if (metadata) update.metadata = metadata;
      const product = await stripe.products.update(req.params.id, update);
      res.json({ product });
    } catch (err: any) {
      console.error("Admin update product error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
      const stripe = await getUncachableStripeClient();
      await stripe.products.update(req.params.id, { active: false });
      res.json({ ok: true });
    } catch (err: any) {
      console.error("Admin archive product error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return httpServer;
}
