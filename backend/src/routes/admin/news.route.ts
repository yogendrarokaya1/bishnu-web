import { Router } from 'express';
import adminNewsController from '../../controllers/admin/news.controller';
import { authorizedMiddleware, adminMiddleware } from '../../middlewares/authorized.middleware'; // adjust path if needed

const router = Router();

router.use(authorizedMiddleware, adminMiddleware);

router.get('/',       adminNewsController.getAll.bind(adminNewsController));
router.get('/:id',    adminNewsController.getOne.bind(adminNewsController));
router.post('/',      adminNewsController.create.bind(adminNewsController));
router.put('/:id',    adminNewsController.update.bind(adminNewsController));
router.delete('/:id', adminNewsController.delete.bind(adminNewsController));

export default router;