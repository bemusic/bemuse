import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure basePath is not set if we want docs at /project/ on the final domain,
  // as basePath would make Next.js expect /basePath/_next/... for its assets.
  // If the final structure is example.com/project/, then /project is like a base path.
  // However, the build script copies website/out/** to dist/project/**.
  // This means Next.js itself doesn't need to know about '/project'.
  // It builds as if it's at the root, and the build script places it into a subdirectory.
  // So, no basePath here.

  // If trailingSlash is not set, it defaults to false.
  // For static exports, often true is useful to create index.html files in folders.
  // e.g. /docs/user-guide -> /docs/user-guide/index.html
  // This makes servers serve them correctly without needing to rewrite /docs/user-guide to /docs/user-guide.html.
  trailingSlash: true,
};

export default nextConfig;
