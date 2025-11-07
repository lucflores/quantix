export type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  createdAt?: string;
  active: boolean;
};
export type CreateCustomerDto = {
  name: string;
  email?: string;
  phone?: string;
};
export type UpdateCustomerDto = {
  name?: string;
  email?: string;
  phone?: string;
};
