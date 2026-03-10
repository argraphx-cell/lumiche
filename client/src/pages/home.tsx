import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { ArrowRight } from "lucide-react";

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

const CITIES = [
  "Accra", "Dakar", "Harlem", "Johannesburg",
  "Kingston", "Lagos", "Nairobi", "Port-au-Prince",
];

export default function Home() {
  useEffect(() => {
    document.title = "LUMÍCHE | Afro-Diasporic Luxury Fashion";
  }, []);

  const { data, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products"],
  });

  const products = data?.data || [];
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen" data-testid="page-home">
      {/* HERO */}
      <section className="relative h-screen flex items-end pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium mt-[18px] mb-[18px] text-justify">
              {CITIES.join(" \u00B7 ")}
            </p>
            <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white leading-[1.05] mb-6">
              You Are<br />
              <em className="not-italic text-gold">the Spark.</em>
            </h1>
            <p className="text-white/70 md:text-lg mb-10 max-w-xl text-[16px]">
              LUMÍCHE is activated by the individual who brings it to life. Discover a LUMÍCHE original that lights your path.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" data-testid="link-hero-shop">
                <Button size="lg" className="text-xs tracking-[0.15em] uppercase px-8">
                  Ignite Your Style
                </Button>
              </Link>
              <a href="#manifesto" data-testid="link-hero-manifesto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xs tracking-[0.15em] uppercase px-8 bg-white/10 border-white/40 text-white backdrop-blur-sm"
                >
                  Our Story
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-white/30" />
          <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mt-3">
            Scroll
          </p>
        </div>
      </section>
      {/* CITY MARQUEE */}
      <section className="py-5 bg-foreground overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-[marquee_28s_linear_infinite]">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              {CITIES.map((city, j) => (
                <span key={`${i}-${j}`} className="flex items-center">
                  <span className="text-background/35 text-[10px] tracking-[0.3em] uppercase px-6">
                    {city}
                  </span>
                  <span className="text-gold/60 text-xs">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
      {/* FEATURED PIECES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium mb-2">
              The Collection
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold">
              Ignited Pieces
            </h2>
          </div>
          <Link href="/shop" data-testid="link-view-all">
            <Button variant="ghost" className="text-xs tracking-[0.1em] uppercase gap-2">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-md" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => {
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
                  category={product.metadata?.category}
                  isNew={product.metadata?.isNew === "true"}
                  isFeatured={product.metadata?.featured === "true"}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-border rounded-md">
            <p className="text-muted-foreground">The collection is being ignited. Check back shortly.</p>
          </div>
        )}
      </section>
      {/* COLLECTIONS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0 gap-5">
        <Link href="/shop?category=women" data-testid="link-collection-women" className="md:col-span-1">
          <div className="group relative aspect-[3/4] overflow-hidden rounded-md cursor-pointer">
            <img
              src="/images/product-womens-turtleneck.png"
              alt="Women's Knitwear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6">
              <p className="text-gold/80 text-[10px] tracking-[0.25em] uppercase mb-2">I — The Warmth Edit</p>
              <h3 className="font-playfair text-2xl text-white font-semibold mb-4">
                Women's Knitwear
              </h3>
              <Button variant="outline" size="sm" className="text-[10px] tracking-[0.15em] uppercase bg-white/10 border-white/40 text-white backdrop-blur-sm">
                Discover →
              </Button>
            </div>
          </div>
        </Link>

        <Link href="/shop?category=men" data-testid="link-collection-men" className="md:col-span-1">
          <div className="group relative aspect-[3/4] overflow-hidden rounded-md cursor-pointer">
            <img
              src="/images/product-mens-crewneck.png"
              alt="Men's Knitwear"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6">
              <p className="text-gold/80 text-[10px] tracking-[0.25em] uppercase mb-2">II — The City Essential</p>
              <h3 className="font-playfair text-2xl text-white font-semibold mb-4">
                Men's Knitwear
              </h3>
              <Button variant="outline" size="sm" className="text-[10px] tracking-[0.15em] uppercase bg-white/10 border-white/40 text-white backdrop-blur-sm">
                Discover →
              </Button>
            </div>
          </div>
        </Link>

        <div className="grid grid-rows-2 gap-5 md:col-span-1">
          <Link href="/shop?category=trousers" data-testid="link-collection-trousers">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-md cursor-pointer">
              <img
                src="/images/product-womens-wide-trousers.png"
                alt="Trousers"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-gold/70 text-[10px] tracking-[0.25em] uppercase mb-1">III — The Foundation</p>
                <h3 className="font-playfair text-xl text-white font-semibold">Trousers</h3>
              </div>
            </div>
          </Link>

          <Link href="/shop?category=tops" data-testid="link-collection-tops">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-md cursor-pointer">
              <img
                src="/images/product-mens-henley.png"
                alt="Tops"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-gold/70 text-[10px] tracking-[0.25em] uppercase mb-1">IV — Second Skin</p>
                <h3 className="font-playfair text-xl text-white font-semibold">Tops &amp; Essentials</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>
      {/* MANIFESTO SECTION */}
      <section id="manifesto" className="bg-foreground py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-6 font-medium">
                Definition
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-background leading-[1.1] mb-8">
                A wick awaiting<br />
                <em className="not-italic text-gold">its spark.</em>
              </h2>
              <p className="text-background/60 text-sm leading-relaxed mb-6">
                LUMÍCHE ("wick-light" or "strand") is activated by the individual who brings it to life. Each piece is ignited, transforming the wearer into a beacon of creativity and style.
              </p>
              <p className="text-background/60 text-sm leading-relaxed mb-10">
                Rooted in cities shaped by Afro-diasporic culture — Accra, Dakar, Harlem, Johannesburg, Kingston, Lagos, Nairobi, and Port-au-Prince — LUMÍCHE channels the energy and resilience of the urban centers where culture begins.
              </p>
              <Link href="/shop" data-testid="link-manifesto-shop">
                <Button
                  variant="outline"
                  className="text-xs tracking-[0.15em] uppercase border-background/30 text-background gap-2"
                >
                  Shop the Collection <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-8">
              <blockquote className="border-l-2 border-gold pl-8">
                <p className="font-playfair text-xl md:text-2xl text-background/80 italic leading-relaxed">
                  "Born of many cities, one spirit. The spark and the wick."
                </p>
              </blockquote>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {CITIES.map((city) => (
                  <div key={city} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-background/50 text-xs tracking-[0.15em] uppercase">
                      {city}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* NEWSLETTER */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium mb-3">
            Join the Flame
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">
            Stay Ignited
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
            Be first to discover new drops, exclusive city events, and the stories behind each piece.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
            data-testid="form-newsletter"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              data-testid="input-newsletter-email"
            />
            <Button type="submit" className="text-xs tracking-[0.1em] uppercase px-6" data-testid="button-newsletter-subscribe">
              Ignite
            </Button>
          </form>
          <p className="text-muted-foreground text-xs mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
