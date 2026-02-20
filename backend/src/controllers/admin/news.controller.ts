import { Request, Response } from 'express';
import adminNewsService from '../../services/admin/news.service';

class AdminNewsController {
  async create(req: Request, res: Response) {
    try {
      const news = await adminNewsService.create(req.body);
      res.status(201).json({ success: true, message: 'Article created', data: news });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const news = await adminNewsService.update(req.params.id as string, req.body);
      res.json({ success: true, message: 'Article updated', data: news });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await adminNewsService.delete(req.params.id as string);
      res.json({ success: true, message: 'Article deleted' });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await adminNewsService.getAll(req.query as any);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const news = await adminNewsService.getOne(req.params.id as string);
      res.json({ success: true, data: news });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new AdminNewsController();
