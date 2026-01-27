import Link from 'next/link';
import { getPiece, getPieces } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const prose = getPieces('hindi/prose');
    return prose.map((piece) => ({
        slug: piece.slug,
    }));
}

export default async function HindiProsePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const piece = getPiece('hindi/prose', slug);

    if (!piece) {
        notFound();
    }

    return (
        <main className="container-custom min-h-screen">
            <Link href="/hindi/prose" className="breadcrumb">
                ← ayush.writes
            </Link>

            <article>
                <h1>{piece.title}</h1>

                {piece.context && (
                    <p className="context-note">Context - {piece.context}</p>
                )}

                <div className="poem-content">
                    {piece.content}
                </div>

                {piece.date && (
                    <p className="text-sm text-gray-500 mt-8">
                        {piece.date.includes('/') ? piece.date : new Date(piece.date).toLocaleDateString('en-IN')}
                    </p>
                )}
            </article>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
