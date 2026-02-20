import scorecardRepository from '../../repositories/scorecard.repository';
import {
  CreateScorecardDto, InningsDto, LiveScoreDto,
  computeBatsmanSR, computeBowlerEconomy, computeRunRate, computeExtrasTotal
} from '../../dtos/scorecard.dto';
import { HttpError } from '../../errors/http-error';
import mongoose from 'mongoose';

class AdminScorecardService {

  async initScorecard(dto: CreateScorecardDto) {
    if (!mongoose.Types.ObjectId.isValid(dto.matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    const existing = await scorecardRepository.findByMatchId(dto.matchId);
    if (existing) throw new HttpError(409, 'Scorecard already exists for this match');

    return scorecardRepository.create({
      matchId: new mongoose.Types.ObjectId(dto.matchId) as any,
      innings: [],
    });
  }

  async upsertInnings(matchId: string, dto: InningsDto) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }

    // Auto-compute derived fields
    const batting = dto.batting.map(b => ({
      ...b,
      strikeRate: computeBatsmanSR(b.runs, b.balls),
      dismissal: b.dismissal || 'not out',
      isNotOut: b.isNotOut ?? !b.dismissal,
    }));

    const bowling = dto.bowling.map(b => ({
      ...b,
      economy: computeBowlerEconomy(b.runs, b.overs),
      noBalls: b.noBalls || 0,
      wides: b.wides || 0,
    }));

    const extrasTotal = computeExtrasTotal(dto.extras || {});
    const extras = {
      wides: dto.extras?.wides || 0,
      noBalls: dto.extras?.noBalls || 0,
      byes: dto.extras?.byes || 0,
      legByes: dto.extras?.legByes || 0,
      penalty: dto.extras?.penalty || 0,
      total: extrasTotal,
    };

    const runRate = computeRunRate(dto.totalRuns, dto.totalOvers);

    const inningsData = {
      ...dto,
      batting,
      bowling,
      extras,
      runRate,
      fallOfWickets: dto.fallOfWickets || [],
    };

    // Upsert scorecard if not exists then update innings
    await scorecardRepository.upsertByMatchId(matchId, {});
    return scorecardRepository.updateInnings(matchId, dto.inningsNumber, inningsData);
  }

  async updateLiveScore(matchId: string, dto: LiveScoreDto) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    return scorecardRepository.updateLiveScore(matchId, dto);
  }

  async clearLiveScore(matchId: string) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    return scorecardRepository.updateLiveScore(matchId, null);
  }

  async deleteScorecard(matchId: string) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    await scorecardRepository.deleteByMatchId(matchId);
    return { message: 'Scorecard deleted successfully' };
  }
}

export default new AdminScorecardService();
