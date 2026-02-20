import matchRepository from '../../repositories/match.repository';
import { CreateMatchDto, UpdateMatchDto, validateCreateMatch } from '../../dtos/match.dto';
import { IMatchQueryFilters } from '../../types/match.type';
import { HttpError } from '../../errors/http-error';
import mongoose from 'mongoose';

class AdminMatchService {
  async createMatch(dto: CreateMatchDto, adminId: string) {
    const errors = validateCreateMatch(dto);
    if (errors.length > 0) {
      throw new HttpError(400, errors.join(', '));
    }

    const match = await matchRepository.create({
      ...dto,
      matchDesc: dto.matchDesc || `${dto.team1.name} vs ${dto.team2.name}, ${dto.matchNumber}`,
      scheduledDate: new Date(dto.scheduledDate),
      createdBy: new mongoose.Types.ObjectId(adminId),
    });

    return match;
  }

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

  async getMatchById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(400, 'Invalid match ID');
    }

    const match = await matchRepository.findById(id);
    if (!match) throw new HttpError(404, 'Match not found');

    return match;
  }

  async updateMatch(id: string, dto: UpdateMatchDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(400, 'Invalid match ID');
    }

    const { scheduledDate, ...restDto } = dto;
    const updated = await matchRepository.updateById(id, {
      ...restDto,
      ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }),
    });

    if (!updated) throw new HttpError(404, 'Match not found');
    return updated;
  }

  async deleteMatch(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(400, 'Invalid match ID');
    }

    const deleted = await matchRepository.deleteById(id);
    if (!deleted) throw new HttpError(404, 'Match not found');

    return { message: 'Match deleted successfully' };
  }

  async markAsLive(id: string) {
    return this.updateMatch(id, { status: 'live' });
  }

  async markAsCompleted(id: string, result: string) {
    return this.updateMatch(id, { status: 'completed', result, liveStatus: undefined });
  }

  async setToss(id: string, winner: string, decision: 'bat' | 'bowl') {
    return this.updateMatch(id, { toss: { winner, decision } });
  }
}

export default new AdminMatchService();