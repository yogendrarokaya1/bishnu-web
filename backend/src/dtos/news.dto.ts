export interface CreateNewsDto {
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: 'top_stories' | 'international' | 'ipl' | 'npl' | 'domestic';
  status?: 'draft' | 'published';
  isBreaking?: boolean;
  isFeatured?: boolean;
  author?: string;
  relatedMatchId?: string;
  tags?: string[];
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {}

export interface NewsQueryDto {
  page?: string;
  limit?: string;
  category?: string;
  status?: string;
  search?: string;
}

// Auto-generate slug from title
export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') +
    '-' +
    Date.now()
  );
}

// Auto-compute read time (~200 words per minute)
export function computeReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
