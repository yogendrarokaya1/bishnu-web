export default function MatchesLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
                <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                ))}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
                        ))}
                    </div>
                </div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-gray-50 dark:border-gray-800">
                        <div className="grid grid-cols-6 gap-4">
                            {[...Array(6)].map((_, j) => (
                                <div key={j} className="h-5 bg-gray-100 dark:bg-gray-800 rounded" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
