import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/checkout", {
        items: items.map((item) => ({
          priceId: item.priceId,
          quantity: item.quantity,
        })),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (amount: number, currency = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0" data-testid="cart-drawer">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-playfair text-xl font-medium">
              Shopping Bag
            </SheetTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-cart"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <SheetDescription className="sr-only">
            Your shopping bag with selected items
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-playfair text-lg font-medium">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add items to get started
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-2"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-5">
                {items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.size}-${idx}`}
                    className="flex gap-4"
                    data-testid={`cart-item-${item.productId}`}
                  >
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm leading-tight">{item.name}</p>
                          {item.size && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 flex-shrink-0 -mr-1"
                          onClick={() => removeItem(item.productId, item.size)}
                          data-testid={`button-remove-item-${item.productId}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                          data-testid={`button-decrease-qty-${item.productId}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-5 text-center" data-testid={`text-qty-${item.productId}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                          data-testid={`button-increase-qty-${item.productId}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground tracking-wide">Subtotal</span>
                <span className="font-semibold" data-testid="text-cart-total">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={() => checkoutMutation.mutate()}
                disabled={checkoutMutation.isPending}
                data-testid="button-checkout"
              >
                {checkoutMutation.isPending ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
