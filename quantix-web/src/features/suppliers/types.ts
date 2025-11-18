export interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cuit: string | null;
  address: string | null;
  active: boolean;
  createdAt: string; 
}

export interface CreateSupplierDto {
  name: string;
  email?: string;
  phone?: string;
  cuit?: string;
  address?: string;
}

export interface UpdateSupplierDto {
  name: string;
  email?: string | null;
  phone?: string | null;
  cuit?: string | null;
  address?: string | null;
}

export interface SuppliersResponse {
  items: Supplier[];
}