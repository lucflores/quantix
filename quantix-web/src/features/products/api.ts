import { api } from "@/core/api/client";
import type { Product, CreateProductDto, UpdateProductDto, ProductsResponse } from "./types";


export async function getProducts(
  page: number = 1, 
  limit: number = 20, 
  q: string = ''
): Promise<ProductsResponse> {
  const response = await api.get<any>("/products", {
    params: { page, limit, q } 
  });

  const rawData = response.data;

  if (rawData && Array.isArray(rawData.data)) {
    return rawData; 
  }
  if (rawData && Array.isArray(rawData.items)) {
    return {
      data: rawData.items, 
      page: rawData.page || 1,
      limit: rawData.limit || 20,
      totalPages: rawData.totalPages || 1,
      totalResults: rawData.totalResults || rawData.items.length
    };
  }
  if (Array.isArray(rawData)) {
    return {
      data: rawData,
      page: 1,
      limit: rawData.length,
      totalPages: 1,
      totalResults: rawData.length
    };
  }

  return {
    data: [],
    page: 1,
    limit: 20,
    totalPages: 0,
    totalResults: 0
  };
}

export async function createProduct(dto: CreateProductDto) {
  const { data } = await api.post("/products", dto);
  return data;
}

export async function updateProduct(id: string, dto: UpdateProductDto) {
  const { data } = await api.put(`/products/${id}`, dto);
  return data;
}

export async function toggleProductStatus(id: string, active: boolean) {
  const { data } = await api.patch(`/products/${id}/status`, { active });
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}