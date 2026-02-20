import { Request, Response, NextFunction } from 'express';
import adminMatchService from '../../services/admin/match.service';
import { CreateMatchDto, UpdateMatchDto } from '../../dtos/match.dto';
import { IMatchQueryFilters } from '../../types/match.type';

class AdminMatchController {
  // POST /api/admin/matches
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req as any).user._id;
      const dto: CreateMatchDto = req.body;
      const match = await adminMatchService.createMatch(dto, adminId);

      res.status(201).json({
        success: true,
        message: 'Match created successfully',
        data: match,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/matches
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: IMatchQueryFilters = {
        status: req.query.status as any,
        format: req.query.format as any,
        seriesId: req.query.seriesId as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      };

      const result = await adminMatchService.getAllMatches(filters);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/matches/:id
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await adminMatchService.getMatchById(req.params.id as string);
      res.json({ success: true, data: match });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/matches/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: UpdateMatchDto = req.body;
      const match = await adminMatchService.updateMatch(req.params.id as string, dto);
      res.json({ success: true, message: 'Match updated', data: match });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/admin/matches/:id
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminMatchService.deleteMatch(req.params.id as string);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/matches/:id/live
  async markLive(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await adminMatchService.markAsLive(req.params.id as string);
      res.json({ success: true, message: 'Match is now live', data: match });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/matches/:id/complete
  async markCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const { result } = req.body;
      if (!result) {
        res.status(400).json({ success: false, message: 'result string is required' });
        return;
      }
      const match = await adminMatchService.markAsCompleted(req.params.id as string, result);
      res.json({ success: true, message: 'Match marked as completed', data: match });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/matches/:id/toss
  async updateToss(req: Request, res: Response, next: NextFunction) {
    try {
      const { winner, decision } = req.body;
      if (!winner || !decision) {
        res.status(400).json({ success: false, message: 'winner and decision are required' });
        return;
      }
      const match = await adminMatchService.setToss(req.params.id as string, winner, decision);
      res.json({ success: true, message: 'Toss updated', data: match });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminMatchController();
