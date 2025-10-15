import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  listProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  softDeleteProduct,
} from "../controllers/products.controller.js";

const router = Router();

// v1: sin AUTHZ/can()
router.get("/", verifyToken, listProducts);
router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.patch("/:id/status", verifyToken, toggleProductStatus);
router.delete("/:id", verifyToken, softDeleteProduct);

export default router;
