import CreateMatchForm from "../_components/CreateMatchForm";

export default function CreateMatchPage() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Match</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule a new cricket match</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <CreateMatchForm />
            </div>
        </div>
    );
}