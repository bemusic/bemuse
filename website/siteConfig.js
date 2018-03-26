'use strict'

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true
  }
]

const siteConfig = {
  title: 'Bemuse' /* title for your website */,
  tagline: 'online, web-based rhythm game',
  url: 'https://bemusic.github.io' /* your website url */,
  baseUrl: '/bemuse/' /* base url for your project */,
  projectName: 'bemuse',
  headerLinks: [
    { doc: 'users-gameplay', label: 'User docs' },
    { doc: 'developers-getting-started', label: 'Developer docs' }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#bc6374',
    secondaryColor: '#9d233c',
    greenColor: '#ac8',
    blueColor: '#8ac'
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
