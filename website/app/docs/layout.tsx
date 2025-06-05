import React from 'react';
import Link from 'next/link';
import { getAllDocSlugs } from '../../lib/markdown'; // Adjusted path

// Helper function to format slug into a readable title
function formatSlugToTitle(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docSlugs = getAllDocSlugs();
  // docSlugs is like [ { slug: ['user-guide'] }, { slug: ['developer-guide'] } ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', borderRight: '1px solid #eee', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ marginTop: 0 }}>Documentation</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {docSlugs.map(({ slug }) => {
              const slugString = slug.join('/'); // e.g., "user-guide" or "section/topic"
              const title = formatSlugToTitle(slugString);
              return (
                <li key={slugString} style={{ marginBottom: '10px' }}>
                  <Link href={`/docs/${slugString}`}>{title}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '20px' }} className="docs-main-content">
        {/* Header removed from here, could be part of individual page or a higher-level layout if consistent */}
        {children}
      </main>
    </div>
  );
}
