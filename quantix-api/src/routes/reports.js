import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
  lowStock, 
  recentPurchases,
  recentSales, getDashboardMetrics
} from "../controllers/reports.controller.js";

const router = Router();

router.use(verifyToken);
router.get("/low-stock", lowStock);
router.get("/recent-purchases", recentPurchases);
router.get("/recent-sales", recentSales);
router.get("/dashboard-metrics", getDashboardMetrics);
export default router;