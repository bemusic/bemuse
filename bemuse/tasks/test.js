import gulp from 'gulp'
import { Server, config } from 'karma'
import { join } from 'path'

gulp.task('test', async function (done) {
  const parsedConfig = await config.parseConfig(
    join(__dirname, '..', 'karma.conf.js'),
    {
      singleRun: true,
    },
    {
      promiseConfig: true,
      throwErrors: true,
    }
  )
  await new Server(parsedConfig, done).start()
})
