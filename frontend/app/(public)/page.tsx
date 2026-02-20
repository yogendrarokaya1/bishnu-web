import Link from "next/link";
import { handleGetPublicMatches } from "@/lib/actions/match-action";
import { handleGetLatestNews, handleGetBreakingNews } from "@/lib/actions/news-action";

interface Match {
    _id: string;
    seriesName: string;
    format: string;
    status: string;
    team1: { name: string; shortName: string };
    team2: { name: string; shortName: string };
    venue: { stadiumName: string; city: string; country: string };
    scheduledDate: string;
    scheduledTime: string;
    result?: string;
    liveStatus?: string;
    isFeatured?: boolean;
}

const FORMAT_COLOR: Record<string, string> = {
    T20: "#a855f7",
    ODI: "#f97316",
    TEST: "#ef4444",
    T10: "#ec4899",
    THE_HUNDRED: "#6366f1",
};

const CATEGORY_COLORS: Record<string, string> = {
    top_stories:   "bg-red-600",
    international: "bg-blue-600",
    ipl:           "bg-purple-600",
    npl:           "bg-green-600",
    domestic:      "bg-orange-600",
};

const CATEGORY_LABELS: Record<string, string> = {
    top_stories:   "Top Stories",
    international: "International",
    ipl:           "IPL",
    npl:           "NPL",
    domestic:      "Domestic",
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function LiveDot() {
    return (
        <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
    );
}

function MatchCard({ match }: { match: Match }) {
    const isLive = match.status === "live";
    const isCompleted = match.status === "completed";

    return (
        <Link href={`/matches/${match._id}`}>
            <div className={`
                group bg-white dark:bg-[#161b27] rounded-xl border overflow-hidden
                transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer
                ${isLive
                    ? "border-green-400/40 dark:border-green-500/25"
                    : "border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/15"}
            `}>
                {isLive && <div className="h-[2px] w-full bg-gradient-to-r from-green-400 to-emerald-400" />}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 truncate max-w-[60%]">
                            {match.seriesName}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {isLive && <LiveDot />}
                            <span
                                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{
                                    color: FORMAT_COLOR[match.format] ?? "#6b7280",
                                    background: `${FORMAT_COLOR[match.format] ?? "#6b7280"}18`,
                                }}
                            >
                                {match.format}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0 space-y-1.5">
                            {[match.team1, match.team2].map((team, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${i === 0 ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-orange-500 to-red-600"}`}>
                                        {team.shortName.slice(0, 2)}
                                    </div>
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {team.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="text-right shrink-0 max-w-[42%]">
                            {isLive && match.liveStatus ? (
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium leading-tight">{match.liveStatus}</p>
                            ) : isCompleted && match.result ? (
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{match.result}</p>
                            ) : (
                                <>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{formatDate(match.scheduledDate)}</p>
                                    <p className="text-[11px] text-gray-400">{match.scheduledTime} UTC</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/5">
                        <span className="text-[11px] text-gray-400 truncate">📍 {match.venue.city}, {match.venue.country}</span>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            isLive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : match.status === "upcoming" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : match.status === "completed" ? "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-500"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                            {match.status === "rain_delay" ? "Rain" : match.status}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SectionHeader({ title, count, href }: { title: string; count?: number; href?: string }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
                {!!count && (
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
            </div>
            {href && (
                <Link href={href} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    See all →
                </Link>
            )}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center">
            <span className="text-3xl mb-2">🏏</span>
            <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
        </div>
    );
}

export default async function HomePage() {
    const [liveRes, upcomingRes, recentRes, latestNewsRes, breakingRes] = await Promise.all([
        handleGetPublicMatches("1", "6", "live"),
        handleGetPublicMatches("1", "6", "upcoming"),
        handleGetPublicMatches("1", "6", "completed"),
        handleGetLatestNews(6),
        handleGetBreakingNews(),
    ]);

    const live: Match[]    = liveRes.data ?? [];
    const upcoming: Match[] = upcomingRes.data ?? [];
    const recent: Match[]  = recentRes.data ?? [];
    const latestNews: any[] = latestNewsRes.data ?? [];
    const breaking: any[]  = breakingRes.data ?? [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">

            {/* ── Breaking News Ticker ───────────────────────────────────── */}
            {breaking.length > 0 && (
                <div className="bg-red-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-hidden">
                        <span className="shrink-0 text-xs font-black uppercase tracking-widest bg-white text-red-600 px-2 py-0.5 rounded">
                            BREAKING
                        </span>
                        <div className="overflow-hidden flex-1">
                            <div className="flex gap-8 whitespace-nowrap text-sm font-medium overflow-hidden">
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

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-white/10">
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                    <div className="relative px-6 py-8 md:px-10 md:py-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                {live.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full mb-3">
                                        <LiveDot />
                                        {live.length} Live {live.length === 1 ? "Match" : "Matches"}
                                    </span>
                                )}
                                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                    Your Cricket<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                        Command Centre
                                    </span>
                                </h1>
                                <p className="mt-3 text-sm text-gray-400 max-w-sm">
                                    Live scores, schedules, results and latest cricket news — all in one place.
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <Link href="/matches" className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-green-500 hover:bg-green-400 text-white transition-colors">
                                    All Matches
                                </Link>
                                <Link href="/news" className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors">
                                    Latest News
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { label: "Live Now",  value: live.length,     color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30" },
                        { label: "Upcoming",  value: upcoming.length, color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30" },
                        { label: "Completed", value: recent.length,   color: "text-gray-600 dark:text-gray-400",   bg: "bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/8" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: 2/3 */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Live Matches */}
                        <section>
                            <SectionHeader title="🟢 Live Matches" count={live.length} />
                            {live.length > 0
                                ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{live.map(m => <MatchCard key={m._id} match={m} />)}</div>
                                : <EmptyState label="No live matches right now" />
                            }
                        </section>

                        {/* Upcoming */}
                        <section>
                            <SectionHeader title="📅 Upcoming Matches" count={upcoming.length} href="/matches?status=upcoming" />
                            {upcoming.length > 0
                                ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{upcoming.map(m => <MatchCard key={m._id} match={m} />)}</div>
                                : <EmptyState label="No upcoming matches scheduled" />
                            }
                        </section>

                        {/* Latest News */}
                        {latestNews.length > 0 && (
                            <section>
                                <SectionHeader title="📰 Latest News" href="/news" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {latestNews.map((article: any) => (
                                        <Link key={article._id} href={`/news/${article.slug}`}
                                            className="group flex gap-3 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 rounded-xl p-3.5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm transition-all">
                                            {article.coverImage ? (
                                                <img src={article.coverImage} alt={article.title}
                                                    className="w-20 h-16 object-cover rounded-lg shrink-0" />
                                            ) : (
                                                <div className="w-20 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg shrink-0 flex items-center justify-center text-xl">
                                                    📰
                                                </div>
                                            )}
                                            <div className="min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${CATEGORY_COLORS[article.category] || "bg-gray-600"}`}>
                                                        {CATEGORY_LABELS[article.category] || article.category}
                                                    </span>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1 leading-snug">
                                                        {article.title}
                                                    </p>
                                                </div>
                                                <p className="text-[11px] text-gray-400 mt-1">
                                                    {article.author} · {timeAgo(article.publishedAt || article.createdAt)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right sidebar: 1/3 */}
                    <div className="space-y-6">

                        {/* Recent Results */}
                        <section>
                            <SectionHeader title="✅ Recent Results" href="/matches?status=completed" />
                            {recent.length > 0 ? (
                                <div className="space-y-3">
                                    {recent.map(m => (
                                        <Link key={m._id} href={`/matches/${m._id}`}>
                                            <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 p-3.5 hover:border-gray-300 dark:hover:border-white/15 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 truncate">{m.seriesName}</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {m.team1.shortName} vs {m.team2.shortName}
                                                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                                                        style={{ color: FORMAT_COLOR[m.format], background: `${FORMAT_COLOR[m.format]}18` }}>
                                                        {m.format}
                                                    </span>
                                                </p>
                                                {m.result && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{m.result}</p>}
                                                <p className="text-[11px] text-gray-400 mt-1.5">📍 {m.venue.city}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : <EmptyState label="No recent results" />}
                        </section>

                        {/* Top news sidebar */}
                        {latestNews.length > 0 && (
                            <section>
                                <SectionHeader title="🗞 Top Stories" href="/news?category=top_stories" />
                                <div className="space-y-2">
                                    {latestNews.slice(0, 4).map((article: any) => (
                                        <Link key={article._id} href={`/news/${article.slug}`}
                                            className="group flex gap-2.5 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 rounded-xl p-3 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                                            <div className={`w-1 rounded-full shrink-0 self-stretch ${CATEGORY_COLORS[article.category] || "bg-gray-400"}`} />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                                    {article.title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {timeAgo(article.publishedAt || article.createdAt)} · {article.readTime} min
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Format guide */}
                        <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 p-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Browse by Format</h3>
                            <div className="space-y-1">
                                {Object.entries(FORMAT_COLOR).map(([fmt, color]) => (
                                    <Link key={fmt} href={`/matches?format=${fmt}`}>
                                        <div className="flex items-center justify-between py-2 hover:opacity-75 transition-opacity cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                    {fmt === "THE_HUNDRED" ? "The Hundred" : fmt}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}