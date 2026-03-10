import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Archive, LogOut, Package } from "lucide-react";

const ADMIN_KEY = "lumiche_admin_pw";

interface Product {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, string>;
  prices: Array<{ id: string; unit_amount: number; currency: string }>;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  gender: string;
  category: string;
  material: string;
  care: string;
  origin: string;
  localImage: string;
  isNew: string;
  featured: string;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  gender: "Women",
  category: "Knitwear",
  material: "",
  care: "",
  origin: "",
  localImage: "",
  isNew: "false",
  featured: "false",
};

function authHeaders(pw: string) {
  return { "x-admin-password": pw };
}

export default function Admin() {
  const [pw, setPw] = useState(() => localStorage.getItem(ADMIN_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Admin — LUMÍCHE";
    if (pw) verifyStored(pw);
  }, []);

  async function verifyStored(password: string) {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPw(password);
        setAuthed(true);
      } else {
        localStorage.removeItem(ADMIN_KEY);
        setPw("");
      }
    } catch {}
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginInput }),
      });
      if (res.ok) {
        localStorage.setItem(ADMIN_KEY, loginInput);
        setPw(loginInput);
        setAuthed(true);
      } else {
        setLoginError("Incorrect password.");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
  }

  function logout() {
    localStorage.removeItem(ADMIN_KEY);
    setPw("");
    setAuthed(false);
  }

  const { data, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products"],
    enabled: authed,
  });

  const products = data?.data || [];

  const createMutation = useMutation({
    mutationFn: async (f: ProductForm) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(pw) },
        body: JSON.stringify({
          name: f.name,
          description: f.description,
          price: f.price,
          metadata: {
            gender: f.gender,
            category: f.category,
            material: f.material,
            care: f.care,
            origin: f.origin,
            localImage: f.localImage,
            isNew: f.isNew,
            featured: f.featured,
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created", description: form.name });
      setFormOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, f }: { id: string; f: ProductForm }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders(pw) },
        body: JSON.stringify({
          name: f.name,
          description: f.description,
          metadata: {
            gender: f.gender,
            category: f.category,
            material: f.material,
            care: f.care,
            origin: f.origin,
            localImage: f.localImage,
            isNew: f.isNew,
            featured: f.featured,
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated" });
      setFormOpen(false);
      setEditing(null);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(pw),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product archived" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.prices?.[0] ? String(p.prices[0].unit_amount / 100) : "",
      gender: p.metadata?.gender || "Women",
      category: p.metadata?.category || "Knitwear",
      material: p.metadata?.material || "",
      care: p.metadata?.care || "",
      origin: p.metadata?.origin || "",
      localImage: p.metadata?.localImage || "",
      isNew: p.metadata?.isNew || "false",
      featured: p.metadata?.featured || "false",
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, f: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" data-testid="page-admin-login">
        <div className="w-full max-w-sm">
          <p className="font-playfair text-3xl tracking-[0.1em] mb-2 text-center">LUMÍCHE</p>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase text-center mb-10">Admin</p>
          <form onSubmit={handleLogin} className="space-y-4" data-testid="form-admin-login">
            <Input
              type="password"
              placeholder="Admin password"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="text-sm"
              data-testid="input-admin-password"
              autoFocus
            />
            {loginError && (
              <p className="text-destructive text-xs" data-testid="text-admin-login-error">{loginError}</p>
            )}
            <Button type="submit" className="w-full text-xs tracking-[0.15em] uppercase" data-testid="button-admin-login">
              Enter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Package className="w-4 h-4 text-gold" />
          <span className="font-playfair text-lg tracking-[0.12em]">LUMÍCHE</span>
          <span className="text-muted-foreground text-xs tracking-[0.15em] uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={openAdd} className="text-xs tracking-[0.1em] uppercase gap-2" data-testid="button-add-product">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </Button>
          <Button size="sm" variant="ghost" onClick={logout} className="text-xs gap-2" data-testid="button-admin-logout">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-2xl font-semibold mb-1">Products</h1>
          <p className="text-muted-foreground text-sm">{products.length} active pieces</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-sm">Loading products...</div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm" data-testid="table-products">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium w-16">Image</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Product</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium hidden md:table-cell">Gender</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-product-${p.id}`}>
                    <td className="px-4 py-3">
                      {p.metadata?.localImage ? (
                        <img
                          src={p.metadata.localImage}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm leading-tight" data-testid={`text-product-name-${p.id}`}>{p.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1 max-w-[200px]">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{p.metadata?.category || "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{p.metadata?.gender || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium" data-testid={`text-product-price-${p.id}`}>
                        {p.prices?.[0]
                          ? `$${(p.prices[0].unit_amount / 100).toFixed(0)}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex gap-1.5">
                        {p.metadata?.isNew === "true" && (
                          <Badge variant="secondary" className="text-[9px] tracking-widest uppercase">New</Badge>
                        )}
                        {p.metadata?.featured === "true" && (
                          <Badge className="text-[9px] tracking-widest uppercase bg-gold/20 text-gold border-gold/30">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          className="h-7 w-7 p-0"
                          data-testid={`button-edit-${p.id}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Archive "${p.name}"?`)) archiveMutation.mutate(p.id);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          data-testid={`button-archive-${p.id}`}
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={(o) => { if (!o) { setFormOpen(false); setEditing(null); } }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" data-testid="dialog-product-form">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">
              {editing ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cashmere Ribbed Turtleneck"
                  required
                  data-testid="input-product-name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                  data-testid="input-product-description"
                />
              </div>
              {!editing && (
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Price (USD) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 895.00"
                    required
                    data-testid="input-product-price"
                  />
                  <p className="text-[10px] text-muted-foreground">Price cannot be changed after creation via Stripe.</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Gender</label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Category</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Knitwear">Knitwear</SelectItem>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Trousers">Trousers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Image Path</label>
                <Input
                  value={form.localImage}
                  onChange={(e) => setForm({ ...form, localImage: e.target.value })}
                  placeholder="/images/product-example.png"
                  data-testid="input-product-image"
                />
                {form.localImage && (
                  <img src={form.localImage} alt="Preview" className="w-20 h-20 object-cover rounded-md mt-1 bg-muted" />
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Material</label>
                <Input
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="e.g. 100% Grade-A Cashmere"
                  data-testid="input-product-material"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Care</label>
                  <Input
                    value={form.care}
                    onChange={(e) => setForm({ ...form, care: e.target.value })}
                    placeholder="e.g. Dry clean only"
                    data-testid="input-product-care"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Origin</label>
                  <Input
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    placeholder="e.g. Made in Italy"
                    data-testid="input-product-origin"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">New Arrival</label>
                  <Select value={form.isNew} onValueChange={(v) => setForm({ ...form, isNew: v })}>
                    <SelectTrigger data-testid="select-isnew">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">Featured</label>
                  <Select value={form.featured} onValueChange={(v) => setForm({ ...form, featured: v })}>
                    <SelectTrigger data-testid="select-featured">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 text-xs tracking-[0.1em] uppercase"
                data-testid="button-submit-product"
              >
                {isPending ? "Saving..." : editing ? "Save Changes" : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setFormOpen(false); setEditing(null); }}
                data-testid="button-cancel-product"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
