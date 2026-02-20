export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE_HUNDRED';
export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'abandoned' | 'rain_delay';
export type MatchType = 'international' | 'domestic' | 'league' | 'tour_match';
export type TossDecision = 'bat' | 'bowl';

export interface ITeamInfo {
  name: string;
  shortName: string;
  flagUrl?: string;
}

export interface IVenue {
  stadiumName: string;
  city: string;
  country: string;
}

export interface IToss {
  winner: string; // team shortName
  decision: TossDecision;
}

export interface IMatchQueryFilters {
  status?: MatchStatus;
  format?: MatchFormat;
  seriesId?: string;
  page?: number;
  limit?: number;
}
