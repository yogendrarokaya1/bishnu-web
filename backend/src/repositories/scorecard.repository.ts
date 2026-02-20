import Scorecard, { IScorecard } from '../models/scorecard.model';
import mongoose from 'mongoose';

class ScorecardRepository {
  async create(data: Partial<IScorecard>): Promise<IScorecard> {
    const scorecard = new Scorecard(data);
    return scorecard.save();
  }

  async findByMatchId(matchId: string): Promise<IScorecard | null> {
    return Scorecard.findOne({ matchId: new mongoose.Types.ObjectId(matchId) }).lean();
  }

  async upsertByMatchId(matchId: string, data: Partial<IScorecard>): Promise<IScorecard | null> {
    return Scorecard.findOneAndUpdate(
      { matchId: new mongoose.Types.ObjectId(matchId) },
      { $set: data },
      { new: true, upsert: true }
    ).lean();
  }

  async updateInnings(matchId: string, inningsNumber: number, inningsData: any): Promise<IScorecard | null> {
    const scorecard = await Scorecard.findOne({ matchId: new mongoose.Types.ObjectId(matchId) });
    if (!scorecard) return null;

    const existingIndex = scorecard.innings.findIndex(i => i.inningsNumber === inningsNumber);
    if (existingIndex >= 0) {
      scorecard.innings[existingIndex] = { ...scorecard.innings[existingIndex], ...inningsData };
    } else {
      scorecard.innings.push(inningsData);
      scorecard.innings.sort((a, b) => a.inningsNumber - b.inningsNumber);
    }

    return scorecard.save();
  }

  async updateLiveScore(matchId: string, liveData: any): Promise<IScorecard | null> {
    return Scorecard.findOneAndUpdate(
      { matchId: new mongoose.Types.ObjectId(matchId) },
      { $set: { liveScore: liveData } },
      { new: true, upsert: true }
    ).lean();
  }

  async deleteByMatchId(matchId: string): Promise<void> {
    await Scorecard.deleteOne({ matchId: new mongoose.Types.ObjectId(matchId) });
  }
}

export default new ScorecardRepository();
