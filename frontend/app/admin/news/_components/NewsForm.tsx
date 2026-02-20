'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAdminCreateNews, handleAdminUpdateNews } from '@/lib/actions/admin/news-action';

const CATEGORIES = [
  { value: 'top_stories',   label: 'Top Stories'   },
  { value: 'international', label: 'International'  },
  { value: 'ipl',           label: 'IPL'            },
  { value: 'npl',           label: 'NPL'            },
  { value: 'domestic',      label: 'Domestic'       },
];

const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-colors';
const textareaClass = inputClass + ' resize-none';

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

interface NewsFormProps {
  article?: any; // existing article when editing
}

export default function NewsForm({ article }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!article;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title:      article?.title      || '',
    summary:    article?.summary    || '',
    content:    article?.content    || '',
    coverImage: article?.coverImage || '',
    category:   article?.category   || 'top_stories',
    author:     article?.author     || 'SoftBuzz Staff',
    status:     article?.status     || 'draft',
    isBreaking: article?.isBreaking ?? false,
    isFeatured: article?.isFeatured ?? false,
    tags:       article?.tags?.join(', ') || '',
  });

  const set = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      title:      form.title.trim(),
      summary:    form.summary.trim(),
      content:    form.content.trim(),
      coverImage: form.coverImage.trim(),
      category:   form.category,
      author:     form.author.trim() || 'SoftBuzz Staff',
      status:     publishNow ? 'published' : form.status,
      isBreaking: form.isBreaking,
      isFeatured: form.isFeatured,
      tags:       form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };

    const res = isEdit
      ? await handleAdminUpdateNews(article._id, payload)
      : await handleAdminCreateNews(payload);

    setLoading(false);

    if (res.success) {
      setSuccess(isEdit ? 'Article updated!' : 'Article created!');
      setTimeout(() => router.push('/admin/news'), 800);
    } else {
      setError(res.message || 'Something went wrong');
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

      {/* Core Info */}
      <Section title="Article Info">
        <div className="space-y-4">
          <Field label="Title" required>
            <input
              name="title" value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. India beats Australia in thrilling final over"
              className={inputClass} required
            />
          </Field>

          <Field label="Summary" required>
            <textarea
              name="summary" value={form.summary}
              onChange={e => set('summary', e.target.value)}
              placeholder="Short description shown on news cards (1-2 sentences)"
              rows={2} className={textareaClass} required
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select name="category" value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Author">
              <input
                name="author" value={form.author}
                onChange={e => set('author', e.target.value)}
                placeholder="SoftBuzz Staff"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Cover Image URL">
            <input
              name="coverImage" value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </Field>

          {form.coverImage && (
            <img
              src={form.coverImage} alt="preview"
              className="h-40 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>
      </Section>

      {/* Content */}
      <Section title="Article Content">
        <Field label="Full Content" required>
          <textarea
            name="content" value={form.content}
            onChange={e => set('content', e.target.value)}
            placeholder="Write the full article here. Use blank lines to separate paragraphs."
            rows={16} className={textareaClass} required
          />
        </Field>
        <p className="text-xs text-gray-400 mt-1">
          ~{Math.max(1, Math.ceil(form.content.trim().split(/\s+/).length / 200))} min read · {form.content.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </Section>

      {/* Tags & Options */}
      <Section title="Tags & Options">
        <div className="space-y-4">
          <Field label="Tags (comma separated)">
            <input
              name="tags" value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="e.g. India, Rohit Sharma, T20"
              className={inputClass}
            />
          </Field>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isBreaking}
                onChange={e => set('isBreaking', e.target.checked)}
                className="w-4 h-4 accent-red-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                🔴 Breaking News
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured}
                onChange={e => set('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-gray-900 dark:accent-white" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                ⭐ Featured Article
              </span>
            </label>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end pt-2">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>

        {/* Save as Draft */}
        <button type="submit" disabled={loading}
          onClick={e => { set('status', 'draft'); handleSubmit(e, false); }}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60">
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>

        {/* Publish */}
        <button type="button" disabled={loading}
          onClick={e => handleSubmit(e as any, true)}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-60">
          {loading ? 'Publishing...' : '🚀 Publish'}
        </button>
      </div>
    </form>
  );
}
