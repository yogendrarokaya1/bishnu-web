import Link from 'next/link';
import { handleGetAllNews, handleGetFeaturedNews, handleGetBreakingNews } from '@/lib/actions/news-action';

const CATEGORIES = [
  { value: '',              label: 'All News'      },
  { value: 'top_stories',   label: 'Top Stories'   },
  { value: 'international', label: 'International'  },
  { value: 'ipl',           label: 'IPL'            },
  { value: 'npl',           label: 'NPL'            },
  { value: 'domestic',      label: 'Domestic'       },
];

const CATEGORY_COLORS: Record<string, string> = {
  top_stories:   'bg-red-600',
  international: 'bg-blue-600',
  ipl:           'bg-purple-600',
  npl:           'bg-green-600',
  domestic:      'bg-orange-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  top_stories:   'Top Stories',
  international: 'International',
  ipl:           'IPL',
  npl:           'NPL',
  domestic:      'Domestic',
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>;
}) {
  const { category, page = '1', search } = await searchParams;

  const [newsRes, featuredRes, breakingRes] = await Promise.all([
    handleGetAllNews({ page, limit: '12', category, search }),
    handleGetFeaturedNews(),
    handleGetBreakingNews(),
  ]);

  const articles  = newsRes.success    ? newsRes.data    : [];
  const featured  = featuredRes.success ? featuredRes.data : [];
  const breaking  = breakingRes.success ? breakingRes.data : [];
  const pagination = newsRes.success   ? newsRes.pagination : null;
  const hero      = featured[0] || articles[0];
  const sideStories = featured.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">

      {/* ── Breaking News Ticker ──────────────────────────────────────── */}
      {breaking.length > 0 && (
        <div className="bg-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 text-xs font-black uppercase tracking-widest bg-white text-red-600 px-2 py-0.5 rounded">
              BREAKING
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-marquee whitespace-nowrap text-sm font-medium">
                {breaking.map((b: any) => (
                  <Link key={b._id} href={`/news/${b.slug}`} className="hover:underline shrink-0">
                    {b.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Category Tabs ─────────────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {CATEGORIES.map(c => (
            <Link key={c.value}
              href={c.value ? `/news?category=${c.value}` : '/news'}
              className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                (category || '') === c.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
              }`}>
              {c.label}
            </Link>
          ))}
        </div>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <form method="GET" action="/news" className="mb-6">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative max-w-md">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b27] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </form>

        {/* ── Hero + Side Stories (only on first page, no search, no category filter) ── */}
        {!category && !search && page === '1' && hero && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Big Hero */}
            <Link href={`/news/${hero.slug}`} className="lg:col-span-2 group relative rounded-2xl overflow-hidden bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/20 transition-all">
              {hero.coverImage ? (
                <img src={hero.coverImage} alt={hero.title}
                  className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <span className="text-5xl">📰</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${CATEGORY_COLORS[hero.category] || 'bg-gray-600'}`}>
                    {CATEGORY_LABELS[hero.category] || hero.category}
                  </span>
                  {hero.isBreaking && (
                    <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">● BREAKING</span>
                  )}
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {hero.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{hero.summary}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>{hero.author}</span>
                  <span>·</span>
                  <span>{timeAgo(hero.publishedAt || hero.createdAt)}</span>
                  <span>·</span>
                  <span>{hero.readTime} min read</span>
                </div>
              </div>
            </Link>

            {/* Side Stories */}
            <div className="flex flex-col gap-3">
              {sideStories.map((a: any) => (
                <Link key={a._id} href={`/news/${a.slug}`}
                  className="group flex gap-3 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/20 rounded-xl p-3 transition-all">
                  {a.coverImage ? (
                    <img src={a.coverImage} alt={a.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                  ) : (
                    <div className="w-20 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg shrink-0 flex items-center justify-center text-xl">
                      📰
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded ${CATEGORY_COLORS[a.category] || 'bg-gray-600'}`}>
                      {CATEGORY_LABELS[a.category] || a.category}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1 leading-snug">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(a.publishedAt || a.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 bg-red-600 rounded-full" />
          <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wide">
            {category ? CATEGORY_LABELS[category] || category : 'Latest News'}
          </h2>
        </div>

        {/* ── News Grid ────────────────────────────────────────────────── */}
        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p className="font-medium">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((a: any) => (
              <Link key={a._id} href={`/news/${a.slug}`}
                className="group flex flex-col bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm transition-all">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-3xl">
                    📰
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded ${CATEGORY_COLORS[a.category] || 'bg-gray-600'}`}>
                      {CATEGORY_LABELS[a.category] || a.category}
                    </span>
                    {a.isBreaking && (
                      <span className="text-xs font-black text-red-600 dark:text-red-400">● LIVE</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3 leading-snug flex-1">
                    {a.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">{a.summary}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span>{a.author}</span>
                    <span>{timeAgo(a.publishedAt || a.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {pagination.page > 1 && (
              <Link href={`/news?page=${pagination.page - 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#161b27] transition-colors">
                ← Previous
              </Link>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            {pagination.page < pagination.totalPages && (
              <Link href={`/news?page=${pagination.page + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#161b27] transition-colors">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
