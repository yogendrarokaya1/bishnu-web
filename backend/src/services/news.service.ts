import newsRepository from '../repositories/news.repository';

class NewsService {
  async getAll(query: { page?: string; limit?: string; category?: string; search?: string }) {
    const page  = parseInt(query.page  || '1');
    const limit = parseInt(query.limit || '12');
    return newsRepository.findPublished({ page, limit, category: query.category, search: query.search });
  }

  async getBySlug(slug: string) {
    const news = await newsRepository.findBySlug(slug);
    if (!news) throw new Error('Article not found');
    return news;
  }

  async getFeatured() {
    return newsRepository.findFeatured(5);
  }

  async getBreaking() {
    return newsRepository.findBreaking(6);
  }

  async getLatest(limit = 10) {
    return newsRepository.findLatest(limit);
  }

  async getByCategory(category: string, limit = 10) {
    return newsRepository.findByCategory(category, limit);
  }
}

export default new NewsService();
