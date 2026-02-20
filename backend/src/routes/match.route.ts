import { Router, Request, Response, NextFunction } from 'express';
import matchService from '../services/match.service';
import { MatchFormat, MatchStatus } from '../types/match.type';

const router = Router();

// GET /api/matches  → all matches with filters & pagination (PUBLIC)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as MatchStatus | undefined,
      format: req.query.format as MatchFormat | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };
    const result = await matchService.getAllMatches(filters);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/home  → live + upcoming + featured (for homepage widget)
router.get('/home', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await matchService.getHomeMatches();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/live
router.get('/live', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await matchService.getLiveMatches();
    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/upcoming
router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const matches = await matchService.getUpcomingMatches(limit);
    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/recent
router.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const matches = await matchService.getRecentMatches(limit);
    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/:id  ← must be last to avoid catching /home, /live etc.
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const match = await matchService.getMatchById(id);
    res.json({ success: true, data: match });
  } catch (error) {
    next(error);
  }
});

export default router;