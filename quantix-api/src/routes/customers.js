import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  listCustomers,
  createCustomer,
  getCustomerBalance,
  addCustomerPayment,
} from "../controllers/customers.controller.js";

const router = Router();

router.get("/", verifyToken, listCustomers);
router.post("/", verifyToken, createCustomer);
router.get("/:id/balance", verifyToken, getCustomerBalance);
router.post("/:id/payments", verifyToken, addCustomerPayment);

export default router;
