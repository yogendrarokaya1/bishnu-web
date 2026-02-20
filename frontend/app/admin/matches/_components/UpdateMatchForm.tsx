"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateMatch } from "@/lib/actions/admin/match-action";

const FORMATS = ["T20", "ODI", "TEST", "T10", "THE_HUNDRED"];
const MATCH_TYPES = ["international", "domestic", "league", "tour_match"];
const STATUSES = ["upcoming", "live", "completed", "abandoned", "rain_delay"];

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                {title}
            </h3>
            {children}
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

export default function UpdateMatchForm({ match }: { match: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        seriesName: match.seriesName || "",
        matchNumber: match.matchNumber || "",
        matchType: match.matchType || "international",
        format: match.format || "ODI",
        status: match.status || "upcoming",
        team1Name: match.team1?.name || "",
        team1Short: match.team1?.shortName || "",
        team2Name: match.team2?.name || "",
        team2Short: match.team2?.shortName || "",
        stadiumName: match.venue?.stadiumName || "",
        city: match.venue?.city || "",
        country: match.venue?.country || "",
        scheduledDate: match.scheduledDate ? new Date(match.scheduledDate).toISOString().slice(0, 16) : "",
        scheduledTime: match.scheduledTime || "",
        result: match.result || "",
        liveStatus: match.liveStatus || "",
        isInternational: match.isInternational ?? true,
        isFeatured: match.isFeatured ?? false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const payload = {
            seriesName: form.seriesName,
            matchNumber: form.matchNumber,
            matchType: form.matchType,
            format: form.format,
            status: form.status,
            team1: { name: form.team1Name, shortName: form.team1Short.toUpperCase() },
            team2: { name: form.team2Name, shortName: form.team2Short.toUpperCase() },
            venue: { stadiumName: form.stadiumName, city: form.city, country: form.country },
            scheduledDate: form.scheduledDate,
            scheduledTime: form.scheduledTime,
            result: form.result || undefined,
            liveStatus: form.liveStatus || undefined,
            isInternational: form.isInternational,
            isFeatured: form.isFeatured,
        };

        const response = await handleUpdateMatch(match._id, payload);
        setLoading(false);

        if (response.success) {
            setSuccess("Match updated successfully!");
            setTimeout(() => router.push("/admin/matches"), 1000);
        } else {
            setError(response.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
                    {success}
                </div>
            )}

            <Section title="Series Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Series Name" required>
                        <input name="seriesName" value={form.seriesName} onChange={handleChange} className={inputClass} required />
                    </Field>
                    <Field label="Match Number" required>
                        <input name="matchNumber" value={form.matchNumber} onChange={handleChange} className={inputClass} required />
                    </Field>
                    <Field label="Match Type" required>
                        <select name="matchType" value={form.matchType} onChange={handleChange} className={inputClass}>
                            {MATCH_TYPES.map(t => (
                                <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Format" required>
                        <select name="format" value={form.format} onChange={handleChange} className={inputClass}>
                            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </Field>
                    <Field label="Status" required>
                        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                            ))}
                        </select>
                    </Field>
                </div>
            </Section>

            <Section title="Teams">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team 1</p>
                        <Field label="Full Name" required>
                            <input name="team1Name" value={form.team1Name} onChange={handleChange} className={inputClass} required />
                        </Field>
                        <Field label="Short Name" required>
                            <input name="team1Short" value={form.team1Short} onChange={handleChange} maxLength={6} className={inputClass} required />
                        </Field>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team 2</p>
                        <Field label="Full Name" required>
                            <input name="team2Name" value={form.team2Name} onChange={handleChange} className={inputClass} required />
                        </Field>
                        <Field label="Short Name" required>
                            <input name="team2Short" value={form.team2Short} onChange={handleChange} maxLength={6} className={inputClass} required />
                        </Field>
                    </div>
                </div>
            </Section>

            <Section title="Venue">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Stadium Name" required>
                        <input name="stadiumName" value={form.stadiumName} onChange={handleChange} className={inputClass} required />
                    </Field>
                    <Field label="City" required>
                        <input name="city" value={form.city} onChange={handleChange} className={inputClass} required />
                    </Field>
                    <Field label="Country" required>
                        <input name="country" value={form.country} onChange={handleChange} className={inputClass} required />
                    </Field>
                </div>
            </Section>

            <Section title="Schedule">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Date" required>
                        <input type="datetime-local" name="scheduledDate" value={form.scheduledDate}
                            onChange={handleChange} className={inputClass} required />
                    </Field>
                    <Field label="Display Time (UTC)" required>
                        <input name="scheduledTime" value={form.scheduledTime} onChange={handleChange}
                            className={inputClass} required />
                    </Field>
                </div>
            </Section>

            <Section title="Match Updates">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Live Status">
                        <input name="liveStatus" value={form.liveStatus} onChange={handleChange}
                            placeholder="e.g. IND needs 45 runs in 32 balls" className={inputClass} />
                    </Field>
                    <Field label="Result">
                        <input name="result" value={form.result} onChange={handleChange}
                            placeholder="e.g. India won by 5 wickets" className={inputClass} />
                    </Field>
                </div>
            </Section>

            <Section title="Options">
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isInternational" checked={form.isInternational}
                            onChange={handleChange} className="w-4 h-4 accent-gray-900 dark:accent-white" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">International Match</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isFeatured" checked={form.isFeatured}
                            onChange={handleChange} className="w-4 h-4 accent-gray-900 dark:accent-white" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Featured on Homepage</span>
                    </label>
                </div>
            </Section>

            <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => router.back()}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-60">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}