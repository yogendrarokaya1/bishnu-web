'use client';

import { useState } from 'react';
import Link from 'next/link';
import { handleAdminDeleteNews, handleAdminUpdateNews } from '@/lib/actions/admin/news-action';

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  status: string;
  isBreaking: boolean;
  isFeatured: boolean;
  author: string;
  views: number;
  readTime: number;
  publishedAt?: string;
  createdAt: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  top_stories:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  international: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ipl:           'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  npl:           'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  domestic:      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const CATEGORY_LABELS: Record<string, string> = {
  top_stories:   'Top Stories',
  international: 'International',
  ipl:           'IPL',
  npl:           'NPL',
  domestic:      'Domestic',
};

export default function NewsTable({ articles }: { articles: NewsItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    setLoadingId(id);
    await handleAdminDeleteNews(id);
    setLoadingId(null);
  };

  const togglePublish = async (article: NewsItem) => {
    setLoadingId(article._id);
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    await handleAdminUpdateNews(article._id, { status: newStatus });
    setLoadingId(null);
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="text-4xl mb-3">📰</p>
        <p className="font-medium">No articles yet</p>
        <p className="text-sm mt-1">Create your first article to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Article</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Stats</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {articles.map((article) => (
            <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

              {/* Title */}
              <td className="py-3 px-4 max-w-xs">
                <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {article.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{article.author} · {article.readTime} min read</p>
                <div className="flex gap-1 mt-1">
                  {article.isBreaking && (
                    <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">BREAKING</span>
                  )}
                  {article.isFeatured && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded">⭐ Featured</span>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${CATEGORY_STYLES[article.category] || ''}`}>
                  {CATEGORY_LABELS[article.category] || article.category}
                </span>
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {article.status}
                </span>
              </td>

              {/* Stats */}
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                <p className="text-xs">👁 {article.views} views</p>
              </td>

              {/* Date */}
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : new Date(article.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1.5">
                  <Link href={`/admin/news/${article._id}/edit`}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Edit
                  </Link>

                  <button
                    onClick={() => togglePublish(article)}
                    disabled={loadingId === article._id}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 ${
                      article.status === 'published'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                    }`}>
                    {loadingId === article._id ? '...' : article.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDelete(article._id)}
                    disabled={loadingId === article._id}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50">
                    {loadingId === article._id ? '...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
