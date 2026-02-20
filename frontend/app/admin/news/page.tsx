import Link from 'next/link';
import { handleAdminGetAllNews } from '@/lib/actions/admin/news-action';
import NewsTable from './_components/NewsTable';

const CATEGORIES = [
  { value: '',              label: 'All'           },
  { value: 'top_stories',   label: 'Top Stories'   },
  { value: 'international', label: 'International'  },
  { value: 'ipl',           label: 'IPL'            },
  { value: 'npl',           label: 'NPL'            },
  { value: 'domestic',      label: 'Domestic'       },
];

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; status?: string }>;
}) {
  const { page = '1', category, status } = await searchParams;

  const response = await handleAdminGetAllNews({ page, limit: '15', category, status });
  const articles = response.success ? response.data : [];
  const pagination = response.success ? response.pagination : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News & Articles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination ? `${pagination.total} articles total` : 'Manage all news articles'}
          </p>
        </div>
        <Link href="/admin/news/create"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
          + Write Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status */}
        <FilterLink label="All Status" href={`/admin/news${category ? `?category=${category}` : ''}`} active={!status} />
        <FilterLink label="✅ Published" href={`/admin/news?status=published${category ? `&category=${category}` : ''}`} active={status === 'published'} />
        <FilterLink label="📝 Draft" href={`/admin/news?status=draft${category ? `&category=${category}` : ''}`} active={status === 'draft'} />

        <span className="border-l border-gray-300 dark:border-gray-600 mx-1" />

        {/* Category */}
        {CATEGORIES.map(c => (
          <FilterLink
            key={c.value}
            label={c.label}
            href={`/admin/news${c.value ? `?category=${c.value}` : ''}${status ? `${c.value ? '&' : '?'}status=${status}` : ''}`}
            active={category === c.value || (!category && c.value === '')}
          />
        ))}
      </div>

      {/* Error */}
      {!response.success && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {response.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <NewsTable articles={articles || []} />
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link href={`/admin/news?page=${pagination.page - 1}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}`}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Previous
              </Link>
            )}
            {pagination.page < pagination.totalPages && (
              <Link href={`/admin/news?page=${pagination.page + 1}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}`}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link href={href}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}>
      {label}
    </Link>
  );
}
