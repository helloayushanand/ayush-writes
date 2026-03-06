import Link from 'next/link';
import { getPiece, getPieces } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const posts = getPieces('blogs');
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = getPiece('blogs', slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="container-custom min-h-screen">
            <Link href="/blogs" className="breadcrumb">
                ← ayush.writes
            </Link>

            <article>
                <h1>{post.title}</h1>

                {post.context && (
                    <p className="context-note">Context - {post.context}</p>
                )}

                <div className="poem-content">
                    {post.content}
                </div>

                {post.date && (
                    <p className="text-sm text-gray-500 mt-8">
                        {post.date.includes('/') ? post.date : new Date(post.date).toLocaleDateString('en-IN')}
                    </p>
                )}
            </article>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
