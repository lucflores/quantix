export interface LowStockItem {
  id: string;
  sku: string;
  name: string;
  stock: string;     
  minStock: string;  
  shortage: string;   
  stockNum?: number;    
  minNum?: number;
  shortageNum?: number;
}

export interface LowStockResponse {
  page: number;
  limit: number;
  total: number;      
  items: LowStockItem[];
}

export interface DashboardMetric {
    type: 'SALE' | 'CUSTOMER_REGISTER' | 'MOVEMENT' | 'LOW_STOCK';
    id: string;
    description: string;
    createdAt: string;
}

export interface DashboardMetricsResponse {
    activeProducts: number;
    lowStockCount: number;
    activeCustomers: number;
    salesThisMonth: string; 
    recentActivity: {
        sales: { id: string; type: 'SALE'; customerName: string; createdAt: string }[];
        customers: { id: string; type: 'CUSTOMER_REGISTER'; name: string; createdAt: string }[];
    }
}