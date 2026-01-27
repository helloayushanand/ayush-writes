import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function EnglishPoemsPage() {
    const poems = getPieces('english/poems');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="breadcrumb">
                ← ayush.writes
            </Link>

            <h1>Poems</h1>


            <div className="index-list">
                {poems.map((poem) => (
                    <Link
                        key={poem.slug}
                        href={`/english/poems/${poem.slug}`}
                        className="index-item block"
                    >
                        <span className="mr-2">📄</span>{poem.title}
                    </Link>
                ))}
                {poems.length > 0 && (
                    <p className="text-sm text-gray-500 mt-4">and many more …</p>
                )}
            </div>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
