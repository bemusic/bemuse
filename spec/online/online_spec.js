
import { Parse } from 'parse'

import query  from 'bemuse/utils/query'
import Online from 'bemuse/online'

var uid = (function () {
  var session = Math.floor(Math.random() * 65536).toString(16)
  var index = 0
  return function () {
    var random = Math.floor(Math.random() * 65536).toString(16)
    var time = Date.now().toString(16)
    return (
      'bemuse.' + time + '.' + session + '.' + random +
      '.' + (++index).toString(16)
    )
  }
})()

if (query.PARSE_APP_ID && query.PARSE_API_KEY) {
  tests(query.PARSE_APP_ID, query.PARSE_API_KEY)
} else {
  describe('Online', function () {
    xit('Set PARSE_APP_ID and PARSE_API_KEY to test')
  })
}

function tests (APP_ID, JS_KEY) {

  describe('Online', function () {

    function createAccountInfo () {
      return {
        username: uid(),
        password: 'wow_bemuse_test',
        email: 'test+' + uid() + '@bemuse.ninja',
      }
    }

    this.timeout(10000)

    before(function () {
      Parse.initialize(APP_ID, JS_KEY)
    })

    describe('signup', function () {
      let online
      let info
      before(function () {
        online = new Online()
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
        online = new Online()
        return online.logOut()
      })
      beforeEach(function () {
        online = new Online()
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
        online = new Online()
      })
      describe('user川', function () {
        it('should change to signed-up user, and also start with it', function () {
          let info = createAccountInfo()
          let promise = (
            online.user川.take(2).toPromise()
            .then(user => {
              expect(user.username).to.equal(info.username)
            })
            .tap(() => {
              return new Online().user川.first().toPromise().then(user => {
                expect(user.username).to.equal(info.username)
              })
            })
          )
          Promise.resolve(online.signUp(info)).done()
          return promise
        })
      })
    })

    describe('with an active user', function () {
      let online
      let info = createAccountInfo()
      before(function () {
        online = new Online()
      })
      before(function () {
        return online.signUp(info)
      })
      beforeEach(function () {
        return online.logIn(info)
      })
      describe('when log out', function () {
        it('should change user川 back to null', function () {
          let promise = online.user川.take(2).toPromise().then(user => {
            void expect(user).to.be.null
          })
          Promise.resolve(online.logOut()).done()
          return promise
        })
      })
    })

    describe('submitting high scores', function () {

      let online
      before(function () {
        online = new Online()
      })

      var prefix = uid() + '_'
      var user1 = createAccountInfo()
      var user2 = createAccountInfo()

      steps(step => {
        let lastRecordedAt
        step('sign up...', function () {
          return online.signUp(user1)
        })
        step('records data successfully', function () {
          return Promise.resolve(online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 123456,
            combo: 123,
            total: 456,
            count: [122, 1, 0, 0, 333],
            log: ''
          }))
          .tap(function (record) {
            expect(record.playNumber).to.equal(1)
            expect(record.playCount).to.equal(1)
            expect(record.recordedAt).to.be.an.instanceof(Date)
            expect(record.rank).to.equal(1)
            lastRecordedAt = record.recordedAt
          })
        })
        step('does not update if old score is better, but update play count', function () {
          return Promise.resolve(online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 123210,
            combo: 124,
            total: 456,
            count: [123, 1, 0, 0, 332],
            log: ''
          }))
          .tap(function (record) {
            expect(record.score).to.equal(123456)
            expect(record.combo).to.equal(123)
            expect(record.playNumber).to.equal(1)
            expect(record.playCount).to.equal(2)
            expect(record.recordedAt).not.to.be.above(lastRecordedAt)
            lastRecordedAt = record.recordedAt
          })
        })
        step('updates data if new score is better', function () {
          return Promise.resolve(online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 555555,
            combo: 456,
            total: 456,
            count: [456, 0, 0, 0, 0],
            log: ''
          }))
          .tap(function (record) {
            expect(record.score).to.equal(555555)
            expect(record.combo).to.equal(456)
            expect(record.playNumber).to.equal(3)
            expect(record.playCount).to.equal(3)
            expect(record.recordedAt).to.be.above(lastRecordedAt)
            expect(record.playerName).to.equal(user1.username)
            lastRecordedAt = record.recordedAt
          })
        })
        step('different mode have different score board', function () {
          return Promise.resolve(online.submitScore({
            md5: prefix + 'song',
            playMode: 'KB',
            score: 123210,
            combo: 124,
            total: 456,
            count: [123, 1, 0, 0, 332],
            log: ''
          }))
          .tap(function (record) {
            expect(record.score).to.equal(123210)
            expect(record.rank).to.equal(1)
          })
        })
        step('as another user...', function () {
          return online.signUp(user2)
        })
        step('saves a separate data', function () {
          return Promise.resolve(online.submitScore({
            md5: prefix + 'song',
            playMode: 'BM',
            score: 123210,
            combo: 124,
            total: 456,
            count: [123, 1, 0, 0, 332],
            log: ''
          }))
          .tap(function (record) {
            expect(record.score).to.equal(123210)
            expect(record.playNumber).to.equal(1)
            expect(record.playCount).to.equal(1)
            expect(record.rank).to.equal(2)
          })
        })
      })

    })

    describe('the scoreboard', function () {

      let online
      before(function () {
        online = new Online()
        return online.logOut()
      })

      var prefix = uid() + '_'
      var user1 = createAccountInfo()
      var user2 = createAccountInfo()
      var user3 = createAccountInfo()

      steps(step => {
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
            log: ''
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
            log: ''
          })
        })
        step('scoreboard should return the top score', function () {
          return Promise.resolve(online.scoreboard({
            md5: prefix + 'song1',
            playMode: 'BM',
          }))
          .tap(function (result) {
            expect(result.data).to.have.length(2)
            expect(result.data[0].rank).to.eq(1)
            expect(result.data[1].rank).to.eq(2)
          })
        })
        step('log out...', function () {
          return online.logOut()
        })

        var ranking
        var ranking川
        var dispose
        step('subscribe to scoreboard...', function () {
          ranking = online.Ranking({
            md5: prefix + 'song1',
            playMode: 'BM',
            score: 111111,
            combo: 123,
            total: 456,
            count: [0, 123, 0, 0, 333],
            log: ''
          })
          ranking川 = ranking.state川
          dispose   = ranking川.onValue(() => {})
        })

        function when (predicate) {
          return Promise.resolve(ranking川.filter(predicate).first().toPromise())
        }

        step('should have scoreboard loading status', function () {
          return when(state => state.meta.scoreboard.status === 'loading')
        })
        step('no new score should be submitted', function () {
          return (
            when(state =>
              state.meta.scoreboard.status === 'completed' &&
              state.meta.submission.status === 'unauthenticated'
            )
            .then(state => {
              expect(state.data).to.have.length(2)
            })
          )
        })
        step('sign up user3...', function () {
          return online.signUp(user3)
        })
        step('should start sending score', function () {
          return when(state => state.meta.submission.status === 'loading')
        })
        step('should finish sending score', function () {
          return (when(state => state.meta.submission.status === 'completed')
            .then(state => {
              expect(state.meta.submission.value.rank).to.equal(3)
            })
          )
        })
        step('should start loading scoreboard', function () {
          return when(state => state.meta.scoreboard.status === 'loading')
        })
        step('should finish reloading scoreboard', function () {
          return (when(state => state.meta.scoreboard.status === 'completed')
            .then(state => {
              expect(state.data).to.have.length(3)
            })
          )
        })
        step('resubscribe with read only', function () {
          dispose()
          ranking = online.Ranking({
            md5: prefix + 'song1',
            playMode: 'BM'
          })
          ranking川 = ranking.state川
          dispose   = ranking川.subscribe(() => {})
        })
        step('should not submit new score', function () {
          return (
            when(state =>
              state.meta.scoreboard.status === 'completed' &&
              state.meta.submission.status === 'completed'
            )
            .then(function (state) {
              expect(state.data).to.have.length(3)
              expect(state.meta.submission.value.playCount).to.equal(1)
            })
          )
        })
        after(function () {
          online.logOut()
          dispose()
        })
      })

    })

  })
}

function steps (callback) {
  var _resolve
  var promise = new Promise(resolve => (_resolve = resolve))
  var i = 0
  before(() => void _resolve())
  return callback((name, fn) => {
    promise = (
      promise
      .then(
        fn,
        () => { throw new Error('Previous steps errored') }
      )
    )
    let current = promise
    it(`${++i}. ${name}`, () => current)
  })
}
