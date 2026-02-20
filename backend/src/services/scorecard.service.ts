import scorecardRepository from '../repositories/scorecard.repository';
import { HttpError } from '../errors/http-error';
import mongoose from 'mongoose';

class ScorecardService {
  async getByMatchId(matchId: string) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new HttpError(400, 'Invalid match ID');
    }
    const scorecard = await scorecardRepository.findByMatchId(matchId);
    if (!scorecard) throw new HttpError(404, 'Scorecard not found for this match');
    return scorecard;
  }
}

export default new ScorecardService();
