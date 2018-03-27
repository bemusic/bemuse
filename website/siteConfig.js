'use strict'

/* List of projects/orgs using your project for the users page */
const artists = [
  {
    name: '5argon vs encX',
    url: 'https://soundcloud.com/5argon'
  },
  {
    name: '5argon',
    url: 'https://soundcloud.com/5argon'
  },
  {
    name: 'a_hisa',
    url: 'http://hisaweb.6.ql.bz/'
  }
]

const siteConfig = {
  title: 'Bemuse' /* title for your website */,
  tagline: 'online, web-based rhythm game',
  url: 'https://bemuse.ninja' /* your website url */,
  baseUrl: '/project/' /* base url for your project */,
  projectName: 'bemuse',
  headerLinks: [
    {
      href: 'https://bemuse.ninja',
      label: 'Play'
    },
    { doc: 'users-gameplay', label: 'Docs' },
    { page: 'contribute', label: 'Contribute' }
  ],
  users: artists,
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: 'rgb(227, 78, 122)',
    secondaryColor: 'rgb(157, 35, 60)',
    greenColor: 'rgb(145, 207, 0)',
    blueColor: 'rgb(49, 188, 250)'
  },
  /* custom fonts for website */
  fonts: {
    baseFont: [
      'Source Sans Pro',
      'Segoe UI',
      'Helvetica Neue',
      'sans-serif'
    ]
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Your Name or Your Company Name',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default'
  },
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic'
  ],
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
  ],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/bemusic/bemuse'
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
}

module.exports = siteConfig
