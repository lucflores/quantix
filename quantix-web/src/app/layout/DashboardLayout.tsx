import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp,
  Users, BarChart3, ArrowLeftRight, LogOut
} from "lucide-react";
import waveBg from "@/assets/wave-bg.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Movimientos", href: "/movements", icon: ArrowLeftRight },
  { name: "Compras", href: "/purchases", icon: ShoppingCart },
  { name: "Ventas", href: "/sales", icon: TrendingUp },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Stock", href: "/reports/low-stock", icon: BarChart3 },
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">Q</span>
            </div>
            <span className="text-xl font-bold">Quantix</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name ?? "Usuario"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? "user@quantix.com"}</p>
            </div>
            <ThemeToggle />
            <button
              onClick={() => { logout(); navigate("/login", { replace: true }); }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-accent/20 text-accent shadow-glow"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                }`
              }
              end={item.href === "/dashboard"}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none z-0"
          style={{ backgroundImage: `url(${waveBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
