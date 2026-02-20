export type NewsCategory = 'top_stories' | 'international' | 'ipl' | 'npl' | 'domestic';
export type NewsStatus = 'draft' | 'published';

export interface INews {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: NewsCategory;
  status: NewsStatus;
  isBreaking: boolean;
  isFeatured: boolean;
  author: string;
  readTime: number;
  relatedMatchId?: string;
  tags: string[];
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'top_stories',  label: 'Top Stories'   },
  { value: 'international', label: 'International' },
  { value: 'ipl',          label: 'IPL'            },
  { value: 'npl',          label: 'NPL'            },
  { value: 'domestic',     label: 'Domestic'       },
];
