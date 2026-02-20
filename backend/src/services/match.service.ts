import matchRepository from '../repositories/match.repository';
import { HttpError } from '../errors/http-error';
import { IMatchQueryFilters } from '../types/match.type';
import mongoose from 'mongoose';

class MatchService {
  // GET /api/matches — with filters & pagination
  async getAllMatches(filters: IMatchQueryFilters) {
    const { matches, total } = await matchRepository.findAll(filters);
    const { page = 1, limit = 10 } = filters;
    return {
      matches,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Homepage data: live + upcoming + featured
  async getHomeMatches() {
    const [live, upcoming, featured] = await Promise.all([
      matchRepository.findLive(),
      matchRepository.findUpcoming(5),
      matchRepository.findFeatured(),
    ]);
    return { live, upcoming, featured };
  }

  async getLiveMatches() {
    return matchRepository.findLive();
  }

  async getUpcomingMatches(limit = 10) {
    return matchRepository.findUpcoming(limit);
  }

  async getRecentMatches(limit = 10) {
    return matchRepository.findRecent(limit);
  }

  async getMatchById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    const match = await matchRepository.findById(id);
    if (!match) throw new HttpError(404, 'Match not found');
    return match;
  }
}

export default new MatchService();