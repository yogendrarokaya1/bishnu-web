import newsRepository from '../../repositories/news.repository';
import { CreateNewsDto, UpdateNewsDto, NewsQueryDto, generateSlug, computeReadTime } from '../../dtos/news.dto';

class AdminNewsService {
  async create(dto: CreateNewsDto) {
    const slug = generateSlug(dto.title);
    const readTime = computeReadTime(dto.content);
    const publishedAt = dto.status === 'published' ? new Date() : undefined;

    const news = await newsRepository.create({
      ...dto,
      slug,
      readTime,
      publishedAt,
      tags: dto.tags || [],
      author: dto.author || 'SoftBuzz Staff',
    } as any);

    return news;
  }

  async update(id: string, dto: UpdateNewsDto) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw new Error('Article not found');

    const updates: any = { ...dto };

    if (dto.content) {
      updates.readTime = computeReadTime(dto.content);
    }

    // Set publishedAt when first publishing
    if (dto.status === 'published' && existing.status === 'draft') {
      updates.publishedAt = new Date();
    }

    return newsRepository.update(id, updates);
  }

  async delete(id: string) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw new Error('Article not found');
    await newsRepository.delete(id);
  }

  async getAll(query: NewsQueryDto) {
    const page  = parseInt(query.page  || '1');
    const limit = parseInt(query.limit || '15');
    return newsRepository.findAll({
      page,
      limit,
      category: query.category,
      status:   query.status,
      search:   query.search,
    });
  }

  async getOne(id: string) {
    const news = await newsRepository.findById(id);
    if (!news) throw new Error('Article not found');
    return news;
  }
}

export default new AdminNewsService();
