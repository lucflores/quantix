export type CreateCustomerDto = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type UpdateCustomerDto = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  active: boolean;
  createdAt: string;
};

export type CustomersResponse = {
  data: Customer[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};
