import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccess() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  const { data, isLoading } = useQuery<{ session: any }>({
    queryKey: ["/api/checkout/session", sessionId],
    queryFn: async () => {
      if (!sessionId) return { session: null };
      const res = await fetch(`/api/checkout/session/${sessionId}`);
      return res.json();
    },
    enabled: !!sessionId,
  });

  const session = data?.session;

  const formatPrice = (amount: number, currency = "usd") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center" data-testid="page-checkout-success">
      <div className="max-w-lg w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-8">
          <CheckCircle className="w-10 h-10 text-gold" />
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-3">
          Thank You
        </h1>
        <p className="text-muted-foreground text-base mb-2">
          Your order has been confirmed.
        </p>

        {session?.customer_email && (
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation has been sent to{" "}
            <span className="text-foreground font-medium">{session.customer_email}</span>
          </p>
        )}

        {!session?.customer_email && !isLoading && (
          <p className="text-sm text-muted-foreground mb-8">
            Your order confirmation details will arrive by email shortly.
          </p>
        )}

        {session && (
          <div className="bg-card border border-border rounded-md p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs tracking-[0.12em] uppercase font-medium">Order Summary</p>
            </div>
            <Separator className="mb-4" />

            {session.line_items?.data?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium">{item.description || item.price?.product?.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(item.amount_total || 0, session.currency)}
                </p>
              </div>
            ))}

            {session.amount_total && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Total</p>
                  <p className="text-sm font-semibold">
                    {formatPrice(session.amount_total, session.currency)}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link href="/shop" data-testid="link-continue-shopping">
            <Button className="w-full gap-2 text-xs tracking-[0.1em] uppercase" size="lg">
              Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/" data-testid="link-go-home">
            <Button variant="ghost" className="w-full text-xs tracking-[0.1em] uppercase">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
