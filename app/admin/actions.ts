'use server';

import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';
import { getPieces, getPiece, type Piece } from '@/lib/content';

const COOKIE_NAME = 'admin-session';

function getExpectedToken(): string {
  const username = process.env.ADMIN_USERNAME || '';
  const password = process.env.ADMIN_PASSWORD || '';
  return createHash('sha256')
    .update(`${username}:${password}:ayush-writes-salt`)
    .digest('hex');
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean }> {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envUsername || !envPassword) return { success: false };

  if (username === envUsername && password === envPassword) {
    const token = getExpectedToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return { success: true };
  }

  return { success: false };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const expected = getExpectedToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function publish(data: {
  category: string;
  slug: string;
  title: string;
  date: string;
  context?: string;
  content: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: 'Not authenticated' };
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return { success: false, error: 'GitHub configuration missing' };
  }

  const validCategories = [
    'hindi/poetry',
    'hindi/prose',
    'english/poems',
    'english/prose',
    'blogs',
  ];
  if (!validCategories.includes(data.category)) {
    return { success: false, error: 'Invalid category' };
  }

  const safeSlug = data.slug.replace(/[^a-z0-9-]/g, '');
  if (!safeSlug) {
    return { success: false, error: 'Invalid slug' };
  }

  const frontmatterLines = [
    '---',
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    `date: "${data.date}"`,
    `slug: "${safeSlug}"`,
  ];
  if (data.context) {
    frontmatterLines.push(`context: "${data.context.replace(/"/g, '\\"')}"`);
  }
  frontmatterLines.push('---');

  const fileContent =
    frontmatterLines.join('\n') + '\n\n' + data.content.trim() + '\n';
  const filePath = `content/${data.category}/${safeSlug}.md`;

  let sha: string | undefined;
  const checkRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (checkRes.ok) {
    const existing = await checkRes.json();
    sha = existing.sha;
  }

  const body: Record<string, string> = {
    message: sha ? `update: ${data.title}` : `publish: ${data.title}`,
    content: Buffer.from(fileContent).toString('base64'),
    branch: 'main',
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return { success: false, error: err.message || 'GitHub API error' };
  }

  return { success: true };
}

export async function deletePost(
  category: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: 'Not authenticated' };
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return { success: false, error: 'GitHub configuration missing' };
  }

  const filePath = `content/${category}/${slug}.md`;

  const checkRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!checkRes.ok) {
    return { success: false, error: 'Post not found' };
  }

  const existing = await checkRes.json();

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `delete: ${slug}`,
        sha: existing.sha,
        branch: 'main',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return { success: false, error: err.message || 'GitHub API error' };
  }

  return { success: true };
}

export async function getPublished(): Promise<
  { category: string; label: string; pieces: { slug: string; title: string; date: string }[] }[]
> {
  if (!(await isAuthenticated())) return [];

  const categories = [
    { value: 'blogs' as const, label: 'Blogs' },
    { value: 'hindi/poetry' as const, label: 'Hindi — काव्य' },
    { value: 'hindi/prose' as const, label: 'Hindi — गद्य' },
    { value: 'english/poems' as const, label: 'English — Poems' },
    { value: 'english/prose' as const, label: 'English — Prose' },
  ];

  return categories.map((cat) => ({
    category: cat.value,
    label: cat.label,
    pieces: getPieces(cat.value).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
    })),
  }));
}

export async function getPublishedPiece(
  category: string,
  slug: string
): Promise<Piece | null> {
  if (!(await isAuthenticated())) return null;
  return getPiece(category, slug);
}
