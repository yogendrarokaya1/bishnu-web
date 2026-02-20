import { Router } from 'express';
import adminMatchController from '../../controllers/admin/match.controller';
import { authorizedMiddleware } from '../../middlewares/authorized.middleware';

const router = Router();

// All routes protected: must be logged in AND must be admin
router.use(authorizedMiddleware);

// CRUD
router.post('/', adminMatchController.create);
router.get('/', adminMatchController.getAll);
router.get('/:id', adminMatchController.getOne);
router.patch('/:id', adminMatchController.update);
router.delete('/:id', adminMatchController.remove);

// Match state management
router.patch('/:id/live', adminMatchController.markLive);
router.patch('/:id/complete', adminMatchController.markCompleted);
router.patch('/:id/toss', adminMatchController.updateToss);

export default router;
