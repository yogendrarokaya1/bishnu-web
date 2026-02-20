import { handleGetPublicMatchById } from "@/lib/actions/match-action";
import { handleGetScorecard } from "@/lib/actions/scorecard-action";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Batsman { name: string; dismissal: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number; isNotOut: boolean; }
interface Bowler { name: string; overs: number; maidens: number; runs: number; wickets: number; economy: number; noBalls: number; wides: number; }
interface Extras { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; total: number; }
interface FoW { wicketNumber: number; runs: number; overs: number; batsmanName: string; }
interface Innings { inningsNumber: number; battingTeam: string; bowlingTeam: string; totalRuns: number; totalWickets: number; totalOvers: number; runRate: number; isCompleted: boolean; isDeclared: boolean; batting: Batsman[]; bowling: Bowler[]; extras: Extras; fallOfWickets: FoW[]; }
interface LiveScore { score: string; runRate: string; requiredRunRate?: string; target?: number; situation: string; battingTeam: string; bowlingTeam: string; batsmanOne: any; batsmanTwo: any; currentBowler: any; recentBalls: string[]; lastWicket?: string; commentary?: string; }

const STATUS_STYLE: Record<string, string> = {
    live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    upcoming: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-500",
    abandoned: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    rain_delay: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });
}

function LiveDot() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
    );
}

