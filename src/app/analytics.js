
let ga = window.ga || function (...args) { console.log('[log]', ...args) }

function getLabel (chart) {
  return `${chart.md5} ${[chart.info.title, ...chart.info.subtitles].join(' ')}`
}

export function gameStart (song, chart, gameMode) {
  ga('send', 'event', 'song', 'play', song.title)
  ga('send', 'event', 'game', 'start', getLabel(chart), chart.info.level)
  ga('send', 'event', 'game', 'mode', gameMode, 1)
}

export function gameFinish (song, chart, gameState) {
  let state = gameState.player(gameState.game.players[0])
  ga('send', 'event', 'song', 'finish', song.title)
  ga('send', 'event', 'game', 'finish', getLabel(chart), state.stats.score)
}
