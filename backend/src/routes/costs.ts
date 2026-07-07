import { Router } from 'express';
import {
  getCosts,
  getCostById,
  createCost,
  updateCost,
  deleteCost,
} from '../controllers/costsController';

const router = Router();

router.get('/', getCosts);
router.get('/:id', getCostById);
router.post('/', createCost);
router.put('/:id', updateCost);
router.delete('/:id', deleteCost);

export default router;
