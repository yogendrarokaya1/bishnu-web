export interface BatsmanEntryDto {
  name: string;
  dismissal?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isNotOut?: boolean;
}

export interface BowlerEntryDto {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  noBalls?: number;
  wides?: number;
}

export interface FallOfWicketDto {
  wicketNumber: number;
  runs: number;
  overs: number;
  batsmanName: string;
}

export interface ExtrasDto {
  wides?: number;
  noBalls?: number;
  byes?: number;
  legByes?: number;
  penalty?: number;
}

export interface InningsDto {
  inningsNumber: number;
  battingTeam: string;
  bowlingTeam: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  isCompleted?: boolean;
  isDeclared?: boolean;
  batting: BatsmanEntryDto[];
  bowling: BowlerEntryDto[];
  extras?: ExtrasDto;
  fallOfWickets?: FallOfWicketDto[];
}

export interface LiveScoreDto {
  currentInnings: number;
  battingTeam: string;
  bowlingTeam: string;
  score: string;
  runRate: string;
  requiredRunRate?: string;
  target?: number;
  situation: string;
  batsmanOne: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  batsmanTwo: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  currentBowler: { name: string; overs: number; runs: number; wickets: number; economy: number };
  recentBalls?: string[];
  lastWicket?: string;
  commentary?: string;
}

export interface CreateScorecardDto {
  matchId: string;
  innings?: InningsDto[];
}

export interface UpdateInningsDto extends Partial<InningsDto> {}

export interface UpdateLiveScoreDto extends Partial<LiveScoreDto> {}

// ── Helpers to auto-compute derived fields ────────────────────────────────────
export function computeBatsmanSR(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
}

export function computeBowlerEconomy(runs: number, overs: number): number {
  if (overs === 0) return 0;
  return parseFloat((runs / overs).toFixed(2));
}

export function computeRunRate(runs: number, overs: number): number {
  if (overs === 0) return 0;
  return parseFloat((runs / overs).toFixed(2));
}

export function computeExtrasTotal(extras: ExtrasDto): number {
  return (extras.wides || 0) + (extras.noBalls || 0) + (extras.byes || 0) + (extras.legByes || 0) + (extras.penalty || 0);
}
