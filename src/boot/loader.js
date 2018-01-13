// This file holds the logic to generate a code-splitting loader function.
// The code is compiled on build-time.
const modules = {
  // >> boot/modes
  // app
  //   The main game application. This will bring up the Title Screen.
  app: () => import(/* webpackChunkName: 'app' */ 'bemuse/app'),

  // >>
  // music
  //   The music collection viewer which shows all the songs.
  music: () => import(/* webpackChunkName: 'music' */ 'bemuse/music-collection-viewer'),

  // >>
  // test
  //   The unit tests.
  test: () => import(/* webpackChunkName: 'test' */ 'bemuse/test'),

  // >>
  // comingSoon
  //   Displays the "coming soon" text.
  comingSoon: () => import(/* webpackChunkName: 'comingSoon' */ 'bemuse/coming-soon'),

  // >>
  // sync
  //   Displays a simple UI for determining your computer's audio+input
  //   latency.
  sync: () => import(/* webpackChunkName: 'sync' */ 'bemuse/auto-synchro'),

  // >>
  // game
  //   Runs the game shell.
  game: () => import(/* webpackChunkName: 'game' */ 'bemuse/game'),

  // >>
  // playground
  //   Various playgrounds...
  playground: () => import(/* webpackChunkName: 'playground' */ 'bemuse/devtools/playground')
}

export default modules
