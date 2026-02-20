import { handleGetOneMatch } from "@/lib/actions/admin/match-action";
import { handleGetScorecard } from "@/lib/actions/scorecard-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScorecardEditor from "../_components/ScorecardEditor";
export default async function AdminScorecardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [matchRes, scorecardRes] = await Promise.all([
    handleGetOneMatch(id),
    handleGetScorecard(id),
  ]);

  if (!matchRes.success || !matchRes.data) notFound();

  const match = matchRes.data;
  const scorecard = scorecardRes.success ? scorecardRes.data : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/matches" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            ← Matches
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {match.team1.shortName} vs {match.team2.shortName} · Scorecard
          </span>
        </div>

        {/* Match Info Header */}
        <div className="bg-white dark:bg-[#161b27] rounded-2xl border border-gray-200 dark:border-white/8 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-gray-900 dark:text-white">
                {match.team1.name} vs {match.team2.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {match.seriesName} · {match.format} · <span className="capitalize">{match.status}</span>
              </p>
            </div>
            <Link
              href={`/matches/${id}`}
              target="_blank"
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Public →
            </Link>
          </div>
        </div>

        {/* Scorecard Editor */}
        <ScorecardEditor matchId={id} match={match} scorecard={scorecard} />

      </div>
    </div>
  );
}