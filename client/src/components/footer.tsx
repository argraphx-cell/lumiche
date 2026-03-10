import { Link } from "wouter";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CITIES = [
  "Accra", "Dakar", "Harlem", "Johannesburg",
  "Kingston", "Lagos", "Nairobi", "Port-au-Prince",
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        <div className="mb-12 pb-12 border-b border-background/10">
          <p className="text-background/30 text-[9px] tracking-[0.3em] uppercase mb-3">
            {CITIES.join(" \u00B7 ")}
          </p>
          <p className="font-playfair text-background/50 text-base md:text-lg italic max-w-lg leading-relaxed">
            "The spark and the wick. Born of many cities, one spirit."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-playfair text-2xl tracking-[0.15em] uppercase text-background">
              LUMÍCHE
            </span>
            <p className="mt-4 text-sm text-background/50 leading-relaxed max-w-[200px]">
              A wick awaiting its spark. Activated by the individual who brings it to life.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-background/40 hover:text-gold transition-colors" data-testid="link-instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-background/40 hover:text-gold transition-colors" data-testid="link-facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-background/40 hover:text-gold transition-colors" data-testid="link-twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-background/30 mb-5">Shop</p>
            <ul className="space-y-3">
              {["New Arrivals", "Women", "Men", "Knitwear", "Tops", "Trousers"].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase().replace(" ", "-")}`}>
                    <span className="text-sm text-background/60 hover:text-gold transition-colors">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-background/30 mb-5">Story</p>
            <ul className="space-y-3">
              {["Our Manifesto", "The Cities", "Sustainability", "Press"].map((item) => (
                <li key={item}>
                  <a href="#manifesto" className="text-sm text-background/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-background/30 mb-5">Help</p>
            <ul className="space-y-3">
              {["Shipping & Returns", "Size Guide", "Care Instructions", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-background/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-background/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30 tracking-wide">
            &copy; {new Date().getFullYear()} LUMÍCHE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-background/30 hover:text-background/60 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-background/30 hover:text-background/60 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-background/30 hover:text-background/60 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
