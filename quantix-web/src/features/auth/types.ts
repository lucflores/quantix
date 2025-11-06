export type Role = "ADMIN" | "EMPLOYEE";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role?: Role;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResp = {
  token: string;
  user?: User; // algunos back ya devuelven el user acá
};
