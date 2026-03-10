import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./cart-drawer";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop?category=collections" },
  { label: "New Arrivals", href: "/shop?category=new" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, isOpen, openCart, closeCart } = useCart();
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-background/95 backdrop-blur-sm border-b border-border";

  const textColor = isHome && !scrolled
    ? "text-white"
    : "text-foreground";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-8">
              <button
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileOpen
                  ? <X className={`w-5 h-5 ${textColor}`} />
                  : <Menu className={`w-5 h-5 ${textColor}`} />
                }
              </button>

              <Link href="/" data-testid="link-home-logo">
                <span className={`font-playfair text-xl md:text-2xl font-semibold tracking-[0.15em] uppercase ${textColor}`}>
                  LUMÍCHE
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <span className={`text-xs tracking-[0.12em] uppercase font-medium transition-colors duration-200 ${textColor} hover:text-gold`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className={`${textColor} relative`}
                data-testid="button-cart"
                onClick={openCart}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-[10px] font-semibold text-background flex items-center justify-center rounded-full">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border px-4 py-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <span className="text-sm tracking-[0.1em] uppercase font-medium text-foreground block py-1">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={isOpen} onClose={closeCart} />
    </>
  );
}
