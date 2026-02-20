export interface CreateMatchDto {
  seriesName: string;
  matchNumber: string;
  matchDesc?: string;
  matchType: 'international' | 'domestic' | 'league' | 'tour_match';
  format: 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE_HUNDRED';
  team1: {
    name: string;
    shortName: string;
    flagUrl?: string;
  };
  team2: {
    name: string;
    shortName: string;
    flagUrl?: string;
  };
  venue: {
    stadiumName: string;
    city: string;
    country: string;
  };
  scheduledDate: string; // ISO string
  scheduledTime: string; // "14:00"
  isInternational?: boolean;
  isFeatured?: boolean;
}

export interface UpdateMatchDto {
  status?: 'upcoming' | 'live' | 'completed' | 'abandoned' | 'rain_delay';
  toss?: {
    winner: string;
    decision: 'bat' | 'bowl';
  };
  result?: string;
  liveStatus?: string;
  isFeatured?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  venue?: {
    stadiumName: string;
    city: string;
    country: string;
  };
}

export function validateCreateMatch(data: CreateMatchDto): string[] {
  const errors: string[] = [];

  if (!data.seriesName?.trim()) errors.push('seriesName is required');
  if (!data.matchNumber?.trim()) errors.push('matchNumber is required');
  if (!data.matchType) errors.push('matchType is required');
  if (!['international', 'domestic', 'league', 'tour_match'].includes(data.matchType))
    errors.push('Invalid matchType');

  if (!data.format) errors.push('format is required');
  if (!['T20', 'ODI', 'TEST', 'T10', 'THE_HUNDRED'].includes(data.format))
    errors.push('Invalid format');

  if (!data.team1?.name || !data.team1?.shortName) errors.push('team1 name and shortName required');
  if (!data.team2?.name || !data.team2?.shortName) errors.push('team2 name and shortName required');
  if (data.team1?.shortName === data.team2?.shortName)
    errors.push('team1 and team2 cannot be the same');

  if (!data.venue?.stadiumName || !data.venue?.city || !data.venue?.country)
    errors.push('venue stadiumName, city, and country are required');

  if (!data.scheduledDate) errors.push('scheduledDate is required');
  if (!data.scheduledTime) errors.push('scheduledTime is required');

  if (data.scheduledDate && isNaN(Date.parse(data.scheduledDate)))
    errors.push('Invalid scheduledDate format');

  return errors;
}
