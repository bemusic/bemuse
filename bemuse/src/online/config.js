module.exports = () => ({
  code:
    'module.exports = ' +
    JSON.stringify({
      SCOREBOARD_SERVER: process.env.SCOREBOARD_SERVER,
    }),
})
