import { Router, Request, Response, NextFunction } from 'express';
import scorecardService from '../services/scorecard.service';

const router = Router();

// GET /api/scorecards/:matchId  → public scorecard for a match
router.get('/:matchId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;
    const scorecard = await scorecardService.getByMatchId(matchId);
    res.json({ success: true, data: scorecard });
  } catch (error) {
    next(error);
  }
});

export default router;
