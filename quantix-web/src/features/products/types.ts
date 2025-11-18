export interface Product {
  id: string;
  sku: string;
  name: string;
  cost: string;     
  price: string;     
  stock: string;     
  minStock: string;  
  active: boolean;
  unit: string;
  step: string;     
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  cost: number;
  price: number;
  stock: number;    
  minStock: number;
  unit: string;
  active: boolean;
}

export interface UpdateProductDto {
  sku?: string;
  name?: string;
  cost?: number;
  price?: number;
  minStock?: number;
  active?: boolean;
  unit?: string;
}

export interface ProductsResponse {
  data: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}