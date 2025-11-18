import { Router } from 'express';
import {
  listSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  disableSupplier,
  enableSupplier,
  getSupplierActivity
} from '../controllers/suppliers.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);
router.get('/', listSuppliers);
router.post('/', createSupplier);
router.get('/:id/activity', getSupplierActivity); 
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);
router.patch('/:id/disable', disableSupplier);
router.patch('/:id/enable', enableSupplier);

export default router;