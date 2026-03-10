import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CheckoutCancel() {
  const { openCart } = useCart();

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center" data-testid="page-checkout-cancel">
      <div className="max-w-sm w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-8">
          <XCircle className="w-10 h-10 text-muted-foreground" />
        </div>

        <h1 className="font-playfair text-3xl font-semibold mb-3">
          Order Cancelled
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Your order has been cancelled. No payment was taken. Your cart items are still saved.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full gap-2 text-xs tracking-[0.1em] uppercase"
            size="lg"
            onClick={openCart}
            data-testid="button-return-to-cart"
          >
            <ShoppingBag className="w-4 h-4" />
            Return to Cart
          </Button>
          <Link href="/shop" data-testid="link-continue-shopping">
            <Button variant="ghost" className="w-full text-xs tracking-[0.1em] uppercase">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
