import { handleGetOneMatch } from "@/lib/actions/admin/match-action";
import UpdateMatchForm from "../../_components/UpdateMatchForm";
import { notFound } from "next/navigation";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await handleGetOneMatch(id);

    if (!response.success || !response.data) notFound();

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Match</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {response.data.team1?.shortName} vs {response.data.team2?.shortName} — {response.data.seriesName}
                </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <UpdateMatchForm match={response.data} />
            </div>
        </div>
    );
}