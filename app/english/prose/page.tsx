import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function EnglishProsePage() {
    const prose = getPieces('english/prose');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="text-sm text-gray-600 hover:text-black mb-8 inline-block">
                ← ayush.writes
            </Link>

            <h1>Prose</h1>
            <p className="text-gray-600 mb-8">
                English prose pieces
            </p>

            <div className="space-y-2">
                {prose.length === 0 ? (
                    <p className="text-sm text-gray-500">Coming soon...</p>
                ) : (
                    <>
                        {prose.map((piece) => (
                            <Link
                                key={piece.slug}
                                href={`/english/prose/${piece.slug}`}
                                className="link-card"
                            >
                                {piece.title}
                            </Link>
                        ))}
                        <p className="text-sm text-gray-500 mt-4">and many more …</p>
                    </>
                )}
            </div>

            <footer className="mt-16 text-center text-sm text-gray-500">
                © Ayush
            </footer>
        </main>
    );
}
