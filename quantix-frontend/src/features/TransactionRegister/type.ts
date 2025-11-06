export interface Transaction {
  id: string;
  type: "INGRESO" | "EGRESO";
  comprobanteUrl?: string;
  comprobanteNum?: string;
  partner?: string;
  amount: number;
  status: string;
  date: string;
  createdAt: string;
}
