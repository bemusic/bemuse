import { getAllDocSlugs, getDocBySlug } from '../../../lib/markdown';
import { Metadata } from 'next';

type Props = {
  params: {
    slug: string[];
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug.join('/');
  // We need to be careful here, getDocBySlug might throw if the doc is not found.
  // generateMetadata should ideally handle this gracefully.
  // For now, assuming valid slugs are passed based on generateStaticParams.
  try {
    const doc = await getDocBySlug(slug);
    return {
      title: doc.frontmatter.title || slug,
    };
  } catch (error) {
    // If doc not found, provide a default title or handle as needed
    console.error(`Error generating metadata for /docs/${slug}:`, error);
    return {
      title: 'Document not found',
    };
  }
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  // Example: slugs = [ { slug: ['user-guide'] }, { slug: ['developer-guide'] } ]
  return slugs;
}

export default async function DocPage({ params }: Props) {
  const slug = params.slug.join('/');
  try {
    const doc = await getDocBySlug(slug);

    return (
      <article>
        {doc.frontmatter.title && <h1>{doc.frontmatter.title}</h1>}
        <div dangerouslySetInnerHTML={{ __html: doc.contentHtml }} />
      </article>
    );
  } catch (error) {
    // Log the error for server-side debugging
    console.error(`Error fetching document for slug /docs/${slug}:`, error);
    // You could return a custom 404 component here or use Next.js's notFound()
    // For simplicity, just re-throwing or returning a simple message:
    // For a better user experience, you'd use notFound() from 'next/navigation'
    // import { notFound } from 'next/navigation';
    // notFound();
    return <div>Document not found. {String(error)}</div>;
  }
}
