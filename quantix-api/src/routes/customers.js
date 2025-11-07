import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  disableCustomer,
  enableCustomer,
  getCustomerBalance,
  addCustomerPayment,
  getCustomerActivity,   
} from "../controllers/customers.controller.js";

const router = Router();

router.get("/", verifyToken, listCustomers);
router.post("/", verifyToken, createCustomer);

router.patch("/:id", verifyToken, updateCustomer);
router.put("/:id", verifyToken, updateCustomer);

router.delete("/:id", verifyToken, deleteCustomer);
router.patch("/:id/disable", verifyToken, disableCustomer);
router.patch("/:id/enable", verifyToken, enableCustomer);

router.get("/:id/balance", verifyToken, getCustomerBalance);
router.post("/:id/payments", verifyToken, addCustomerPayment);

// 👇 NUEVO
router.get("/:id/activity", verifyToken, getCustomerActivity);

export default router;
