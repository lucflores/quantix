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