import mongoose, { Document, Schema } from 'mongoose';
import { MatchFormat, MatchStatus, MatchType } from '../types/match.type';


export interface IMatch extends Document {
  seriesId?: mongoose.Types.ObjectId;
  seriesName: string;
  matchNumber: string;        // e.g. "1st ODI", "3rd T20I", "Final"
  matchDesc: string;          // e.g. "India vs Australia, 1st ODI"
  matchType: MatchType;
  format: MatchFormat;
  status: MatchStatus;

  team1: {
    name: string;
    shortName: string;        // e.g. "IND", "AUS"
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

  scheduledDate: Date;
  scheduledTime: string;      // "14:00" UTC stored as string for display

  toss?: {
    winner: string;           // shortName of team
    decision: 'bat' | 'bowl';
  };

  result?: string;            // "India won by 5 wickets"
  liveStatus?: string;        // "India needs 45 runs in 32 balls"

  isInternational: boolean;
  isFeatured: boolean;        // to highlight on homepage like Cricbuzz

  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamInfoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true, maxlength: 6 },
    flagUrl: { type: String },
  },
  { _id: false }
);

const MatchSchema = new Schema<IMatch>(
  {
    seriesId: { type: Schema.Types.ObjectId, ref: 'Series' },
    seriesName: { type: String, required: true, trim: true },
    matchNumber: { type: String, required: true, trim: true },
    matchDesc: { type: String, trim: true },
    matchType: {
      type: String,
      enum: ['international', 'domestic', 'league', 'tour_match'],
      required: true,
    },
    format: {
      type: String,
      enum: ['T20', 'ODI', 'TEST', 'T10', 'THE_HUNDRED'],
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'abandoned', 'rain_delay'],
      default: 'upcoming',
    },

    team1: { type: TeamInfoSchema, required: true },
    team2: { type: TeamInfoSchema, required: true },

    venue: {
      stadiumName: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },

    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },

    toss: {
      winner: { type: String },
      decision: { type: String, enum: ['bat', 'bowl'] },
    },

    result: { type: String },
    liveStatus: { type: String },

    isInternational: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);



// Indexes for common queries
MatchSchema.index({ status: 1, scheduledDate: -1 });
MatchSchema.index({ seriesId: 1 });
MatchSchema.index({ isFeatured: 1, status: 1 });

const Match = mongoose.model<IMatch>('Match', MatchSchema);
export default Match;
