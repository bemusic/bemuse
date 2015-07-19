
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

    describe('user川', function() {

      describe('initially', function() {
        it('should be null', function() {
          return expect(online.user川.first().toPromise()).to.eventually.be.null
        })
      })

      describe('when signed up', function() {
        let info
        beforeEach(function() {
          info = createAccountInfo()
          Promise.resolve(online.signUp(info)).done()
        })
        it('should have the signed up value', function() {
          let promise = (
            online.user川.take(2).toPromise()
            .then(user => {
              expect(user.username).to.equal(info.username)
            })
          )
          return promise
        })
      })

    })

  })
}
