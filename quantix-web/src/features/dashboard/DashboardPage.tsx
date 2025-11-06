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
  TrendingDown
} from 'lucide-react';

const quickActions = [
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Compras', href: '/purchases', icon: ShoppingCart },
  { name: 'Ventas', href: '/sales', icon: TrendingUp },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Movimientos', href: '/movements', icon: ArrowLeftRight },
  { name: 'Stock', href: '/reports/low-stock', icon: BarChart3 },
];

const stats = [
  { label: 'Productos Activos', value: '156', icon: Package, trend: '+12%' },
  { label: 'Ventas del Mes', value: '$48,290', icon: TrendingUp, trend: '+8%' },
  { label: 'Stock Bajo', value: '23', icon: AlertCircle, trend: '-5%', alert: true },
  { label: 'Clientes Activos', value: '89', icon: Users, trend: '+15%' },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visión general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 glass-card hover:shadow-glow transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-xs ${stat.alert ? 'text-muted-foreground' : 'text-accent'}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.alert ? 'bg-muted/20' : 'bg-accent/20'}`}>
                <stat.icon className={`w-5 h-5 ${stat.alert ? 'text-muted-foreground' : 'text-accent'}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} to={action.href}>
              <Card className="p-4 glass-card hover:shadow-glow transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/80 backdrop-blur-sm shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all">
                    <action.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{action.name}</h3>
                    <p className="text-xs text-muted-foreground">Gestionar {action.name.toLowerCase()}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 glass-card">
        <h2 className="text-lg font-semibold text-foreground mb-3">Actividad Reciente</h2>
        <div className="space-y-3">
          {[
            { action: 'Venta realizada', detail: 'Producto #1234 - $450', time: 'Hace 5 min', icon: TrendingUp },
            { action: 'Stock actualizado', detail: 'Producto XYZ - +50 unidades', time: 'Hace 12 min', icon: Package },
            { action: 'Nuevo cliente', detail: 'Juan Pérez registrado', time: 'Hace 1 hora', icon: Users },
            { action: 'Alerta de stock', detail: 'Producto ABC bajo stock mínimo', time: 'Hace 2 horas', icon: AlertCircle },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent/20">
                <activity.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
