import { filter, first, firstValueFrom } from 'rxjs'

import Online from '.'
import OnlineService from './scoreboard-system/OnlineService'
import assert from 'power-assert'

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

tests({ fake: true })

function tests(onlineServiceOptions) {
  const storage = {
    map: new Map(),
    getItem(key) {
      return this.map.get(key) ?? null
    },
    setItem(key, value) {
      this.map.set(key, value)
    },
    removeItem(key) {
      this.map.delete(key)
    },
  }

  function createOnline() {
    return new Online(new OnlineService({ ...onlineServiceOptions, storage }))
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
      /** @type {ReturnType<typeof createOnline>} */
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
      /** @type {ReturnType<typeof createOnline>} */
      let online
      before(async () => {
        await createOnline().logOut()
      })
      beforeEach(async () => {
        online = createOnline()
      })
      describe('getCurrentUser', function () {
        it('should return null', function () {
          assert.equal(online.getCurrentUser(), null)
        })
      })
    })

    describe('when signed up', function () {
      /** @type {ReturnType<typeof createOnline>} */
      let online
      before(function () {
        online = createOnline()
      })
      describe('getCurrentUser', function () {
        it('should change to signed-up user, and also start with it', async function () {
          const info = createAccountInfo()
          await online.signUp(info)
          const user = online.getCurrentUser()
          assert.equal(user.username, info.username)

          const anotherUser = createOnline().getCurrentUser()
          assert.equal(anotherUser.username, info.username)
        })
      })
    })

    describe('with an active user', function () {
      /** @type {ReturnType<typeof createOnline>} */
      let online
      const info = createAccountInfo()
      before(function () {
        online = createOnline()
        return online.signUp(info)
      })
      beforeEach(function () {
        return online.logIn(info)
      })
      describe('when log out', function () {
        it('should change getCurrentUser result back to null', async function () {
          await online.logOut()
          assert.equal(online.getCurrentUser(), null)
        })
      })
    })

    describe('submitting high scores', function () {
      /** @type {ReturnType<typeof createOnline>} */
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
      /** @type {ReturnType<typeof createOnline>} */
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
