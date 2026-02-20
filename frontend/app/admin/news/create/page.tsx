import NewsForm from '../_components/NewsForm';

export default function CreateNewsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Write Article</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new news article</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <NewsForm />
      </div>
    </div>
  );
}
