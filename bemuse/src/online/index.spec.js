import Online from './'
import OnlineService from './scoreboard-system/OnlineService'
import query from 'bemuse/utils/query'

const uid = (function () {
  const session = Math.floor(Math.random() * 65536).toString(16)
  let index = 0
  return function () {
    const random = Math.floor(Math.random() * 65536).toString(16)
    const time = Date.now().toString(16)
    return (
      'bemuse.' +
      time +
      '.' +
      session +
      '.' +
      random +
      '.' +
      (++index).toString(16)
    )
  }
})()

if (query.TEST_SCOREBOARD) {
  tests({
    server: 'https://immense-ravine-52031.herokuapp.com/',
    authOptions: {
      domain: 'bemuse-scoreboard-staging-001.auth0.com',
      clientID: 'WssUDVmiXYfSRrXXAPpztJ8qW41Dmoeb',
    },
    storagePrefix: 'scoreboard.test-auth',
  })
} else {
  describe('Online', function () {
    xit('Add TEST_SCOREBOARD env to test it!')
  })
}

function tests(onlineServiceOptions) {
  function createOnline() {
    return new Online(new OnlineService(onlineServiceOptions))
  }

  describe('Online', function () {
    function createAccountInfo() {
      return {
        username: uid(),
        password: 'wow_bemuse_test',
        email: 'test+' + uid() + '@bemuse.ninja',
      }
    }

    this.timeout(20000)

    describe('signup', function () {
      let online
      let info
      before(function () {
        online = createOnline()
      })
      after(function () {
        online = null
      })
      before(function () {
        info = createAccountInfo()
      })
      it('should succeed', function () {
        return expect(online.signUp(info)).to.be.fulfilled
      })
      it('should not allow duplicate signup', function () {
        return expect(online.signUp(info)).to.be.rejectedWith(Error)
      })
    })

    describe('initially', function () {
      let online
      beforeEach(function () {
        online = createOnline()
        return online.logOut()
      })
      beforeEach(function () {
        online = createOnline()
      })
      describe('user川', function () {
        it('should be null', function () {
          return expect(online.user川.first().toPromise()).to.eventually.be.null
        })
      })
    })

    describe('when signed up', function () {
      let online
      before(function () {
        online = createOnline()
      })
      describe('user川', function () {
        it('should change to signed-up user, and also start with it', async function () {
          const info = createAccountInfo()
          const user = await online.user川.take(2).toPromise()
          expect(user.username).to.equal(info.username)

          const firstUser = await createOnline().user川.first().toPromise()
          expect(firstUser.username).to.equal(info.username)

          await online.signUp(info)
        })
      })
    })

    describe('with an active user', function () {
      let online
      const info = createAccountInfo()
      before(function () {
        online = createOnline()
      })
      before(function () {
        return online.signUp(info)
      })
      beforeEach(function () {
        return online.logIn(info)
      })
      describe('when log out', function () {
        it('should change user川 back to null', async function () {
          const user = await online.user川.take(2).toPromise()
          void expect(user).to.be.null
          await Promise.resolve(online.logOut())
        })
      })
    })

    describe('submitting high scores', function () {
      let online
      before(function () {
        online = createOnline()
      })

      const prefix = uid() + '_'
      const user1 = createAccountInfo()
      const user2 = createAccountInfo()

      steps((step) => {
        let lastRecordedAt
        step('sign up...', function () {
          return online.signUp(user1)
        })
        step('records data successfully', async function () {
          const record = await online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 123456,
            combo: 123,
            total: 456,
            count: [122, 1, 0, 0, 333],
            log: '',
          })
          expect(record.playNumber).to.equal(1)
          expect(record.playCount).to.equal(1)
          expect(record.recordedAt).to.be.an.instanceof(Date)
          expect(record.rank).to.equal(1)
          lastRecordedAt = record.recordedAt
        })
        step(
          'does not update if old score is better, but update play count',
          async function () {
            const record = await online.submitScore({
              md5: prefix + 'song',
              playMode: 'BM',
              score: 123210,
              combo: 124,
              total: 456,
              count: [123, 1, 0, 0, 332],
              log: '',
            })
            expect(record.score).to.equal(123456)
            expect(record.combo).to.equal(123)
            expect(record.playNumber).to.equal(1)
            expect(record.playCount).to.equal(2)
            expect(record.recordedAt).not.to.be.above(lastRecordedAt)
            lastRecordedAt = record.recordedAt
          }
        )
        step('updates data if new score is better', async function () {
          const record = await online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 555555,
            combo: 456,
            total: 456,
            count: [456, 0, 0, 0, 0],
            log: '',
          })
          expect(record.score).to.equal(555555)
          expect(record.combo).to.equal(456)
          expect(record.playNumber).to.equal(3)
          expect(record.playCount).to.equal(3)
          expect(record.recordedAt).to.be.above(lastRecordedAt)
          expect(record.playerName).to.equal(user1.username)
          lastRecordedAt = record.recordedAt
        })
        step('different mode have different score board', async function () {
          const record = await online.submitScore({
            md5: prefix + 'song',
            playMode: 'KB',
            score: 123210,
            combo: 124,
            total: 456,
            count: [123, 1, 0, 0, 332],
            log: '',
          })
          expect(record.score).to.equal(123210)
          expect(record.rank).to.equal(1)
        })
        step('as another user...', function () {
          return online.signUp(user2)
        })
        step('saves a separate data', async function () {
          const record = await online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 123210,
            combo: 124,
            total: 456,
            count: [123, 1, 0, 0, 332],
            log: '',
          })
          expect(record.score).to.equal(123210)
          expect(record.playNumber).to.equal(1)
          expect(record.playCount).to.equal(1)
          expect(record.rank).to.equal(2)
        })
      })
    })

    describe('the scoreboard', function () {
      let online
      before(function () {
        online = createOnline()
        return online.logOut()
      })

      const prefix = uid() + '_'
      const user1 = createAccountInfo()
      const user2 = createAccountInfo()
      const user3 = createAccountInfo()

      steps((step) => {
        step('sign up user1...', function () {
          return online.signUp(user1)
        })
        step('submit score1...', function () {
          return online.submitScore({
            md5: prefix + 'song1',
            playMode: 'BM',
            score: 222222,
            combo: 456,
            total: 456,
            count: [0, 0, 456, 0, 0],
            log: '',
          })
        })
        step('sign up user2...', function () {
          return online.signUp(user2)
        })
        step('submit score2...', function () {
          return online.submitScore({
            md5: prefix + 'song1',
            playMode: 'BM',
            score: 555555,
            combo: 456,
            total: 456,
            count: [456, 0, 0, 0, 0],
            log: '',
          })
        })
        step('scoreboard should return the top score', async function () {
          const result = await online.scoreboard({
            md5: prefix + 'song1',
            playMode: 'BM',
          })
          expect(result.data).to.have.length(2)
          expect(result.data[0].rank).to.eq(1)
          expect(result.data[1].rank).to.eq(2)
        })
        step('log out...', function () {
          return online.logOut()
        })

        let ranking
        let ranking川
        let dispose
        step('subscribe to scoreboard...', function () {
          ranking = online.Ranking({
            md5: prefix + 'song1',
            playMode: 'BM',
            score: 111111,
            combo: 123,
            total: 456,
            count: [0, 123, 0, 0, 333],
            log: '',
          })
          ranking川 = ranking.state川
          dispose = ranking川.onValue(() => {})
        })

        function when(predicate) {
          return Promise.resolve(
            ranking川.filter(predicate).first().toPromise()
          )
        }

        step('should have scoreboard loading status', function () {
          return when((state) => state.meta.scoreboard.status === 'loading')
        })
        step('no new score should be submitted', function () {
          return when(
            (state) =>
              state.meta.scoreboard.status === 'completed' &&
              state.meta.submission.status === 'unauthenticated'
          ).then((state) => {
            expect(state.data).to.have.length(2)
          })
        })
        step('sign up user3...', function () {
          return online.signUp(user3)
        })
        step('should start sending score', function () {
          return when((state) => state.meta.submission.status === 'loading')
        })
        step('should finish sending score', function () {
          return when(
            (state) => state.meta.submission.status === 'completed'
          ).then((state) => {
            expect(state.meta.submission.value.rank).to.equal(3)
          })
        })
        step('should start loading scoreboard', function () {
          return when((state) => state.meta.scoreboard.status === 'loading')
        })
        step('should finish reloading scoreboard', function () {
          return when(
            (state) => state.meta.scoreboard.status === 'completed'
          ).then((state) => {
            expect(state.data).to.have.length(3)
          })
        })
        step('resubscribe with read only', function () {
          dispose()
          ranking = online.Ranking({
            md5: prefix + 'song1',
            playMode: 'BM',
          })
          ranking川 = ranking.state川
          dispose = ranking川.subscribe(() => {})
        })
        step('should not submit new score', function () {
          return when(
            (state) =>
              state.meta.scoreboard.status === 'completed' &&
              state.meta.submission.status === 'completed'
          ).then(function (state) {
            expect(state.data).to.have.length(3)
            expect(state.meta.submission.value.playCount).to.equal(1)
          })
        })
        after(function () {
          online.logOut()
          dispose()
        })
      })
    })
  })
}

function steps(f) {
  let _resolve
  let promise = new Promise((resolve) => (_resolve = resolve))
  let i = 0
  before(() => void _resolve())
  return f((name, fn) => {
    promise = promise.then(fn, () => {
      throw new Error('Previous steps errored')
    })
    const current = promise
    it(`${++i}. ${name}`, () => current)
  })
}
