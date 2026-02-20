import { handleGetNewsBySlug, handleGetAllNews } from '@/lib/actions/news-action';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  const d = Math.floor(h / 24);
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [articleRes, moreRes] = await Promise.all([
    handleGetNewsBySlug(slug),
    handleGetAllNews({ limit: '6', page: '1' }),
  ]);

  if (!articleRes.success || !articleRes.data) notFound();

  const article = articleRes.data;
  const more = (moreRes.success ? moreRes.data : []).filter((a: any) => a.slug !== slug).slice(0, 5);

  // Split content into paragraphs on blank lines
  const paragraphs = article.content.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Article ─────────────────────────────────────────────── */}
          <article className="lg:col-span-2">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link href="/news" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                News
              </Link>
              <span>/</span>
              <Link href={`/news?category=${article.category}`}
                className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors capitalize">
                {CATEGORY_LABELS[article.category] || article.category}
              </Link>
            </div>

            {/* Category + Breaking */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold text-white px-2 py-1 rounded ${CATEGORY_COLORS[article.category] || 'bg-gray-600'}`}>
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
              {article.isBreaking && (
                <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">● BREAKING</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 font-medium border-l-4 border-red-600 pl-4">
              {article.summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-4 border-b border-gray-200 dark:border-white/8 mb-6">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{article.author}</span>
              <span>·</span>
              <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
              <span>·</span>
              <span>👁 {article.views} views</span>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
              {paragraphs.map((para: string, i: number) => (
                <p key={i} className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar: More News ──────────────────────────────────── */}
          <aside className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                More News
              </h3>
            </div>

            {more.map((a: any) => (
              <Link key={a._id} href={`/news/${a.slug}`}
                className="group flex gap-3 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 rounded-xl p-3 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title} className="w-16 h-14 object-cover rounded-lg shrink-0" />
                ) : (
                  <div className="w-16 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg shrink-0 flex items-center justify-center">
                    📰
                  </div>
                )}
                <div className="min-w-0">
                  <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded ${CATEGORY_COLORS[a.category] || 'bg-gray-600'}`}>
                    {CATEGORY_LABELS[a.category] || a.category}
                  </span>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1 leading-snug">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(a.publishedAt || a.createdAt)}</p>
                </div>
              </Link>
            ))}

            <Link href="/news"
              className="block text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2">
              View All News →
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
