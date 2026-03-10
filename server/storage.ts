import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { orders, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  listProductsWithPrices(active?: boolean): Promise<any[]>;
  getProduct(productId: string): Promise<any>;
  getPricesForProduct(productId: string): Promise<any[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderBySessionId(sessionId: string): Promise<Order | undefined>;
}

export class Storage implements IStorage {
  async listProductsWithPrices(active = true): Promise<any[]> {
    try {
      const result = await db.execute(
        sql`
          WITH paginated_products AS (
            SELECT id, name, description, metadata, active, images
            FROM stripe.products
            WHERE active = ${active}
            ORDER BY created DESC
          )
          SELECT 
            p.id as product_id,
            p.name as product_name,
            p.description as product_description,
            p.active as product_active,
            p.metadata as product_metadata,
            p.images as product_images,
            pr.id as price_id,
            pr.unit_amount,
            pr.currency,
            pr.recurring,
            pr.active as price_active
          FROM paginated_products p
          LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
          ORDER BY p.name, pr.unit_amount
        `
      );

      const productsMap = new Map<string, any>();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata || {},
            images: row.product_images || [],
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
          });
        }
      }
      return Array.from(productsMap.values());
    } catch {
      return [];
    }
  }

  async getProduct(productId: string): Promise<any> {
    try {
      const result = await db.execute(
        sql`SELECT * FROM stripe.products WHERE id = ${productId}`
      );
      return (result.rows as any[])[0] || null;
    } catch {
      return null;
    }
  }

  async getPricesForProduct(productId: string): Promise<any[]> {
    try {
      const result = await db.execute(
        sql`SELECT * FROM stripe.prices WHERE product = ${productId} AND active = true`
      );
      return result.rows as any[];
    } catch {
      return [];
    }
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const [order] = await db
      .insert(orders)
      .values({ ...insertOrder, id })
      .returning();
    return order;
  }

  async getOrderBySessionId(sessionId: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, sessionId));
    return order;
  }
}

export const storage = new Storage();
