import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function HindiPoetryPage() {
    const poems = getPieces('hindi/poetry');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="breadcrumb">
                ← ayush.writes
            </Link>

            <h1>काव्य</h1>
            <p className="category-desc mb-8">
                चंद कवितायेँ मेरी डायरी से। वर्तनी दोष आपको मिल जाएंगे लगभग हर कृति में, उसके लिए क्षमा प्रार्थी हूँ। उन्हें सुधारने का काम अभी बाकी है।
            </p>

            <div className="index-list">
                {poems.map((poem) => (
                    <Link
                        key={poem.slug}
                        href={`/hindi/poetry/${poem.slug}`}
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
