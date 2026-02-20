"use client";

import { useState } from "react";
import { handleInitScorecard, handleUpsertInnings, handleUpdateLiveScore, handleClearLiveScore } from "@/lib/actions/admin/scorecard-action";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BatsmanRow { name: string; dismissal: string; runs: string; balls: string; fours: string; sixes: string; isNotOut: boolean; }
interface BowlerRow { name: string; overs: string; maidens: string; runs: string; wickets: string; noBalls: string; wides: string; }
interface FowRow { wicketNumber: string; runs: string; overs: string; batsmanName: string; }

const emptyBatsman = (): BatsmanRow => ({ name: "", dismissal: "not out", runs: "0", balls: "0", fours: "0", sixes: "0", isNotOut: true });
const emptyBowler = (): BowlerRow => ({ name: "", overs: "0", maidens: "0", runs: "0", wickets: "0", noBalls: "0", wides: "0" });
const emptyFow = (): FowRow => ({ wicketNumber: "", runs: "", overs: "", batsmanName: "" });

function n(v: string) { return parseFloat(v) || 0; }

// ── Reusable UI ───────────────────────────────────────────────────────────────
function Button({ children, onClick, variant = "primary", size = "sm", disabled = false }: any) {
    const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const sizes: any = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm" };
    const variants: any = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        green: "bg-green-600 hover:bg-green-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        outline: "border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]}`}>
            {children}
        </button>
    );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }: any) {
    return (
        <div>
            {label && <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-8 px-2.5 text-sm bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
        </div>
    );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {type === "success" ? "✅" : "❌"} {msg}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ScorecardEditor({ matchId, match, scorecard: initialScorecard }: {
    matchId: string;
    match: any;
    scorecard: any;
}) {
    const [scorecard, setScorecard] = useState(initialScorecard);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [activeTab, setActiveTab] = useState<"innings" | "live">("innings");
    const [activeInnings, setActiveInnings] = useState(1);

    // Innings form state
    const [battingTeam, setBattingTeam] = useState(match.team1.shortName);
    const [bowlingTeam, setBowlingTeam] = useState(match.team2.shortName);
    const [totalRuns, setTotalRuns] = useState("0");
    const [totalWickets, setTotalWickets] = useState("0");
    const [totalOvers, setTotalOvers] = useState("0");
    const [isDeclared, setIsDeclared] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [batting, setBatting] = useState<BatsmanRow[]>([emptyBatsman(), emptyBatsman(), emptyBatsman()]);
    const [bowling, setBowling] = useState<BowlerRow[]>([emptyBowler(), emptyBowler()]);
    const [fow, setFow] = useState<FowRow[]>([]);
    const [extras, setExtras] = useState({ wides: "0", noBalls: "0", byes: "0", legByes: "0", penalty: "0" });

    // Live score state
    const [live, setLive] = useState({
        score: "", runRate: "", requiredRunRate: "", target: "",
        situation: "", battingTeam: match.team1.shortName, bowlingTeam: match.team2.shortName,
        batsmanOneName: "", batsmanOneRuns: "0", batsmanOneBalls: "0", batsmanOneFours: "0", batsmanOneSixes: "0", batsmanOneSR: "0",
        batsmanTwoName: "", batsmanTwoRuns: "0", batsmanTwoBalls: "0", batsmanTwoFours: "0", batsmanTwoSixes: "0", batsmanTwoSR: "0",
        bowlerName: "", bowlerOvers: "0", bowlerRuns: "0", bowlerWickets: "0", bowlerEco: "0",
        recentBalls: "", lastWicket: "", commentary: "",
    });

    function showToast(msg: string, type: "success" | "error") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }

    async function onInit() {
        setLoading(true);
        const res = await handleInitScorecard(matchId);
        setLoading(false);
        if (res.success) { setScorecard(res.data); showToast("Scorecard initialized!", "success"); }
        else showToast(res.message || "Failed", "error");
    }

    function loadInnings(num: number) {
        setActiveInnings(num);
        const existing = scorecard?.innings?.find((i: any) => i.inningsNumber === num);
        if (!existing) {
            setBattingTeam(num % 2 !== 0 ? match.team1.shortName : match.team2.shortName);
            setBowlingTeam(num % 2 !== 0 ? match.team2.shortName : match.team1.shortName);
            setTotalRuns("0"); setTotalWickets("0"); setTotalOvers("0");
            setBatting([emptyBatsman(), emptyBatsman(), emptyBatsman()]);
            setBowling([emptyBowler(), emptyBowler()]);
            setFow([]); setIsDeclared(false); setIsCompleted(false);
            setExtras({ wides: "0", noBalls: "0", byes: "0", legByes: "0", penalty: "0" });
            return;
        }
        setBattingTeam(existing.battingTeam);
        setBowlingTeam(existing.bowlingTeam);
        setTotalRuns(String(existing.totalRuns));
        setTotalWickets(String(existing.totalWickets));
        setTotalOvers(String(existing.totalOvers));
        setIsCompleted(existing.isCompleted);
        setIsDeclared(existing.isDeclared);
        setBatting(existing.batting.map((b: any) => ({
            name: b.name, dismissal: b.dismissal,
            runs: String(b.runs), balls: String(b.balls), fours: String(b.fours), sixes: String(b.sixes), isNotOut: b.isNotOut,
        })));
        setBowling(existing.bowling.map((b: any) => ({
            name: b.name, overs: String(b.overs), maidens: String(b.maidens),
            runs: String(b.runs), wickets: String(b.wickets), noBalls: String(b.noBalls), wides: String(b.wides),
        })));
        setFow((existing.fallOfWickets || []).map((f: any) => ({
            wicketNumber: String(f.wicketNumber), runs: String(f.runs), overs: String(f.overs), batsmanName: f.batsmanName,
        })));
        setExtras({
            wides: String(existing.extras?.wides ?? 0),
            noBalls: String(existing.extras?.noBalls ?? 0),
            byes: String(existing.extras?.byes ?? 0),
            legByes: String(existing.extras?.legByes ?? 0),
            penalty: String(existing.extras?.penalty ?? 0),
        });
    }

    async function onSaveInnings() {
        setLoading(true);
        const payload = {
            inningsNumber: activeInnings,
            battingTeam, bowlingTeam,
            totalRuns: n(totalRuns), totalWickets: n(totalWickets), totalOvers: n(totalOvers),
            isCompleted, isDeclared,
            batting: batting.filter(b => b.name).map(b => ({
                name: b.name, dismissal: b.dismissal,
                runs: n(b.runs), balls: n(b.balls), fours: n(b.fours), sixes: n(b.sixes), isNotOut: b.isNotOut,
            })),
            bowling: bowling.filter(b => b.name).map(b => ({
                name: b.name, overs: n(b.overs), maidens: n(b.maidens),
                runs: n(b.runs), wickets: n(b.wickets), noBalls: n(b.noBalls), wides: n(b.wides),
            })),
            extras: {
                wides: n(extras.wides), noBalls: n(extras.noBalls),
                byes: n(extras.byes), legByes: n(extras.legByes), penalty: n(extras.penalty),
            },
            fallOfWickets: fow.filter(f => f.batsmanName).map(f => ({
                wicketNumber: n(f.wicketNumber), runs: n(f.runs), overs: n(f.overs), batsmanName: f.batsmanName,
            })),
        };
        const res = await handleUpsertInnings(matchId, payload);
        setLoading(false);
        if (res.success) { setScorecard(res.data); showToast(`Innings ${activeInnings} saved!`, "success"); }
        else showToast(res.message || "Failed", "error");
    }

    async function onSaveLive() {
        setLoading(true);
        const payload = {
            currentInnings: activeInnings,
            battingTeam: live.battingTeam, bowlingTeam: live.bowlingTeam,
            score: live.score, runRate: live.runRate,
            requiredRunRate: live.requiredRunRate || undefined,
            target: live.target ? n(live.target) : undefined,
            situation: live.situation,
            batsmanOne: {
                name: live.batsmanOneName, runs: n(live.batsmanOneRuns), balls: n(live.batsmanOneBalls),
                fours: n(live.batsmanOneFours), sixes: n(live.batsmanOneSixes), strikeRate: n(live.batsmanOneSR),
            },
            batsmanTwo: {
                name: live.batsmanTwoName, runs: n(live.batsmanTwoRuns), balls: n(live.batsmanTwoBalls),
                fours: n(live.batsmanTwoFours), sixes: n(live.batsmanTwoSixes), strikeRate: n(live.batsmanTwoSR),
            },
            currentBowler: {
                name: live.bowlerName, overs: n(live.bowlerOvers),
                runs: n(live.bowlerRuns), wickets: n(live.bowlerWickets), economy: n(live.bowlerEco),
            },
            recentBalls: live.recentBalls ? live.recentBalls.split(",").map(b => b.trim()) : [],
            lastWicket: live.lastWicket || undefined,
            commentary: live.commentary || undefined,
        };
        const res = await handleUpdateLiveScore(matchId, payload);
        setLoading(false);
        if (res.success) showToast("Live score updated!", "success");
        else showToast(res.message || "Failed", "error");
    }

    async function onClearLive() {
        setLoading(true);
        const res = await handleClearLiveScore(matchId);
        setLoading(false);
        if (res.success) showToast("Live score cleared", "success");
        else showToast(res.message || "Failed", "error");
    }

    // ── No scorecard yet ──────────────────────────────────────────────────────
    if (!scorecard) {
        return (
            <div className="bg-white dark:bg-[#161b27] rounded-2xl border border-gray-200 dark:border-white/8 p-10 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">No scorecard yet</p>
                <p className="text-sm text-gray-400 mb-5">Initialize to start entering scores</p>
                <Button variant="green" size="md" onClick={onInit} disabled={loading}>
                    {loading ? "Initializing…" : "Initialize Scorecard"}
                </Button>
            </div>
        );
    }

    // ── Editor ────────────────────────────────────────────────────────────────
    return (
        <div>
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
                {(["innings", "live"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors capitalize ${
                            activeTab === tab
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 text-gray-500 hover:border-gray-300"
                        }`}>
                        {tab === "innings" ? "📊 Innings Scorecard" : "🟢 Live Score"}
                    </button>
                ))}
            </div>

            {/* ── INNINGS TAB ──────────────────────────────────────────────── */}
            {activeTab === "innings" && (
                <div className="space-y-5">

                    {/* Innings selector */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => loadInnings(num)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                    activeInnings === num
                                        ? "bg-blue-600 text-white"
                                        : "bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/8 text-gray-500"
                                }`}>
                                Innings {num}
                                {scorecard?.innings?.some((i: any) => i.inningsNumber === num) && " ✓"}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 p-5 space-y-5">

                        {/* Teams & totals */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Input label="Batting Team" value={battingTeam} onChange={setBattingTeam} />
                            <Input label="Bowling Team" value={bowlingTeam} onChange={setBowlingTeam} />
                            <Input label="Total Runs" value={totalRuns} onChange={setTotalRuns} type="number" />
                            <Input label="Wickets" value={totalWickets} onChange={setTotalWickets} type="number" />
                            <Input label="Total Overs" value={totalOvers} onChange={setTotalOvers} />
                            <div className="flex items-end gap-4 col-span-2">
                                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <input type="checkbox" checked={isCompleted} onChange={e => setIsCompleted(e.target.checked)} className="rounded" />
                                    Innings Completed
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <input type="checkbox" checked={isDeclared} onChange={e => setIsDeclared(e.target.checked)} className="rounded" />
                                    Declared
                                </label>
                            </div>
                        </div>

                        {/* Extras */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Extras</p>
                            <div className="grid grid-cols-5 gap-2">
                                {(["wides", "noBalls", "byes", "legByes", "penalty"] as const).map(k => (
                                    <Input key={k}
                                        label={k === "noBalls" ? "No Balls" : k === "legByes" ? "Leg Byes" : k.charAt(0).toUpperCase() + k.slice(1)}
                                        value={extras[k]}
                                        onChange={(v: string) => setExtras(p => ({ ...p, [k]: v }))}
                                        type="number"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Batting */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Batting</p>
                                <Button variant="outline" onClick={() => setBatting(p => [...p, emptyBatsman()])}>+ Add Batsman</Button>
                            </div>
                            <div className="space-y-2">
                                {batting.map((b, i) => (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-8 gap-2 items-end bg-gray-50 dark:bg-white/3 rounded-lg p-2">
                                        <div className="sm:col-span-2">
                                            <Input placeholder="Name" value={b.name}
                                                onChange={(v: string) => setBatting(p => p.map((r, j) => j === i ? { ...r, name: v } : r))} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Input placeholder="Dismissal" value={b.dismissal}
                                                onChange={(v: string) => setBatting(p => p.map((r, j) => j === i ? { ...r, dismissal: v } : r))} />
                                        </div>
                                        {(["runs", "balls", "fours", "sixes"] as const).map(field => (
                                            <Input key={field} placeholder={field.charAt(0).toUpperCase()} value={b[field]} type="number"
                                                onChange={(v: string) => setBatting(p => p.map((r, j) => j === i ? { ...r, [field]: v } : r))} />
                                        ))}
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" checked={b.isNotOut}
                                                    onChange={e => setBatting(p => p.map((r, j) => j === i ? { ...r, isNotOut: e.target.checked } : r))} />
                                                NO
                                            </label>
                                            <button onClick={() => setBatting(p => p.filter((_, j) => j !== i))}
                                                className="text-red-500 hover:text-red-700 text-xs font-bold ml-auto">✕</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bowling */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bowling</p>
                                <Button variant="outline" onClick={() => setBowling(p => [...p, emptyBowler()])}>+ Add Bowler</Button>
                            </div>
                            <div className="space-y-2">
                                {bowling.map((b, i) => (
                                    <div key={i} className="grid grid-cols-2 sm:grid-cols-8 gap-2 items-end bg-gray-50 dark:bg-white/3 rounded-lg p-2">
                                        <div className="sm:col-span-2">
                                            <Input placeholder="Name" value={b.name}
                                                onChange={(v: string) => setBowling(p => p.map((r, j) => j === i ? { ...r, name: v } : r))} />
                                        </div>
                                        {(["overs", "maidens", "runs", "wickets", "noBalls", "wides"] as const).map(field => (
                                            <Input key={field} type="number" value={b[field]}
                                                placeholder={field === "maidens" ? "M" : field === "wickets" ? "W" : field === "noBalls" ? "NB" : field === "wides" ? "WD" : field.charAt(0).toUpperCase()}
                                                onChange={(v: string) => setBowling(p => p.map((r, j) => j === i ? { ...r, [field]: v } : r))} />
                                        ))}
                                        <button onClick={() => setBowling(p => p.filter((_, j) => j !== i))}
                                            className="text-red-500 hover:text-red-700 text-xs font-bold">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fall of Wickets */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fall of Wickets</p>
                                <Button variant="outline" onClick={() => setFow(p => [...p, emptyFow()])}>+ Add</Button>
                            </div>
                            {fow.length > 0 && (
                                <div className="space-y-2">
                                    {fow.map((f, i) => (
                                        <div key={i} className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-end bg-gray-50 dark:bg-white/3 rounded-lg p-2">
                                            <Input placeholder="Wicket #" value={f.wicketNumber} type="number"
                                                onChange={(v: string) => setFow(p => p.map((r, j) => j === i ? { ...r, wicketNumber: v } : r))} />
                                            <Input placeholder="At Runs" value={f.runs} type="number"
                                                onChange={(v: string) => setFow(p => p.map((r, j) => j === i ? { ...r, runs: v } : r))} />
                                            <Input placeholder="At Overs" value={f.overs}
                                                onChange={(v: string) => setFow(p => p.map((r, j) => j === i ? { ...r, overs: v } : r))} />
                                            <Input placeholder="Batsman" value={f.batsmanName}
                                                onChange={(v: string) => setFow(p => p.map((r, j) => j === i ? { ...r, batsmanName: v } : r))} />
                                            <button onClick={() => setFow(p => p.filter((_, j) => j !== i))}
                                                className="text-red-500 text-xs font-bold">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button variant="green" size="md" onClick={onSaveInnings} disabled={loading}>
                            {loading ? "Saving…" : `💾 Save Innings ${activeInnings}`}
                        </Button>
                    </div>
                </div>
            )}

            {/* ── LIVE TAB ─────────────────────────────────────────────────── */}
            {activeTab === "live" && (
                <div className="bg-white dark:bg-[#161b27] rounded-xl border border-gray-200 dark:border-white/8 p-5 space-y-5">
                    <p className="text-xs text-gray-400">
                        Update this to show real-time score on the public match page. This is what fans see in the Live Score widget.
                    </p>

                    {/* Score row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <Input label='Score (e.g. "IND 145/3 (18.2)")' value={live.score} onChange={(v: string) => setLive(p => ({ ...p, score: v }))} />
                        <Input label='CRR (e.g. "7.94")' value={live.runRate} onChange={(v: string) => setLive(p => ({ ...p, runRate: v }))} />
                        <Input label="RRR (optional)" value={live.requiredRunRate} onChange={(v: string) => setLive(p => ({ ...p, requiredRunRate: v }))} />
                        <Input label="Target (optional)" value={live.target} type="number" onChange={(v: string) => setLive(p => ({ ...p, target: v }))} />
                        <Input label="Batting Team" value={live.battingTeam} onChange={(v: string) => setLive(p => ({ ...p, battingTeam: v }))} />
                        <Input label="Bowling Team" value={live.bowlingTeam} onChange={(v: string) => setLive(p => ({ ...p, bowlingTeam: v }))} />
                    </div>

                    <Input label='Situation (e.g. "India needs 45 runs in 32 balls")' value={live.situation}
                        onChange={(v: string) => setLive(p => ({ ...p, situation: v }))} />

                    {/* Striker */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">⚡ Striker</p>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            <div className="sm:col-span-2">
                                <Input placeholder="Name" value={live.batsmanOneName} onChange={(v: string) => setLive(p => ({ ...p, batsmanOneName: v }))} />
                            </div>
                            {(["batsmanOneRuns", "batsmanOneBalls", "batsmanOneFours", "batsmanOneSixes", "batsmanOneSR"] as const).map(k => (
                                <Input key={k} placeholder={k.replace("batsmanOne", "")} value={live[k]} type="number"
                                    onChange={(v: string) => setLive(p => ({ ...p, [k]: v }))} />
                            ))}
                        </div>
                    </div>

                    {/* Non-Striker */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Non-Striker</p>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            <div className="sm:col-span-2">
                                <Input placeholder="Name" value={live.batsmanTwoName} onChange={(v: string) => setLive(p => ({ ...p, batsmanTwoName: v }))} />
                            </div>
                            {(["batsmanTwoRuns", "batsmanTwoBalls", "batsmanTwoFours", "batsmanTwoSixes", "batsmanTwoSR"] as const).map(k => (
                                <Input key={k} placeholder={k.replace("batsmanTwo", "")} value={live[k]} type="number"
                                    onChange={(v: string) => setLive(p => ({ ...p, [k]: v }))} />
                            ))}
                        </div>
                    </div>

                    {/* Current Bowler */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">🎳 Current Bowler</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            <div className="sm:col-span-1">
                                <Input placeholder="Name" value={live.bowlerName} onChange={(v: string) => setLive(p => ({ ...p, bowlerName: v }))} />
                            </div>
                            {(["bowlerOvers", "bowlerRuns", "bowlerWickets", "bowlerEco"] as const).map(k => (
                                <Input key={k} placeholder={k.replace("bowler", "")} value={live[k]} type="number"
                                    onChange={(v: string) => setLive(p => ({ ...p, [k]: v }))} />
                            ))}
                        </div>
                    </div>

                    <Input label='Recent Balls (comma-separated e.g. "0,1,W,4,6,1")' value={live.recentBalls}
                        placeholder="0,1,W,4,6,1" onChange={(v: string) => setLive(p => ({ ...p, recentBalls: v }))} />

                    <Input label="Last Wicket" value={live.lastWicket}
                        placeholder="Rohit Sharma b Cummins 45(32)" onChange={(v: string) => setLive(p => ({ ...p, lastWicket: v }))} />

                    <Input label="Commentary" value={live.commentary}
                        placeholder="SIX! Kohli hits it over long-on!" onChange={(v: string) => setLive(p => ({ ...p, commentary: v }))} />

                    <div className="flex gap-3">
                        <Button variant="green" size="md" onClick={onSaveLive} disabled={loading}>
                            {loading ? "Saving…" : "🟢 Update Live Score"}
                        </Button>
                        <Button variant="danger" size="md" onClick={onClearLive} disabled={loading}>
                            Clear Live Score
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}