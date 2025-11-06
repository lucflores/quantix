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

export type Sale = {
  id: string;
  date: string; // ISO
  customerName?: string;
  total: number;
  payment: PaymentMethod;
};
