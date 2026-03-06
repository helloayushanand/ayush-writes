import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function BlogsPage() {
    const posts = getPieces('blogs');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="breadcrumb">
                ← ayush.writes
            </Link>

            <h1>Blogs</h1>
            <p className="category-desc mb-8">
                Occasional reflections.
            </p>

            <div className="index-list">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blogs/${post.slug}`}
                        className="index-item block"
                    >
                        <span className="mr-2">📄</span>{post.title}
                    </Link>
                ))}
                {posts.length > 0 && (
                    <p className="text-sm text-gray-500 mt-4">and many more …</p>
                )}
            </div>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
