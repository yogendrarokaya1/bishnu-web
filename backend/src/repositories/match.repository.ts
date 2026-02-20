import Match, { IMatch } from '../models/match.model';
import { IMatchQueryFilters } from '../types/match.type';
import mongoose from 'mongoose';

export class MatchRepository {
  async create(data: Partial<IMatch>): Promise<IMatch> {
    const match = new Match(data);
    return match.save();
  }

  async findById(id: string): Promise<IMatch | null> {
    return Match.findById(id).lean();
  }

  async findAll(filters: IMatchQueryFilters): Promise<{ matches: IMatch[]; total: number }> {
    const { status, format, seriesId, page = 1, limit = 10 } = filters;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (format) query.format = format;
    if (seriesId) query.seriesId = new mongoose.Types.ObjectId(seriesId);

    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      Match.find(query).sort({ scheduledDate: -1 }).skip(skip).limit(limit).lean(),
      Match.countDocuments(query),
    ]);

    return { matches, total };
  }

  async findLive(): Promise<IMatch[]> {
    return Match.find({ status: 'live' }).sort({ scheduledDate: 1 }).lean();
  }

  async findUpcoming(limit = 10): Promise<IMatch[]> {
    return Match.find({ status: 'upcoming', scheduledDate: { $gte: new Date() } })
      .sort({ scheduledDate: 1 })
      .limit(limit)
      .lean();
  }

  async findRecent(limit = 10): Promise<IMatch[]> {
    return Match.find({ status: 'completed' })
      .sort({ scheduledDate: -1 })
      .limit(limit)
      .lean();
  }

  async findFeatured(): Promise<IMatch[]> {
    return Match.find({ isFeatured: true, status: { $in: ['live', 'upcoming'] } })
      .sort({ scheduledDate: 1 })
      .lean();
  }

  async updateById(id: string, data: Partial<IMatch>): Promise<IMatch | null> {
    return Match.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async deleteById(id: string): Promise<IMatch | null> {
    return Match.findByIdAndDelete(id).lean();
  }
}

export default new MatchRepository();
