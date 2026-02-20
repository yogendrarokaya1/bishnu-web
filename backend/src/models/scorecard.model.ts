import mongoose, { Document, Schema } from 'mongoose';

export interface IScorecard extends Document {
  matchId: mongoose.Types.ObjectId;
  innings: IInningsDoc[];
  liveScore?: ILiveScoreDoc;
  createdAt: Date;
  updatedAt: Date;
}

interface IBatsmanDoc {
  name: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isNotOut: boolean;
}

interface IBowlerDoc {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  noBalls: number;
  wides: number;
}

interface IFowDoc {
  wicketNumber: number;
  runs: number;
  overs: number;
  batsmanName: string;
}

interface IInningsDoc {
  inningsNumber: number;
  battingTeam: string;
  bowlingTeam: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  runRate: number;
  isCompleted: boolean;
  isDeclared: boolean;
  batting: IBatsmanDoc[];
  bowling: IBowlerDoc[];
  extras: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; total: number };
  fallOfWickets: IFowDoc[];
}

interface ILiveScoreDoc {
  currentInnings: number;
  battingTeam: string;
  bowlingTeam: string;
  score: string;
  runRate: string;
  requiredRunRate: string;
  target: number;
  situation: string;
  batsmanOne: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  batsmanTwo: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  currentBowler: { name: string; overs: number; runs: number; wickets: number; economy: number };
  recentBalls: string[];
  lastWicket: string;
  commentary: string;
}

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const BatsmanSchema = new Schema({
  name: { type: String, required: true },
  dismissal: { type: String, default: 'not out' },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  isNotOut: { type: Boolean, default: true },
}, { _id: false });

const BowlerSchema = new Schema({
  name: { type: String, required: true },
  overs: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 },
  wides: { type: Number, default: 0 },
}, { _id: false });

const FowSchema = new Schema({
  wicketNumber: { type: Number, required: true },
  runs: { type: Number, required: true },
  overs: { type: Number, required: true },
  batsmanName: { type: String, required: true },
}, { _id: false });

const ExtrasSchema = new Schema({
  wides: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 },
  byes: { type: Number, default: 0 },
  legByes: { type: Number, default: 0 },
  penalty: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { _id: false });

const InningsSchema = new Schema({
  inningsNumber: { type: Number, required: true },
  battingTeam: { type: String, required: true },
  bowlingTeam: { type: String, required: true },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  totalOvers: { type: Number, default: 0 },
  runRate: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  isDeclared: { type: Boolean, default: false },
  batting: [BatsmanSchema],
  bowling: [BowlerSchema],
  extras: { type: ExtrasSchema, default: () => ({}) },
  fallOfWickets: [FowSchema],
}, { _id: false });

const PlayerStatSchema = new Schema({
  name: { type: String },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
}, { _id: false });

const LiveScoreSchema = new Schema({
  currentInnings: { type: Number, default: 1 },
  battingTeam: { type: String },
  bowlingTeam: { type: String },
  score: { type: String },
  runRate: { type: String },
  requiredRunRate: { type: String },
  target: { type: Number },
  situation: { type: String },
  batsmanOne: { type: PlayerStatSchema, default: () => ({}) },
  batsmanTwo: { type: PlayerStatSchema, default: () => ({}) },
  currentBowler: { type: PlayerStatSchema, default: () => ({}) },
  recentBalls: [{ type: String }],
  lastWicket: { type: String },
  commentary: { type: String },
}, { _id: false });

// ── Main Schema ───────────────────────────────────────────────────────────────

const ScorecardSchema = new Schema<IScorecard>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, unique: true },
    innings: [InningsSchema],
    liveScore: { type: LiveScoreSchema },
  },
  { timestamps: true }
);

ScorecardSchema.index({ matchId: 1 });

const Scorecard = mongoose.model<IScorecard>('Scorecard', ScorecardSchema);
export default Scorecard;
