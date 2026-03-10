import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

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

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "knitwear", label: "Knitwear" },
  { value: "tops", label: "Tops" },
  { value: "trousers", label: "Trousers" },
  { value: "new", label: "New Arrivals" },
];

const SORTS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default function Shop() {
  useEffect(() => {
    document.title = "Shop Sweaters & Tops | LUMÍCHE";
  }, []);

  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = urlParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { data, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products"],
  });

  const products = data?.data || [];

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.prices && p.prices.length > 0);

    if (activeCategory !== "all") {
      if (activeCategory === "new") {
        list = list.filter((p) => p.metadata?.isNew === "true");
      } else if (activeCategory === "women" || activeCategory === "men") {
        list = list.filter(
          (p) => p.metadata?.gender?.toLowerCase() === activeCategory
        );
      } else {
        list = list.filter(
          (p) =>
            p.metadata?.category?.toLowerCase() === activeCategory.toLowerCase()
        );
      }
    }

    switch (sort) {
      case "price-asc":
        list = [...list].sort(
          (a, b) => (a.prices[0]?.unit_amount || 0) - (b.prices[0]?.unit_amount || 0)
        );
        break;
      case "price-desc":
        list = [...list].sort(
          (a, b) => (b.prices[0]?.unit_amount || 0) - (a.prices[0]?.unit_amount || 0)
        );
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, activeCategory, sort]);

  const sortLabel = SORTS.find((s) => s.value === sort)?.label || "Featured";

  return (
    <div className="min-h-screen" data-testid="page-shop">
      <div className="bg-card border-b border-border pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium mb-2">
            The Collection
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold">
            Sweaters &amp; Tops
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {isLoading ? "" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
          </p>
        </div>
      </div>

      <div className="border-b border-border sticky top-[64px] md:top-[80px] z-30 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex-shrink-0 px-4 py-1.5 text-xs tracking-[0.12em] uppercase rounded-full transition-colors ${
                    activeCategory === cat.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-category-${cat.value}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 text-xs tracking-[0.1em] text-muted-foreground py-3"
                data-testid="button-sort"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{sortLabel}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[180px] py-1">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setSort(s.value); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs tracking-[0.08em] ${
                        sort === s.value ? "text-foreground font-medium" : "text-muted-foreground"
                      } hover:bg-muted`}
                      data-testid={`button-sort-${s.value}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-md" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl font-medium mb-3">No pieces found</p>
            <p className="text-muted-foreground text-sm mb-6">
              {products.length === 0
                ? "The collection is being ignited. Please check back shortly."
                : "Try a different filter."}
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveCategory("all")}
              data-testid="button-clear-filter"
            >
              View All
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const price = product.prices?.[0];
              if (!price) return null;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={price.unit_amount}
                  priceId={price.id}
                  currency={price.currency}
                  image={product.metadata?.localImage}
                  category={`${product.metadata?.gender || ""} · ${product.metadata?.category || ""}`}
                  isNew={product.metadata?.isNew === "true"}
                  isFeatured={product.metadata?.featured === "true"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
