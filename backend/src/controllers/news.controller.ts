import { Request, Response } from 'express';
import newsService from '../services/news.service';

class NewsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await newsService.getAll(req.query as any);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const news = await newsService.getBySlug(req.params.slug as string);
      res.json({ success: true, data: news });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async getFeatured(req: Request, res: Response) {
    try {
      const news = await newsService.getFeatured();
      res.json({ success: true, data: news });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getBreaking(req: Request, res: Response) {
    try {
      const news = await newsService.getBreaking();
      res.json({ success: true, data: news });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getLatest(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string || '10');
      const news = await newsService.getLatest(limit);
      res.json({ success: true, data: news });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new NewsController();
