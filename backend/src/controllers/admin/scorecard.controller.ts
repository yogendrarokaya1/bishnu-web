import { Request, Response, NextFunction } from 'express';
import adminScorecardService from '../../services/admin/scorecard.service';

class AdminScorecardController {
  // POST /api/admin/scorecards/init
  async init(req: Request, res: Response, next: NextFunction) {
    try {
      const scorecard = await adminScorecardService.initScorecard(req.body);
      res.status(201).json({ success: true, message: 'Scorecard initialized', data: scorecard });
    } catch (error) { next(error); }
  }

  // PUT /api/admin/scorecards/:matchId/innings
  async upsertInnings(req: Request, res: Response, next: NextFunction) {
    try {
      const scorecard = await adminScorecardService.upsertInnings(req.params.matchId as string, req.body);
      res.json({ success: true, message: 'Innings updated', data: scorecard });
    } catch (error) { next(error); }
  }

  // PUT /api/admin/scorecards/:matchId/live
  async updateLive(req: Request, res: Response, next: NextFunction) {
    try {
      const scorecard = await adminScorecardService.updateLiveScore(req.params.matchId as string, req.body);
      res.json({ success: true, message: 'Live score updated', data: scorecard });
    } catch (error) { next(error); }
  }

  // DELETE /api/admin/scorecards/:matchId/live
  async clearLive(req: Request, res: Response, next: NextFunction) {
    try {
      await adminScorecardService.clearLiveScore(req.params.matchId as string);
      res.json({ success: true, message: 'Live score cleared' });
    } catch (error) { next(error); }
  }

  // DELETE /api/admin/scorecards/:matchId
  async deleteScorecard(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminScorecardService.deleteScorecard(req.params.matchId as string);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }
}

export default new AdminScorecardController();
