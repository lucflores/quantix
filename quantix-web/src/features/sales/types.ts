export type PaymentMethod = "EFECTIVO" | "CTA_CTE";

export type SaleItemInput = {
  productId: string;
  quantity: number; 
  unitPrice?: number; 
};

export type CreateSaleDto = {
  payment: PaymentMethod;
  customerId?: string; 
  items: SaleItemInput[];
};

export interface Sale {
  id: string;
  createdAt: string;
  customerId: string | null;
  payment: PaymentMethod;
  customerRel?: {
    name: string;
  };
  
  items: {
    id: string;
    quantity: string; 
    unitPrice: string; 
    product?: {
      name: string;
      sku: string;
    };
  }[];
  totalAmount?: string; 
}

export interface SalesResponse {
  data: Sale[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}