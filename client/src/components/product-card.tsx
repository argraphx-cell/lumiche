import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  priceId: string;
  currency: string;
  image?: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  priceId,
  currency,
  image,
  category,
  isNew,
  isFeatured,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatPrice = (amount: number, curr = "usd") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr.toUpperCase(),
    }).format(amount / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      priceId,
      name,
      price,
      currency,
      quantity: 1,
      image,
    });
    toast({
      title: "Added to bag",
      description: `${name} has been added to your shopping bag.`,
    });
  };

  return (
    <Link href={`/product/${id}`} data-testid={`card-product-${id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden mb-3">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <Badge className="text-[10px] tracking-widest uppercase bg-foreground text-background px-2">
                New
              </Badge>
            )}
            {isFeatured && !isNew && (
              <Badge className="text-[10px] tracking-widest uppercase bg-gold text-foreground px-2">
                Featured
              </Badge>
            )}
          </div>

          <div
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ visibility: "visible" }}
          >
            <Button
              className="w-full text-xs tracking-widest uppercase"
              onClick={handleAddToCart}
              data-testid={`button-add-to-cart-${id}`}
            >
              Add to Bag
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          {category && (
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              {category}
            </p>
          )}
          <p className="text-sm font-medium leading-tight" data-testid={`text-product-name-${id}`}>
            {name}
          </p>
          <p className="text-sm text-muted-foreground" data-testid={`text-product-price-${id}`}>
            {formatPrice(price, currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}