function LiveScoreWidget({ live }: { live: LiveScore }) {
    const ballColor = (b: string) => {
        if (b === "W") return "bg-red-500 text-white";
        if (b === "4") return "bg-blue-500 text-white";
        if (b === "6") return "bg-purple-500 text-white";
        if (b === "0") return "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    };

    return (
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-white/10 p-5 mb-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <LiveDot />
                        <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Live</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight">{live.score}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                        CRR: {live.runRate}{live.requiredRunRate && ` · RRR: ${live.requiredRunRate}`}
                    </p>
                </div>
                {live.target && (
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Target</p>
                        <p className="text-2xl font-black text-white">{live.target}</p>
                    </div>
                )}
            </div>

            {live.situation && (
                <p className="text-sm text-yellow-300 font-medium mb-4 bg-yellow-400/10 border border-yellow-400/20 px-3 py-2 rounded-lg">
                    {live.situation}
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
                {[live.batsmanOne, live.batsmanTwo].filter(Boolean).map((b, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">{i === 0 ? "⚡ Striker" : "Non-Striker"}</p>
                        <p className="font-bold text-white text-sm truncate">{b.name}</p>
                        <p className="text-xl font-black text-white">{b.runs} <span className="text-sm font-normal text-gray-400">({b.balls})</span></p>
                        <p className="text-xs text-gray-400">{b.fours}×4 · {b.sixes}×6 · SR {b.strikeRate}</p>
                    </div>
                ))}
            </div>

            {live.currentBowler?.name && (
                <div className="bg-white/5 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">🎳 Bowling</p>
                    <p className="font-bold text-white text-sm">{live.currentBowler.name}</p>
                    <p className="text-xs text-gray-400">{live.currentBowler.overs} ov · {live.currentBowler.runs} runs · {live.currentBowler.wickets} wkts · ECO {live.currentBowler.economy}</p>
                </div>
            )}

            {live.recentBalls?.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-500 font-medium">This over:</span>
                    <div className="flex gap-1.5 flex-wrap">
                        {live.recentBalls.map((b, i) => (
                            <span key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${ballColor(b)}`}>{b}</span>
                        ))}
                    </div>
                </div>
            )}

            {live.lastWicket && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                    🔴 Last wicket: {live.lastWicket}
                </p>
            )}
            {live.commentary && (
                <p className="mt-3 text-xs text-gray-400 italic border-t border-white/10 pt-3">💬 {live.commentary}</p>
            )}
        </div>
    );
}

function BattingCard({ batting, extras, fow }: { batting: Batsman[]; extras: Extras; fow: FoW[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-white/8">
                        {["Batter", "R", "B", "4s", "6s", "SR"].map((h, i) => (
                            <th key={h} className={`py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 ${i === 0 ? "text-left w-full" : "text-right"}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {batting.map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                            <td className="py-2.5 px-3">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {b.name}{b.isNotOut && <span className="text-green-600 dark:text-green-400">*</span>}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{b.dismissal}</p>
                            </td>
                            <td className="text-right py-2.5 px-3 font-bold text-gray-900 dark:text-white">{b.runs}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.balls}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.fours}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.sixes}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.strikeRate}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t border-gray-100 dark:border-white/8">
                        <td colSpan={6} className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400">
                            Extras: {extras?.total ?? 0} (w {extras?.wides ?? 0}, nb {extras?.noBalls ?? 0}, b {extras?.byes ?? 0}, lb {extras?.legByes ?? 0})
                        </td>
                    </tr>
                </tfoot>
            </table>
            {fow?.length > 0 && (
                <div className="px-3 py-2.5 border-t border-gray-100 dark:border-white/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Fall of Wickets</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {fow.map(f => `${f.runs}-${f.wicketNumber} (${f.batsmanName}, ${f.overs} ov)`).join("  ·  ")}
                    </p>
                </div>
            )}
        </div>
    );
}

function BowlingCard({ bowling }: { bowling: Bowler[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-white/8">
                        {["Bowler", "O", "M", "R", "W", "ECO", "WD", "NB"].map((h, i) => (
                            <th key={h} className={`py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 ${i === 0 ? "text-left w-full" : "text-right"}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {bowling.map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">{b.name}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.overs}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.maidens}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.runs}</td>
                            <td className="text-right py-2.5 px-3 font-bold text-gray-900 dark:text-white">{b.wickets}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.economy}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.wides}</td>
                            <td className="text-right py-2.5 px-3 text-gray-500 dark:text-gray-400">{b.noBalls}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function InningsSection({ innings }: { innings: Innings }) {
    return (
        <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/3 border-b border-gray-200 dark:border-white/8">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mr-2">
                        Innings {innings.inningsNumber}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{innings.battingTeam} batting</span>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                        {innings.totalRuns}/{innings.totalWickets}{innings.isDeclared ? "d" : ""}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">({innings.totalOvers} Ov)</span>
                    <p className="text-xs text-gray-400 mt-0.5">RR: {innings.runRate}</p>
                </div>
            </div>
            <div className="border-b border-gray-100 dark:border-white/5">
                <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Batting</p>
                <BattingCard batting={innings.batting} extras={innings.extras} fow={innings.fallOfWickets} />
            </div>
            <div>
                <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Bowling</p>
                <BowlingCard bowling={innings.bowling} />
            </div>
        </div>
    );
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [matchRes, scorecardRes] = await Promise.all([
        handleGetPublicMatchById(id),
        handleGetScorecard(id),
    ]);

    if (!matchRes.success || !matchRes.data) notFound();

    const match = matchRes.data;
    const scorecard = scorecardRes.success ? scorecardRes.data : null;
    const isLive = match.status === "live";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
                <Link href="/matches" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors">
                    ← Back to Matches
                </Link>

                {/* Match Header */}
                <div className="bg-white dark:bg-[#161b27] rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden mb-6">
                    {isLive && <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-400" />}
                    <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{match.seriesName}</p>
                                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    {match.matchDesc || `${match.team1.name} vs ${match.team2.name}`}
                                </h1>
                            </div>
                            <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 ${STATUS_STYLE[match.status] || ""}`}>
                                {isLive && <LiveDot />}
                                {match.status === "rain_delay" ? "Rain Delay" : match.status}
                            </span>
                        </div>

                        {/* Teams */}
                        <div className="grid grid-cols-3 gap-4 items-center mb-5">
                            {[match.team1, match.team2].map((team, i) => (
                                <>
                                    {i === 1 && (
                                        <div key="vs" className="text-center">
                                            <p className="text-gray-400 font-bold text-xl">VS</p>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{match.format}</p>
                                        </div>
                                    )}
                                    <div key={team.shortName} className="text-center">
                                        <div className={`h-14 w-14 mx-auto rounded-full flex items-center justify-center text-white text-lg font-black mb-1.5 ${i === 0 ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-orange-500 to-red-600"}`}>
                                            {team.shortName.slice(0, 2)}
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{team.name}</p>
                                        <p className="text-xs text-gray-400">{team.shortName}</p>
                                    </div>
                                </>
                            ))}
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">📍 Venue</p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{match.venue.stadiumName}</p>
                                <p className="text-xs text-gray-400">{match.venue.city}, {match.venue.country}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">📅 Date</p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(match.scheduledDate)}</p>
                                <p className="text-xs text-gray-400">{match.scheduledTime} UTC</p>
                            </div>
                        </div>

                        {match.toss && (
                            <p className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
                                🪙 <span className="font-medium text-gray-700 dark:text-gray-300">{match.toss.winner}</span> won the toss and elected to <span className="font-medium">{match.toss.decision}</span>
                            </p>
                        )}
                        {match.result && (
                            <p className="mt-3 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                                🏆 {match.result}
                            </p>
                        )}
                    </div>
                </div>

                {/* Live widget */}
                {isLive && scorecard?.liveScore && <LiveScoreWidget live={scorecard.liveScore} />}

                {/* Scorecard */}
                {scorecard?.innings?.length > 0 ? (
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Scorecard</h2>
                        {scorecard.innings.map((innings: Innings) => (
                            <InningsSection key={innings.inningsNumber} innings={innings} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 p-10 text-center">
                        <p className="text-4xl mb-3">🏏</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {match.status === "upcoming" ? "Scorecard will be available once the match starts" : "Scorecard not available yet"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
