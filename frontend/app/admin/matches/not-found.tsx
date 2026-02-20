import Link from "next/link";

export default function MatchNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🏏</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Match Not Found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This match doesn't exist or may have been deleted.
            </p>
            <Link
                href="/admin/matches"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 transition-colors"
            >
                Back to Matches
            </Link>
        </div>
    );
}
