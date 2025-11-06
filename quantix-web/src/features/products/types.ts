export type Product = {
  id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
  minStock?: number;
  active?: boolean;
};
