import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Piece {
    slug: string;
    title: string;
    date: string;
    context?: string;
    content: string;
}

export function getPieces(category: 'hindi/poetry' | 'hindi/prose' | 'english/poems' | 'english/prose'): Piece[] {
    const contentDir = path.join(process.cwd(), 'content', category);

    if (!fs.existsSync(contentDir)) {
        return [];
    }

    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

    const pieces = files.map(filename => {
        const slug = filename.replace('.md', '');
        const filePath = path.join(contentDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug: data.slug || slug,
            title: data.title || slug,
            date: data.date || '',
            context: data.context,
            content,
        };
    });

    return pieces.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
    });
}

export function getPiece(category: string, slug: string): Piece | null {
    const filePath = path.join(process.cwd(), 'content', category, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug: data.slug || slug,
        title: data.title || slug,
        date: data.date || '',
        context: data.context,
        content,
    };
}
