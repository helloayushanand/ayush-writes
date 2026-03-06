import Link from 'next/link';
import { getPieces } from '@/lib/content';

export default function HindiProsePage() {
    const prose = getPieces('hindi/prose');

    return (
        <main className="container-custom min-h-screen">
            <Link href="/" className="breadcrumb">
                ← ayush.writes
            </Link>

            <h1>गद्य</h1>
            <p className="category-desc mb-8">
                वर्तनी दोष आपको मिल जाएंगे लगभग हर कृति में, उसके लिए क्षमा प्रार्थी हूँ। उन्हें सुधारने का काम अभी बाकी है।
            </p>

            <div className="index-list">
                {prose.map((piece) => (
                    <Link
                        key={piece.slug}
                        href={`/hindi/prose/${piece.slug}`}
                        className="index-item block"
                    >
                        <span className="mr-2">🌊</span>{piece.title}
                    </Link>
                ))}
            </div>

            <footer>
                © Ayush
            </footer>
        </main>
    );
}
