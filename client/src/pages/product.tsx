import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Product {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, string>;
  images: string[];
  prices: Array<{
    id: string;
    unit_amount: number;
    currency: string;
  }>;
}

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: productsData } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products"],
  });

  const product = productsData?.data?.find((p) => p.id === id);
  const isLoading = !productsData;

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | LUMÍCHE`;
    } else {
      document.title = "Product | LUMÍCHE";
    }
  }, [product]);

  const relatedProducts = productsData?.data
    ?.filter((p) => p.id !== id && p.prices?.length > 0)
    .slice(0, 4) || [];

  const formatPrice = (amount: number, currency = "usd") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);

  const handleAddToCart = () => {
    if (!product) return;
    const price = product.prices?.[0];
    if (!price) return;

    addItem({
      productId: product.id,
      priceId: price.id,
      name: product.name,
      price: price.unit_amount,
      currency: price.currency,
      quantity,
      image: product.metadata?.localImage,
      size: selectedSize || undefined,
    });

    setAddedToCart(true);
    toast({
      title: "Added to bag",
      description: `${product.name}${selectedSize ? ` (${selectedSize})` : ""} — Qty: ${quantity}`,
    });

    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] rounded-md" />
            <div className="space-y-5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-semibold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = product.prices?.[0];
  const image = product.metadata?.localImage;

  return (
    <div className="min-h-screen" data-testid="page-product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <Link href="/shop" data-testid="link-back-to-shop">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground -ml-2 mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          <div className="space-y-3">
            <div className="aspect-[3/4] rounded-md overflow-hidden bg-muted">
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:pt-4">
            <div className="flex items-center gap-3 mb-4">
              {(product.metadata?.gender || product.metadata?.category) && (
                <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                  {[product.metadata.gender, product.metadata.category].filter(Boolean).join(" · ")}
                </p>
              )}
              {product.metadata?.isNew === "true" && (
                <Badge className="text-[9px] tracking-widest uppercase">New</Badge>
              )}
            </div>

            <h1
              className="font-playfair text-3xl md:text-4xl font-semibold leading-tight mb-4"
              data-testid="text-product-name"
            >
              {product.name}
            </h1>

            {price && (
              <p
                className="text-2xl font-medium mb-6"
                data-testid="text-product-price"
              >
                {formatPrice(price.unit_amount, price.currency)}
              </p>
            )}

            {product.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <Separator className="mb-8" />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-[0.12em] uppercase font-medium">
                  Size
                  {selectedSize && (
                    <span className="ml-2 text-muted-foreground normal-case tracking-normal">
                      — {selectedSize}
                    </span>
                  )}
                </p>
                <button className="text-xs text-muted-foreground underline-offset-2 underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                    className={`w-12 h-12 text-sm border transition-all rounded-md ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs tracking-[0.12em] uppercase font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-8 text-center font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full text-sm tracking-[0.12em] uppercase gap-2"
              size="lg"
              onClick={handleAddToCart}
              disabled={addedToCart}
              data-testid="button-add-to-cart"
            >
              {addedToCart ? (
                <>
                  <Check className="w-4 h-4" />
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </>
              )}
            </Button>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="details">
                <AccordionTrigger className="text-xs tracking-[0.12em] uppercase font-medium">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                    {product.metadata?.material && (
                      <p><span className="font-medium text-foreground">Material:</span> {product.metadata.material}</p>
                    )}
                    {product.metadata?.care && (
                      <p><span className="font-medium text-foreground">Care:</span> {product.metadata.care}</p>
                    )}
                    {product.metadata?.origin && (
                      <p><span className="font-medium text-foreground">Origin:</span> {product.metadata.origin}</p>
                    )}
                    <p>All our pieces are crafted with meticulous attention to detail, using sustainably sourced materials.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xs tracking-[0.12em] uppercase font-medium">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Complimentary shipping on orders over $300. Standard delivery 3–5 business days.</p>
                    <p>Free returns within 30 days of delivery. Items must be unworn and in original packaging.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sustainability">
                <AccordionTrigger className="text-xs tracking-[0.12em] uppercase font-medium">
                  Sustainability
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Crafted using sustainably sourced fabrics and responsible manufacturing practices. We are committed to a more conscious approach to luxury fashion.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-playfair text-2xl md:text-3xl font-semibold">
                You May Also Like
              </h2>
              <Link href="/shop">
                <Button variant="ghost" size="sm" className="text-xs tracking-[0.1em] uppercase">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p) => {
                const pr = p.prices?.[0];
                if (!pr) return null;
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={pr.unit_amount}
                    priceId={pr.id}
                    currency={pr.currency}
                    image={p.metadata?.localImage}
                    category={p.metadata?.category}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
