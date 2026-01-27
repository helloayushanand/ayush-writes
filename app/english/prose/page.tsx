import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function EnglishProsePage() {
    const prose = getPieces('english/prose');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="breadcrumb">
                ← ayush.writes
            </Link>

            <h1>Prose</h1>
            <p className="category-desc mb-8">
                more to be added..
            </p>

            <div className="index-list">
                {prose.map((piece) => (
                    <Link
                        key={piece.slug}
                        href={`/english/prose/${piece.slug}`}
                        className="index-item block"
                    >
                        <span className="mr-2">📄</span>{piece.title}
                    </Link>
                ))}
            </div>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
