import Link from "next/link";
import { handleGetAllMatches } from "@/lib/actions/admin/match-action";
import MatchTable from "./_components/MatchTable";

export default async function MatchesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string; status?: string; format?: string }>;
}) {
    const { page = "1", limit = "10", status, format } = await searchParams;

    const response = await handleGetAllMatches(page, limit, status, format);
    const matches = response.success ? response.data : [];
    const pagination = response.success ? response.pagination : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Matches</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {pagination ? `${pagination.total} matches total` : "Manage all cricket matches"}
                    </p>
                </div>
                <Link href="/admin/matches/create"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                    + Create Match
                </Link>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
                <FilterLink label="All" href="/admin/matches" active={!status && !format} />
                <FilterLink label="🟢 Live" href="/admin/matches?status=live" active={status === "live"} />
                <FilterLink label="🔵 Upcoming" href="/admin/matches?status=upcoming" active={status === "upcoming"} />
                <FilterLink label="✅ Completed" href="/admin/matches?status=completed" active={status === "completed"} />
                <FilterLink label="🌧 Rain Delay" href="/admin/matches?status=rain_delay" active={status === "rain_delay"} />
                <span className="border-l border-gray-300 dark:border-gray-600 mx-1" />
                <FilterLink label="T20" href="/admin/matches?format=T20" active={format === "T20"} />
                <FilterLink label="ODI" href="/admin/matches?format=ODI" active={format === "ODI"} />
                <FilterLink label="TEST" href="/admin/matches?format=TEST" active={format === "TEST"} />
                <FilterLink label="T10" href="/admin/matches?format=T10" active={format === "T10"} />
            </div>

            {/* Error */}
            {!response.success && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    {response.message}
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <MatchTable matches={matches || []} />
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
                    <div className="flex gap-2">
                        {pagination.page > 1 && (
                            <Link href={`/admin/matches?page=${pagination.page - 1}&limit=${limit}${status ? `&status=${status}` : ""}${format ? `&format=${format}` : ""}`}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Previous
                            </Link>
                        )}
                        {pagination.page < pagination.totalPages && (
                            <Link href={`/admin/matches?page=${pagination.page + 1}&limit=${limit}${status ? `&status=${status}` : ""}${format ? `&format=${format}` : ""}`}
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
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            {label}
        </Link>
    );
}