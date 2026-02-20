'use server';

import { revalidatePath } from 'next/cache';
import { adminGetAllNews, adminGetOneNews, adminCreateNews, adminUpdateNews, adminDeleteNews } from '@/lib/api/admin/news';

export async function handleAdminGetAllNews(params?: any) {
  try {
    return await adminGetAllNews(params);
  } catch {
    return { success: false, data: [], message: 'Failed to load articles' };
  }
}

export async function handleAdminGetOneNews(id: string) {
  try {
    return await adminGetOneNews(id);
  } catch {
    return { success: false, data: null, message: 'Article not found' };
  }
}

export async function handleAdminCreateNews(payload: any) {
  try {
    const res = await adminCreateNews(payload);
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return res;
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || 'Failed to create article' };
  }
}

export async function handleAdminUpdateNews(id: string, payload: any) {
  try {
    const res = await adminUpdateNews(id, payload);
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return res;
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || 'Failed to update article' };
  }
}

export async function handleAdminDeleteNews(id: string) {
  try {
    const res = await adminDeleteNews(id);
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return res;
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || 'Failed to delete article' };
  }
}
