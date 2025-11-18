import { api } from "@/core/api/client"; 
import type { 
  Supplier, 
  CreateSupplierDto, 
  UpdateSupplierDto, 
  SuppliersResponse 
} from "./types";


export async function getSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<SuppliersResponse | Supplier[]>("/suppliers");


  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function createSupplier(dto: CreateSupplierDto) {
  const { data } = await api.post("/suppliers", dto);
  return data;
}

export async function updateSupplier(id: string, dto: UpdateSupplierDto) {
  const { data } = await api.patch(`/suppliers/${id}`, dto);
  return data;
}

export async function disableSupplier(id: string) {
  const { data } = await api.patch(`/suppliers/${id}/disable`);
  return data;
}

export async function enableSupplier(id: string) {
  const { data } = await api.patch(`/suppliers/${id}/enable`);
  return data;
}

export async function getSupplierActivity(supplierId: string) {
  const { data } = await api.get(`/suppliers/${supplierId}/activity`);
  return data;
}