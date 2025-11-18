import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  BarChart3,
  ArrowLeftRight,
  AlertCircle,
  Loader2, 
  UserPlus,
  Truck, 
} from 'lucide-react';
import { useDashboardMetrics } from '@/features/reports/hooks/useReports'; 

function formatCurrency(value: string | number) {
    const num = parseFloat(String(value));
    if (isNaN(num)) return '$0.00';
    return num.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function timeSince(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
}


const quickActions = [
  { name: 'Productos', href: '/products', icon: Package, description: 'Gestionar productos' },
  { name: 'Compras', href: '/purchases', icon: ShoppingCart, description: 'Gestionar compras' },
  { name: 'Ventas', href: '/sales', icon: TrendingUp, description: 'Gestionar ventas' },
  { name: 'Clientes', href: '/customers', icon: Users, description: 'Gestionar clientes' },
  { name: 'Proveedores', href: '/suppliers', icon: Truck, description: 'Gestionar proveedores' }, 
  { name: 'Movimientos', href: '/movements', icon: ArrowLeftRight, description: 'Gestionar movimientos' },
  { name: 'Stock', href: '/reports/low-stock', icon: BarChart3, description: 'Ver productos en alerta' },
];

export const DashboardPage = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();
  
  // Mapeamos los datos reales del hook a las cards de métricas
  const statsData = [
    { label: 'Productos Activos', value: metrics?.activeProducts ?? 0, icon: Package, trend: '+12%', color: 'green-500' },
    { label: 'Ventas del Mes', value: formatCurrency(metrics?.salesThisMonth ?? 0), icon: TrendingUp, trend: '+8%', color: 'blue-500' },
    { label: 'Stock Bajo', value: metrics?.lowStockCount ?? 0, icon: AlertCircle, trend: '-5%', alert: (metrics?.lowStockCount ?? 0) > 0, color: 'red-500' },
    { label: 'Clientes Activos', value: metrics?.activeCustomers ?? 0, icon: Users, trend: '+15%', color: 'indigo-500' },
  ];

  // Combinar y ordenar la actividad reciente (Ventas + Clientes)
  const combinedActivity = [
      // Actividad de Ventas
      ...(metrics?.recentActivity.sales.map(s => ({ 
          ...s, 
          action: 'Venta realizada',
          detail: `Cliente: ${s.customerName}`,
          icon: TrendingUp,
          time: timeSince(s.createdAt),
          type: 'SALE',
      })) ?? []),
      // Actividad de Clientes
      ...(metrics?.recentActivity.customers.map(c => ({ 
          ...c, 
          action: 'Nuevo cliente', 
          detail: `${c.name} registrado`,
          icon: UserPlus,
          time: timeSince(c.createdAt),
          type: 'CUSTOMER_REGISTER'
      })) ?? []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visión general del sistema</p>
      </div>

      {/* 1. Stats Grid (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label} className="p-4 glass-card hover:shadow-glow transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {isLoading ? (
                    <Loader2 className={`w-6 h-6 animate-spin text-${stat.color}`} />
                ) : (
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                )}
                <p className={`text-xs ${stat.alert ? 'text-red-500' : 'text-green-500'}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.alert ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                <stat.icon className={`w-5 h-5 ${stat.alert ? 'text-red-500' : 'text-green-500'}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} to={action.href}>
              <Card className="p-4 glass-card hover:shadow-glow transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/80 backdrop-blur-sm shadow-lg group-hover:scale-105 group-hover:bg-primary transition-all">
                    <action.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{action.name}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity */}
      <Card className="p-4 glass-card">
        <h2 className="text-lg font-semibold text-foreground mb-3">Actividad Reciente</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-6 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Cargando actividad...
            </div>
          ) : combinedActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No hay actividad reciente registrada.</p>
          ) : (
            combinedActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-lg ${activity.type === 'SALE' ? 'bg-green-600/20' : 'bg-indigo-600/20'}`}>
                  <activity.icon className={`w-4 h-4 ${activity.type === 'SALE' ? 'text-green-500' : 'text-indigo-500'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};