
import { Parse } from 'parse'

import query  from 'bemuse/utils/query'
import Online from 'bemuse/online'

if (query.PARSE_APP_ID && query.PARSE_API_KEY) {
  tests(query.PARSE_APP_ID, query.PARSE_API_KEY)
} else {
  describe('Online', function() {
    xit('Set PARSE_APP_ID and PARSE_API_KEY to test')
  })
}

function tests(APP_ID, JS_KEY) {

  describe('Online', function() {

    function createAccountInfo() {
      return {
        username: 'bemuse_test_' + new Date().getTime(),
        password: 'wow_bemuse_test',
        email: 'test+' + new Date().getTime() + '@bemuse.ninja',
      }
    }

    this.timeout(10000)

    let online

    before(function() {
      Parse.initialize(APP_ID, JS_KEY)
    })

    beforeEach(function(){
      online = new Online()
    })

    describe('signup', function() {
      let info
      before(function() {
        info = createAccountInfo()
      })
      it('should succeed', function() {
        return expect(online.signUp(info)).to.be.fulfilled
      })
      it('should not allow duplicate signup', function() {
        return expect(online.signUp(info)).to.be.rejectedWith(Error)
      })
    })

    describe('initially', function() {
      beforeEach(function() {
        online.logOut()
      })
      beforeEach(function() {
        online = new Online()
      })
      describe('user川', function() {
        it('should be null', function() {
          return expect(online.user川.first().toPromise()).to.eventually.be.null
        })
      })
    })

    describe('when signed up', function() {
      describe('user川', function() {
        it('should change to signed-up user, and also start with it', function() {
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

    describe('with an active user', function() {
      let info = createAccountInfo()
      before(function() {
        return online.signUp(info)
      })
      beforeEach(function() {
        return online.logIn(info)
      })
      describe('when log out', function() {
        it('should change user川 back to null', function() {
          let promise = online.user川.take(2).toPromise().then(user => {
            void expect(user).to.be.null
          })
          Promise.resolve(online.logOut()).done()
          return promise
        })
      })
    })

  })
}
