import { Card } from '@/components/ui/card';
import { SaleForm } from './SaleForm'; 
import { SalesTable } from './SalesTable'; 
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const SalesPage = () => {
  const navigate = useNavigate();
  const goToHistory = () => {
    navigate('/sales/history'); 
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
        <p className="text-muted-foreground">Registro de ventas y salida de stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Nueva Venta</h2>
          <SaleForm />
        </Card>

        <Card className="p-6 glass-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Últimas Ventas</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToHistory}
              className="text-muted-foreground hover:text-foreground">
              <History className="w-4 h-4 mr-2" />
              Ver Historial
            </Button>
          </div>
          <SalesTable />
        </Card>
      </div>
    </div>
  );
};