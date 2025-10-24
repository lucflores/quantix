export type MovementKind = "IN" | "OUT";

export interface MovementProduct {
  id: string;
  sku?: string;
  name: string;
}

export interface Movement {
  id: string;
  kind: MovementKind;
  quantity: string | number;
  productId: string;
  createdById?: string | null;
  createdAt: string; // ISO
  product?: MovementProduct;
}

export type MovementsQuery = {
  kind?: "IN" | "OUT" | "ALL";
  q?: string;
  from?: string; // yyyy-mm-dd
  to?: string;   // yyyy-mm-dd
  sort?: "date_desc" | "date_asc";
  page?: number;
  pageSize?: number;
};
