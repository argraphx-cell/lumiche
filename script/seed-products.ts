import Stripe from "stripe";

async function getStripeClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error("Missing REPLIT_CONNECTORS_HOSTNAME or REPL_IDENTITY env vars");
  }

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", "development");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
  });
  const data = await response.json();
  const settings = data.items?.[0]?.settings;
  if (!settings?.secret) throw new Error("Stripe dev connection not found");

  return new Stripe(settings.secret, { apiVersion: "2025-08-27.basil" as any });
}

const PRODUCTS = [
  // Women's
  {
    name: "Cashmere Ribbed Turtleneck",
    description: "A perfectly weighted cashmere turtleneck with a dense, fine rib. Crafted for the modern woman who moves through cities with ease and intention.",
    metadata: {
      category: "Knitwear",
      gender: "Women",
      material: "100% Grade-A Cashmere",
      care: "Dry clean or hand wash cold",
      origin: "Made in Scotland",
      localImage: "/images/product-womens-turtleneck.png",
      isNew: "true",
      featured: "true",
    },
    price: 89500,
  },
  {
    name: "Merino Oversized Crewneck",
    description: "An oversized crewneck in extra-fine merino, cut generously for layering or wearing alone. Light, warm, and effortlessly refined.",
    metadata: {
      category: "Knitwear",
      gender: "Women",
      material: "Extra-Fine Merino Wool",
      care: "Hand wash cold or dry clean",
      origin: "Made in Italy",
      localImage: "/images/product-womens-crewneck.png",
      isNew: "true",
      featured: "true",
    },
    price: 59500,
  },
  {
    name: "Silk-Cashmere Sleeveless Top",
    description: "A fluid sleeveless top in a silk-cashmere blend — impossibly light yet warm to the touch. Pairs with everything.",
    metadata: {
      category: "Tops",
      gender: "Women",
      material: "70% Silk, 30% Cashmere",
      care: "Dry clean only",
      origin: "Made in France",
      localImage: "/images/product-womens-top.png",
      isNew: "false",
      featured: "true",
    },
    price: 74500,
  },
  {
    name: "Fine-Gauge Cashmere Cardigan",
    description: "An open-front fine-gauge cashmere cardigan with clean dropped shoulders. A staple piece built to last a lifetime.",
    metadata: {
      category: "Knitwear",
      gender: "Women",
      material: "100% Grade-A Cashmere",
      care: "Dry clean or hand wash cold",
      origin: "Made in Scotland",
      localImage: "/images/product-womens-cardigan.png",
      isNew: "true",
    },
    price: 115000,
  },
  // Women's Trousers
  {
    name: "Wide-Leg Cashmere Trousers",
    description: "Sweeping wide-leg trousers in 100% cashmere — impossibly soft and structured at once. Designed to move with the body through every city.",
    metadata: {
      category: "Trousers",
      gender: "Women",
      material: "100% Grade-A Cashmere",
      care: "Dry clean only",
      origin: "Made in Scotland",
      localImage: "/images/product-womens-wide-trousers.png",
      isNew: "true",
      featured: "true",
    },
    price: 125000,
  },
  {
    name: "Tailored High-Waist Trousers",
    description: "A high-waist merino wool trouser with a sharp, tailored silhouette. The kind of piece that anchors an entire wardrobe.",
    metadata: {
      category: "Trousers",
      gender: "Women",
      material: "Extra-Fine Merino Wool",
      care: "Dry clean or hand wash cold",
      origin: "Made in Italy",
      localImage: "/images/product-womens-tailored-trousers.png",
      isNew: "false",
      featured: "true",
    },
    price: 89500,
  },
  // Men's Trousers
  {
    name: "Relaxed Linen Trousers",
    description: "Wide-leg linen trousers with a relaxed, lived-in silhouette. Lightweight and breathable — from Lagos to Kingston without missing a beat.",
    metadata: {
      category: "Trousers",
      gender: "Men",
      material: "100% European Linen",
      care: "Machine wash cold, gentle",
      origin: "Made in Portugal",
      localImage: "/images/product-mens-linen-trousers.png",
      isNew: "true",
    },
    price: 49500,
  },
  {
    name: "Slim-Fit Wool Trousers",
    description: "A slim, clean-lined trouser in super 110s wool. Precision-tailored, rooted in the tailoring traditions of Accra and London alike.",
    metadata: {
      category: "Trousers",
      gender: "Men",
      material: "Super 110s Wool",
      care: "Dry clean only",
      origin: "Made in England",
      localImage: "/images/product-mens-wool-trousers.png",
      isNew: "false",
      featured: "true",
    },
    price: 69500,
  },
  // Men's Knitwear
  {
    name: "Heavy-Gauge Cashmere Crewneck",
    description: "A substantial, heavy-gauge cashmere crewneck with a structured rib. Rooted in the workwear traditions of the cities we call home.",
    metadata: {
      category: "Knitwear",
      gender: "Men",
      material: "100% Grade-A Cashmere",
      care: "Dry clean or hand wash cold",
      origin: "Made in Scotland",
      localImage: "/images/product-mens-crewneck.png",
      isNew: "true",
      featured: "true",
    },
    price: 89500,
  },
  {
    name: "Extra-Fine Merino Henley",
    description: "A clean-cut merino henley with a three-button placket. The kind of piece that works from Lagos to Harlem without missing a beat.",
    metadata: {
      category: "Tops",
      gender: "Men",
      material: "Extra-Fine Merino Wool",
      care: "Machine wash cold, gentle",
      origin: "Made in Italy",
      localImage: "/images/product-mens-henley.png",
      isNew: "false",
      featured: "true",
    },
    price: 49500,
  },
  {
    name: "Cotton-Linen Relaxed Crewneck",
    description: "A relaxed crewneck in a breathable cotton-linen blend. Lightweight and lived-in, made for movement.",
    metadata: {
      category: "Tops",
      gender: "Men",
      material: "60% Cotton, 40% Linen",
      care: "Machine wash cold",
      origin: "Made in Portugal",
      localImage: "/images/product-mens-top.png",
      isNew: "false",
    },
    price: 29500,
  },
  {
    name: "Camel Wool Ribbed Pullover",
    description: "A thick-ribbed camel wool pullover with a classic silhouette. The warmth and texture of a Nairobi evening, wearable anywhere.",
    metadata: {
      category: "Knitwear",
      gender: "Men",
      material: "100% Camel Wool",
      care: "Dry clean only",
      origin: "Made in Mongolia",
      localImage: "/images/product-mens-pullover.png",
      isNew: "true",
    },
    price: 79500,
  },
];

async function archiveOldProducts(stripe: Stripe) {
  console.log("Archiving old products...");
  const existing = await stripe.products.list({ active: true, limit: 100 });
  for (const product of existing.data) {
    await stripe.products.update(product.id, { active: false });
    console.log(`  Archived: ${product.name}`);
  }
}

async function seedProducts() {
  console.log("Connecting to Stripe...");
  const stripe = await getStripeClient();

  await archiveOldProducts(stripe);

  console.log("\nCreating new LUMÍCHE products...");
  for (const product of PRODUCTS) {
    console.log(`Creating: ${product.name}...`);
    const created = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: product.metadata,
    });

    await stripe.prices.create({
      product: created.id,
      unit_amount: product.price,
      currency: "usd",
    });

    console.log(`  ✓ ${product.metadata.gender}'s ${product.name} @ $${(product.price / 100).toFixed(2)}`);
  }

  console.log("\nAll LUMÍCHE products seeded successfully!");
}

seedProducts().catch(console.error);
