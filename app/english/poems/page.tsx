import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function EnglishPoemsPage() {
    const poems = getPieces('english/poems');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="text-sm text-gray-600 hover:text-black mb-8 inline-block">
                ← ayush.writes
            </Link>

            <h1>Poems</h1>
            <p className="text-gray-600 mb-8">
                English poetry
            </p>

            <div className="space-y-2">
                {poems.length === 0 ? (
                    <p className="text-sm text-gray-500">Coming soon...</p>
                ) : (
                    <>
                        {poems.map((poem) => (
                            <Link
                                key={poem.slug}
                                href={`/english/poems/${poem.slug}`}
                                className="link-card"
                            >
                                {poem.title}
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
