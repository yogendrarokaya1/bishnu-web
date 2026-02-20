import publicAxios from "./publicAxios";
import { NEWS } from "./endpoints";

export async function getAllNews(params?: {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}) {
  const { data } = await publicAxios.get(NEWS.ALL, { params });
  return data;
}

export async function getNewsBySlug(slug: string) {
  const { data } = await publicAxios.get(NEWS.BY_SLUG(slug));
  return data;
}

export async function getFeaturedNews() {
  const { data } = await publicAxios.get(NEWS.FEATURED);
  return data;
}

export async function getBreakingNews() {
  const { data } = await publicAxios.get(NEWS.BREAKING);
  return data;
}

export async function getLatestNews(limit = 10) {
  const { data } = await publicAxios.get(NEWS.LATEST, { params: { limit } });
  return data;
}
