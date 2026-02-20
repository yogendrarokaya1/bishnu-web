import { Router } from 'express';
import adminScorecardController from '../../controllers/admin/scorecard.controller';
import { authorizedMiddleware } from '../../middlewares/authorized.middleware';

const router = Router();

router.use(authorizedMiddleware);

// Initialize scorecard for a match
router.post('/init', adminScorecardController.init);

// Update/add innings scorecard
router.put('/:matchId/innings', adminScorecardController.upsertInnings);

// Update live score widget
router.put('/:matchId/live', adminScorecardController.updateLive);

// Clear live score (when match ends)
router.delete('/:matchId/live', adminScorecardController.clearLive);

// Delete entire scorecard
router.delete('/:matchId', adminScorecardController.deleteScorecard);

export default router;
