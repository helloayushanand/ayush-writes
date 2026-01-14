#!/usr/bin/env python3
"""
Script to migrate content from Notion to markdown files.
This script scrapes poems from the Notion site and preserves formatting.
"""

import requests
from bs4 import BeautifulSoup
import re
import os
from pathlib import Path

# Base URLs
NOTION_BASE = "https://ayushwrites.super.site"
POETRY_INDEX = f"{NOTION_BASE}/29b37ca26e2680599248ed5e93c9aa78"

# Poem URLs from the index
POEMS = {
    "डूबना": "29b37ca26e2680f18cc5d73d2c8abc83",
    "नींद": "29b37ca26e2680f4a116e4bc61e2b2ed",
    "कचड़े बीनने वाले लड़के लड़कियां": "29b37ca26e26805494d6ccdfc37643bf",
    "दिसंबर": "29b37ca26e268002909bc8f904490ba5",
    "जिन बेटियों के सर से उठ जाता है पिता का साया": "29b37ca26e268077bee9f7ceb2adc27e",
    "मै पूछता हूँ": "29b37ca26e26806c994ed10216940bd3",
    "प्रेम": "29b37ca26e2680efa3faec94d3e66b7b",
    "रोको": "29b37ca26e268010976df1fd81a76f7b",
    "लम्बी सड़क": "29b37ca26e26801ea3f3ddee0e0c83f1",
    "कल रात ख्वाब में मैंने अपनी मौत देखी - TW": "29b37ca26e26807d9179db472d0c0486",
    "छोटा शहर": "29b37ca26e26804ea195ce4558721bf3",
    "मेहमान आने वाले हैं": "29b37ca26e2680829756d5e16e2463b2",
    "खत": "29b37ca26e2680cf92d5c8da5ac84621",
    "छत - TW": "29b37ca26e268003a211f8c928f28128",
    "ये जो घाव लेकर सदियों से बैठे हुए हो -TW": "29b37ca26e2680b08936d3160515aa71",
    "तुम्हारे जाने के बाद": "29b37ca26e2680559120e8b96174a04f",
    "कमरा": "29b37ca26e2680ad87e3ee670f4cb566",
    "मैंने नहीं लिखी कविता": "29b37ca26e268018ae63e890d50e1d0b",
    "मेरे जाने के बाद": "29b37ca26e268051ae9fef4fcc744b08",
    "असंभव": "29b37ca26e2680369525e972681ad678",
    "मैं धीरे धीरे सीख रहा हूँ": "29b37ca26e2680a186ccc4238754c10b",
    "हम दोनों ने किया एक दूसरे से प्रेम": "29b37ca26e2680c9a923cd2c2b0ce215",
    "ओ पिता!": "29b37ca26e26807fbf69fa874dc360bb",
    "दीप": "29b37ca26e26803983c9c3b693c8841d",
}

def slugify(text):
    """Convert title to URL-friendly slug"""
    # Remove special characters and convert to lowercase
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def scrape_poem(url_id, title):
    """Scrape a single poem from Notion"""
    url = f"{NOTION_BASE}/{url_id}"
    print(f"Scraping: {title}")
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 404:
            print(f"  ⚠️  404 Not Found: {title}")
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the main content
        # Notion pages have content in specific divs
        content_div = soup.find('div', class_='notion-page-content')
        if not content_div:
            content_div = soup.find('article')
        
        if not content_div:
            print(f"  ❌ Could not find content for: {title}")
            return None
        
        # Extract text while preserving line breaks
        paragraphs = content_div.find_all(['p', 'div'])
        content_lines = []
        
        for p in paragraphs:
            text = p.get_text().strip()
            if text and text != title and 'Made with Super' not in text and 'ayush.writes' not in text:
                content_lines.append(text)
        
        content = '\n\n'.join(content_lines)
        
        # Extract date if present
        date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{2,4})', content)
        date = date_match.group(1) if date_match else "2023-01-01"
        
        # Extract context if present
        context_match = re.search(r'Context - (.+?)$', content, re.MULTILINE)
        context = context_match.group(1) if context_match else None
        
        return {
            'title': title,
            'date': date,
            'context': context,
            'content': content,
            'slug': slugify(title)
        }
        
    except Exception as e:
        print(f"  ❌ Error scraping {title}: {e}")
        return None

def create_markdown_file(poem, output_dir):
    """Create markdown file for a poem"""
    if not poem:
        return
    
    # Create frontmatter
    frontmatter = f"""---
title: "{poem['title']}"
date: "{poem['date']}"
slug: "{poem['slug']}"
"""
    
    if poem['context']:
        frontmatter += f'context: "{poem["context"]}"\n'
    
    frontmatter += "---\n\n"
    
    # Create full content
    full_content = frontmatter + poem['content']
    
    # Write to file
    filepath = output_dir / f"{poem['slug']}.md"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    print(f"  ✅ Created: {filepath.name}")

def main():
    # Create output directory
    output_dir = Path("content/hindi/poetry")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("🚀 Starting migration...\n")
    
    success_count = 0
    fail_count = 0
    
    for title, url_id in POEMS.items():
        poem = scrape_poem(url_id, title)
        if poem:
            create_markdown_file(poem, output_dir)
            success_count += 1
        else:
            fail_count += 1
        print()
    
    print(f"\n✨ Migration complete!")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Failed: {fail_count}")

if __name__ == "__main__":
    main()
