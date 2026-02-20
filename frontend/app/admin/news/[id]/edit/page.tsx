import { handleAdminGetOneNews } from '@/lib/actions/admin/news-action';
import NewsForm from '../../_components/NewsForm';
import { notFound } from 'next/navigation';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await handleAdminGetOneNews(id);

  if (!response.success || !response.data) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Article</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{response.data.title}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <NewsForm article={response.data} />
      </div>
    </div>
  );
}
