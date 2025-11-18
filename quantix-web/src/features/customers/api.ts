import { api } from "@/core/api/client";
import type { CreateCustomerDto, UpdateCustomerDto, Customer, CustomersResponse
} from "./types";

export async function getCustomers(
  page: number = 1, 
  limit: number = 20, 
  q: string = ''
): Promise<CustomersResponse> {
  
  const { data } = await api.get<CustomersResponse>("/customers", {
    params: { page, limit, q } 
  });
  return data;
}

export async function createCustomer(dto: CreateCustomerDto) {
  const { data } = await api.post("/customers", dto);
  return data;
}

export async function updateCustomer(id: string, dto: UpdateCustomerDto) {
  const { data } = await api.patch(`/customers/${id}`, dto);
  return data;
}

export async function disableCustomer(id: string) {
  const { data } = await api.patch(`/customers/${id}/disable`);
  return data;
}

export async function enableCustomer(id: string) {
  const { data } = await api.patch(`/customers/${id}/enable`);
  return data;
}

export async function addCustomerPayment(
  customerId: string,
  dto: { amount: number; method?: string; reference?: string }
) {
  const { data } = await api.post(`/customers/${customerId}/payments`, dto);
  return data;
}