'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { publish, logout } from '../actions';

interface Draft {
  id: string;
  category: string;
  title: string;
  slug: string;
  date: string;
  context: string;
  content: string;
  updatedAt: number;
}

const CATEGORIES = [
  { value: 'blogs', label: 'Blogs' },
  { value: 'hindi/poetry', label: 'Hindi — काव्य' },
  { value: 'hindi/prose', label: 'Hindi — गद्य' },
  { value: 'english/poems', label: 'English — Poems' },
  { value: 'english/prose', label: 'English — Prose' },
];

const STORAGE_KEY = 'ayush-writes-drafts';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function loadDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function persistDrafts(drafts: Draft[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {}
}

export default function Editor() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const [category, setCategory] = useState('blogs');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [context, setContext] = useState('');
  const [content, setContent] = useState('');
  const [slugManual, setSlugManual] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setDrafts(loadDrafts());
  }, []);

  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  // Ctrl+S to save draft
  const saveDraftRef = useRef<() => void>(() => {});

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveDraftRef.current();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function clearForm() {
    setActiveDraftId(null);
    setCategory('blogs');
    setTitle('');
    setSlug('');
    setDate(new Date().toISOString().split('T')[0]);
    setContext('');
    setContent('');
    setSlugManual(false);
    setMessage(null);
  }

  function handleSaveDraft() {
    const now = Date.now();
    let updated: Draft[];

    if (activeDraftId) {
      updated = drafts.map((d) =>
        d.id === activeDraftId
          ? { ...d, category, title, slug, date, context, content, updatedAt: now }
          : d
      );
    } else {
      const newDraft: Draft = {
        id: generateId(),
        category,
        title,
        slug,
        date,
        context,
        content,
        updatedAt: now,
      };
      updated = [newDraft, ...drafts];
      setActiveDraftId(newDraft.id);
    }

    setDrafts(updated);
    persistDrafts(updated);
    setMessage({ type: 'success', text: 'Draft saved' });
  }

  // Keep the ref in sync
  saveDraftRef.current = handleSaveDraft;

  function handleLoadDraft(draft: Draft) {
    setActiveDraftId(draft.id);
    setCategory(draft.category);
    setTitle(draft.title);
    setSlug(draft.slug);
    setDate(draft.date);
    setContext(draft.context);
    setContent(draft.content);
    setSlugManual(true);
    setMessage(null);
  }

  function handleDeleteDraft(id: string) {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    persistDrafts(updated);
    if (activeDraftId === id) {
      clearForm();
    }
  }

  async function handlePublish() {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Title, slug, and content are required' });
      return;
    }

    setPublishing(true);
    setMessage(null);

    const result = await publish({
      category,
      slug: slug.trim(),
      title: title.trim(),
      date,
      context: context.trim() || undefined,
      content: content.trim(),
    });

    if (result.success) {
      if (activeDraftId) {
        const updated = drafts.filter((d) => d.id !== activeDraftId);
        setDrafts(updated);
        persistDrafts(updated);
      }
      clearForm();
      setMessage({
        type: 'success',
        text: 'Published! Site will redeploy in ~30s.',
      });
    } else {
      setMessage({ type: 'error', text: result.error || 'Publish failed' });
    }

    setPublishing(false);
  }

  async function handleLogout() {
    await logout();
    router.push('/admin');
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <span className="admin-logo">
          ayush.writes <span className="admin-badge">admin</span>
        </span>
        <button onClick={handleLogout} className="admin-btn-ghost">
          Logout
        </button>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Drafts</h2>
            <button onClick={clearForm} className="admin-btn-small">
              + New
            </button>
          </div>
          {drafts.length === 0 ? (
            <p className="admin-muted">No drafts yet</p>
          ) : (
            <ul className="admin-draft-list">
              {drafts.map((draft) => (
                <li
                  key={draft.id}
                  className={`admin-draft-item ${activeDraftId === draft.id ? 'active' : ''}`}
                >
                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="admin-draft-btn"
                  >
                    <span className="admin-draft-title">
                      {draft.title || 'Untitled'}
                    </span>
                    <span className="admin-draft-meta">
                      {CATEGORIES.find((c) => c.value === draft.category)?.label}
                      {' · '}
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="admin-draft-delete"
                    title="Delete draft"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="admin-editor">
          <div className="admin-fields">
            <div className="admin-field">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
              />
            </div>
            <div className="admin-field">
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                }}
                placeholder="url-friendly-slug"
              />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>
                  Context <span className="admin-optional">(optional)</span>
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Brief context note..."
                />
              </div>
            </div>
          </div>

          <div className="admin-field admin-content-field">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
            />
          </div>

          {message && (
            <p className={`admin-message ${message.type}`}>{message.text}</p>
          )}

          <div className="admin-actions">
            <button onClick={handleSaveDraft} className="admin-btn-secondary">
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="admin-btn-primary"
              disabled={publishing}
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
