import Link from 'next/link';
import { getPiece, getPieces } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const poems = getPieces('english/poems');
    return poems.map((poem) => ({
        slug: poem.slug,
    }));
}

export default async function EnglishPoemPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const poem = getPiece('english/poems', slug);

    if (!poem) {
        notFound();
    }

    return (
        <main className="container-custom min-h-screen">
            <Link href="/english/poems" className="breadcrumb">
                ← ayush.writes
            </Link>

            <article>
                <h1>{poem.title}</h1>

                {poem.context && (
                    <p className="context-note">Context - {poem.context}</p>
                )}

                <div className="poem-content">
                    {poem.content}
                </div>

                {poem.date && (
                    <p className="text-sm text-gray-500 mt-8">
                        {poem.date.includes('/') ? poem.date : new Date(poem.date).toLocaleDateString('en-IN')}
                    </p>
                )}
            </article>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
