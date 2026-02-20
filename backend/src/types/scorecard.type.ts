export interface IBatsmanEntry {
  name: string;
  dismissal: string;       // "b Bumrah", "c Kohli b Bumrah", "not out", "run out (Smith)"
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isNotOut?: boolean;
}

export interface IBowlerEntry {
  name: string;
  overs: number;           // e.g. 4.2 means 4 overs 2 balls
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  noBalls?: number;
  wides?: number;
}

export interface IExtras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface IFallOfWicket {
  wicketNumber: number;   // 1, 2, 3...
  runs: number;           // score when wicket fell
  overs: number;          // over when wicket fell
  batsmanName: string;
}

export interface IInnings {
  inningsNumber: number;         // 1, 2, 3, 4 (for Tests)
  battingTeam: string;           // team shortName
  bowlingTeam: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;            // 20.0, 48.3 etc
  runRate: number;
  isCompleted: boolean;
  isDeclared?: boolean;          // for Test matches

  batting: IBatsmanEntry[];
  bowling: IBowlerEntry[];
  extras: IExtras;
  fallOfWickets: IFallOfWicket[];
}

export interface ILiveScore {
  currentInnings: number;        // which innings is live (1-4)
  battingTeam: string;
  bowlingTeam: string;
  score: string;                 // "IND 145/3 (18.2)"
  runRate: string;               // "CRR: 7.94"
  requiredRunRate?: string;      // "RRR: 10.23"
  target?: number;
  situation: string;             // "India needs 56 runs in 44 balls"

  // Current batsmen at crease
  batsmanOne: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  batsmanTwo: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };

  // Current bowler
  currentBowler: { name: string; overs: number; runs: number; wickets: number; economy: number };

  // Last few balls of current over e.g. ["0","1","W","4","6","1"]
  recentBalls: string[];

  lastWicket?: string;           // "Rohit Sharma b Cummins 45(32)"
  commentary?: string;           // latest ball commentary
}
