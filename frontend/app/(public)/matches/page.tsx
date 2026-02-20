import Link from "next/link";
import { handleGetPublicMatches } from "@/lib/actions/match-action";

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
}

const FORMAT_COLOR: Record<string, string> = {
    T20: "#a855f7", ODI: "#f97316", TEST: "#ef4444", T10: "#ec4899", THE_HUNDRED: "#6366f1",
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function MatchesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; format?: string; page?: string }>;
}) {
    const { status, format, page = "1" } = await searchParams;

    const response = await handleGetPublicMatches(page, "12", status, format);
    const matches: Match[] = response.data ?? [];
    const pagination = response.pagination ?? null;

    const TABS = [
        { label: "All", value: undefined },
        { label: "🟢 Live", value: "live" },
        { label: "📅 Upcoming", value: "upcoming" },
        { label: "✅ Completed", value: "completed" },
        { label: "🌧 Rain Delay", value: "rain_delay" },
    ];

    const FORMATS = ["T20", "ODI", "TEST", "T10", "THE_HUNDRED"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Matches</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {pagination ? `${pagination.total} matches` : "All cricket matches"}
                    </p>
                </div>

                {/* Status tabs */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {TABS.map((tab) => {
                        const href = tab.value ? `/matches?status=${tab.value}` : "/matches";
                        const active = status === tab.value || (!status && !tab.value);
                        return (
                            <Link key={tab.label} href={href}
                                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                                    active
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                        : "bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/15"
                                }`}>
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Format filters */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FORMATS.map((f) => {
                        const active = format === f;
                        const href = `/matches?format=${f}${status ? `&status=${status}` : ""}`;
                        return (
                            <Link key={f} href={href}
                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                                    active ? "text-white border-transparent" : "bg-white dark:bg-[#161b27] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/8"
                                }`}
                                style={active ? { background: FORMAT_COLOR[f] } : {}}>
                                {f === "THE_HUNDRED" ? "100" : f}
                            </Link>
                        );
                    })}
                    {format && (
                        <Link href={status ? `/matches?status=${status}` : "/matches"}
                            className="px-3 py-1 text-xs font-medium text-red-500 hover:underline">
                            Clear ✕
                        </Link>
                    )}
                </div>

                {/* Grid */}
                {matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-5xl mb-3">🏏</span>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No matches found</p>
                        <Link href="/matches" className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Clear filters
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {matches.map((match) => {
                            const isLive = match.status === "live";
                            const isCompleted = match.status === "completed";
                            return (
                                <Link key={match._id} href={`/matches/${match._id}`}>
                                    <div className={`group bg-white dark:bg-[#161b27] rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                                        isLive ? "border-green-400/40 dark:border-green-500/25" : "border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/15"
                                    }`}>
                                        {isLive && <div className="h-[2px] bg-gradient-to-r from-green-400 to-emerald-400" />}
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 truncate max-w-[60%]">{match.seriesName}</span>
                                                <div className="flex items-center gap-1.5">
                                                    {isLive && (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                                        style={{ color: FORMAT_COLOR[match.format] ?? "#6b7280", background: `${FORMAT_COLOR[match.format] ?? "#6b7280"}18` }}>
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
                                                            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{team.name}</span>
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
                                                    : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-500"
                                                }`}>
                                                    {match.status === "rain_delay" ? "Rain" : match.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3">
                        {pagination.page > 1 && (
                            <Link href={`/matches?page=${pagination.page - 1}${status ? `&status=${status}` : ""}${format ? `&format=${format}` : ""}`}
                                className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 hover:border-gray-300 transition-colors">
                                ← Previous
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</span>
                        {pagination.page < pagination.totalPages && (
                            <Link href={`/matches?page=${pagination.page + 1}${status ? `&status=${status}` : ""}${format ? `&format=${format}` : ""}`}
                                className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 hover:border-gray-300 transition-colors">
                                Next →
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
