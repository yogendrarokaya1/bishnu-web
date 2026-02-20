import mongoose, { Document, Schema } from 'mongoose';

export interface INewsDoc extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  status: string;
  isBreaking: boolean;
  isFeatured: boolean;
  author: string;
  readTime: number;
  relatedMatchId?: mongoose.Types.ObjectId;
  tags: string[];
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INewsDoc>(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary:    { type: String, required: true, trim: true },
    content:    { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['top_stories', 'international', 'ipl', 'npl', 'domestic'],
      default: 'top_stories',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    isBreaking: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    author:     { type: String, required: true, default: 'SoftBuzz Staff' },
    readTime:   { type: Number, default: 1 },
    relatedMatchId: { type: Schema.Types.ObjectId, ref: 'Match' },
    tags:       [{ type: String, trim: true }],
    views:      { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ category: 1, status: 1 });
NewsSchema.index({ isFeatured: 1, status: 1 });
NewsSchema.index({ isBreaking: 1, status: 1 });

const News = mongoose.model<INewsDoc>('News', NewsSchema);
export default News;
