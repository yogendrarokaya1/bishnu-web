'use server';

import { getAllNews, getNewsBySlug, getFeaturedNews, getBreakingNews, getLatestNews } from '@/lib/api/news';

export async function handleGetAllNews(params?: {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}) {
  try {
    return await getAllNews(params);
  } catch {
    return { success: false, data: [], message: 'Failed to load news' };
  }
}

export async function handleGetNewsBySlug(slug: string) {
  try {
    return await getNewsBySlug(slug);
  } catch {
    return { success: false, data: null, message: 'Article not found' };
  }
}

export async function handleGetFeaturedNews() {
  try {
    return await getFeaturedNews();
  } catch {
    return { success: false, data: [] };
  }
}

export async function handleGetBreakingNews() {
  try {
    return await getBreakingNews();
  } catch {
    return { success: false, data: [] };
  }
}

export async function handleGetLatestNews(limit = 10) {
  try {
    return await getLatestNews(limit);
  } catch {
    return { success: false, data: [] };
  }
}
