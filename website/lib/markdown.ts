import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const docsDirectory = path.join(process.cwd(), 'docs');

export async function getDocBySlug(slug: string) {
  const fullPath = path.join(docsDirectory, `${slug}.md`);
  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    // If the error is ENOENT (file not found), we can provide a more specific error or handle it.
    // For now, let it propagate to indicate the doc was not found.
    throw new Error(`Markdown file not found for slug: ${slug} at ${fullPath}. Error: ${err}`);
  }

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    frontmatter: matterResult.data,
    contentHtml,
  };
}

export function getAllDocSlugs() {
  let fileNames;
  try {
    fileNames = fs.readdirSync(docsDirectory);
  } catch (err) {
    // If docsDirectory doesn't exist or is unreadable, return empty array or throw.
    // For now, let's assume it exists if we reach here based on prior setup.
    console.error("Error reading docs directory:", err);
    return [];
  }

  const slugs = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // The slug should be the filename without the .md extension.
      // If the filename is 'some-doc.md', the slug is 'some-doc'.
      // For [...slug] routes, Next.js expects an array of strings for the slug parts.
      // If our slugs are simple like 'user-guide', it will be ['user-guide'].
      // If they were 'section/topic', it would be ['section', 'topic'].
      // For now, our docs are flat, so it's just one part.
      return {
        slug: [fileName.replace(/\.md$/, '')],
      };
    });
  return slugs;
}
