import News, { INewsDoc } from '../models/news.model';

class NewsRepository {
  async create(data: Partial<INewsDoc>): Promise<INewsDoc> {
    const news = new News(data);
    return news.save();
  }

  async findById(id: string): Promise<INewsDoc | null> {
    return News.findById(id).lean();
  }

  async findBySlug(slug: string): Promise<INewsDoc | null> {
    // increment views on read
    return News.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
  }

  async findAll(filters: {
    page: number;
    limit: number;
    category?: string;
    status?: string;
    search?: string;
  }) {
    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.status)   query.status   = filters.status;
    if (filters.search) {
      query.$or = [
        { title:   { $regex: filters.search, $options: 'i' } },
        { summary: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;
    const [data, total] = await Promise.all([
      News.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .lean(),
      News.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async findPublished(filters: { page: number; limit: number; category?: string; search?: string }) {
    return this.findAll({ ...filters, status: 'published' });
  }

  async findFeatured(limit = 5): Promise<INewsDoc[]> {
    return News.find({ isFeatured: true, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findBreaking(limit = 6): Promise<INewsDoc[]> {
    return News.find({ isBreaking: true, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findLatest(limit = 10): Promise<INewsDoc[]> {
    return News.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findByCategory(category: string, limit = 10): Promise<INewsDoc[]> {
    return News.find({ category, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  async update(id: string, data: Partial<INewsDoc>): Promise<INewsDoc | null> {
    return News.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async delete(id: string): Promise<void> {
    await News.findByIdAndDelete(id);
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: any = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const doc = await News.findOne(query).lean();
    return !!doc;
  }
}

export default new NewsRepository();
