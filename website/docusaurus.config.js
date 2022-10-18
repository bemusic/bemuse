// @ts-check

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'Bemuse',
  tagline: 'online, web-based rhythm game',
  url: 'https://bemuse.ninja',
  baseUrl: '/project/',
  organizationName: 'bemusic',
  projectName: 'bemuse',
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic',
  ],
  favicon: 'img/favicon.png',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          path: '../docs',
          sidebarPath: 'sidebars.json',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/custom-theme.css'),
          ],
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Bemuse',
      logo: {
        src: 'img/white-logo.png',
      },
      items: [
        {
          href: 'https://bemuse.ninja',
          label: 'Play',
          position: 'left',
        },
        {
          to: 'docs/user-guide',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://faq.bemuse.ninja',
          label: 'Community FAQ',
          position: 'left',
        },
        {
          to: '/contribute',
          label: 'Contribute',
          position: 'left',
        },
        {
          href: 'https://discord.gg/aB6ucmx',
          label: 'Discord',
          position: 'left',
        },
        {
          href: 'https://github.com/bemusic/bemuse',
          label: 'GitHub',
          position: 'left',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'User Documentation',
              to: 'docs/user-guide.html',
            },
            {
              label: 'Developer Documentation',
              to: 'docs/developer-guide.html',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord Community',
              href: 'https://discord.gg/aB6ucmx',
            },
            {
              label: 'Community FAQ',
              href: 'https://faq.bemuse.ninja',
            },
            {
              label: 'GitHub Project',
              href: 'https://github.com/bemusic/bemuse',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Twitter @bemusegame',
              href: 'https://twitter.com/bemusegame',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bemuse Team`,
      logo: {
        src: 'img/white-logo.png',
        alt: 'Bemuse',
        href: '/',
        width: 72,
        height: 72,
        style: {
          opacity: 0.4,
        },
      },
      style: 'dark',
    },
    algolia: {
      appId: '1I7X31Q06Y',
      apiKey: 'a113c79cadd1ce125abb6011106af056',
      indexName: 'bemuse',
    },
  },
}
