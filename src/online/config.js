module.exports =
  'module.exports = ' +
  JSON.stringify({
    SCOREBOARD_SERVER: process.env.SCOREBOARD_SERVER,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID
  })
