export interface PurchaseItemDto {
  productId: string;
  quantity: string; 
  unitCost: string; 
}

export interface CreatePurchaseDto {
  supplierId?: string | null; 
  items: PurchaseItemDto[];  
}

export interface Purchase {
  id: string;
  createdAt: string; 
  supplierId: string | null;
  supplierRel?: {
    name: string;
  };
  
  items: {
    id: string;
    quantity: string;
    unitCost: string;
    product: {
      name: string;
      sku: string;
    };
  }[];
  totalAmount?: string;
}

export interface PurchasesResponse {
  items: Purchase[];
}

export interface PurchasesResponse {
  data: Purchase[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}