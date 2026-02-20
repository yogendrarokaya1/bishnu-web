"use client";

import { useState } from "react";
import Link from "next/link";
import { handleDeleteMatch, handleMarkLive, handleMarkCompleted } from "@/lib/actions/admin/match-action";

interface Match {
    _id: string;
    matchDesc: string;
    seriesName: string;
    format: string;
    matchType: string;
    status: string;
    team1: { name: string; shortName: string };
    team2: { name: string; shortName: string };
    venue: { city: string; country: string };
    scheduledDate: string;
    scheduledTime: string;
    isFeatured: boolean;
}

const STATUS_STYLES: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    abandoned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    rain_delay: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const FORMAT_STYLES: Record<string, string> = {
    T20: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    ODI: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    TEST: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    T10: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    THE_HUNDRED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function MatchTable({ matches }: { matches: Match[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [resultInput, setResultInput] = useState<Record<string, string>>({});
    const [showResultInput, setShowResultInput] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this match?")) return;
        setLoadingId(id);
        await handleDeleteMatch(id);
        setLoadingId(null);
    };

    const handleLive = async (id: string) => {
        setLoadingId(id);
        await handleMarkLive(id);
        setLoadingId(null);
    };

    const handleComplete = async (id: string) => {
        const result = resultInput[id];
        if (!result?.trim()) return;
        setCompletingId(id);
        await handleMarkCompleted(id, result);
        setShowResultInput(null);
        setCompletingId(null);
    };

    if (matches.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-3">🏏</p>
                <p className="font-medium">No matches found</p>
                <p className="text-sm mt-1">Create your first match to get started</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Match</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Format</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Venue</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {matches.map((match) => (
                        <tr key={match._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                            {/* Match Info */}
                            <td className="py-3 px-4">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {match.team1.shortName} vs {match.team2.shortName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{match.seriesName}</p>
                                {match.isFeatured && (
                                    <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                                        ⭐ Featured
                                    </span>
                                )}
                            </td>

                            {/* Format */}
                            <td className="py-3 px-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${FORMAT_STYLES[match.format] || ""}`}>
                                    {match.format}
                                </span>
                            </td>

                            {/* Venue */}
                            <td className="py-3 px-4">
                                <p className="text-gray-700 dark:text-gray-300">{match.venue.city}</p>
                                <p className="text-xs text-gray-400">{match.venue.country}</p>
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                <p>{new Date(match.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                                <p className="text-xs">{match.scheduledTime} UTC</p>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${STATUS_STYLES[match.status] || ""}`}>
                                    {match.status === "rain_delay" ? "🌧 Rain Delay" : match.status}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {/* Edit */}
                                    <Link href={`/admin/matches/${match._id}/edit`}
                                        className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        Edit
                                    </Link>

                                    {/* Scorecard */}
                                    <Link href={`/admin/matches/${match._id}/scorecard`}
                                        className="px-2.5 py-1 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                                        Scorecard
                                    </Link>

                                    {/* Go Live */}
                                    {match.status === "upcoming" && (
                                        <button onClick={() => handleLive(match._id)} disabled={loadingId === match._id}
                                            className="px-2.5 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50">
                                            Go Live
                                        </button>
                                    )}

                                    {/* Complete */}
                                    {match.status === "live" && (
                                        <>
                                            {showResultInput === match._id ? (
                                                <div className="flex gap-1 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. IND won by 5 wkts"
                                                        value={resultInput[match._id] || ""}
                                                        onChange={(e) => setResultInput(prev => ({ ...prev, [match._id]: e.target.value }))}
                                                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-44"
                                                    />
                                                    <button onClick={() => handleComplete(match._id)} disabled={completingId === match._id}
                                                        className="px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                        ✓
                                                    </button>
                                                    <button onClick={() => setShowResultInput(null)}
                                                        className="px-2 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setShowResultInput(match._id)}
                                                    className="px-2.5 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                                    Complete
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Delete */}
                                    <button onClick={() => handleDelete(match._id)} disabled={loadingId === match._id}
                                        className="px-2.5 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50">
                                        {loadingId === match._id ? "..." : "Delete"}
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