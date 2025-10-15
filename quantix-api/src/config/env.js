import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_v1",
  DATABASE_URL: process.env.DATABASE_URL,
  AUTHZ: (process.env.AUTHZ || "off").toLowerCase(), // off en v1
};
