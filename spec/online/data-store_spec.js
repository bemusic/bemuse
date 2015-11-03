
import _ from 'lodash'

import * as DataStore from 'bemuse/online/data-store'
import * as Operations from 'bemuse/online/operations'

describe('Online DataStore', function() {

  describe('initial state', function() {
    describe('get', function() {
      it('should return initial operation state when not exist', function () {
        let item = DataStore.get(DataStore.INITIAL_STATE, 'meow')
        expect(item).to.deep.equal(Operations.INITIAL_OPERATION_STATE)
      })
    })
    describe('has', function() {
      it('has should return false', function() {
        let has = DataStore.has(DataStore.INITIAL_STATE, 'meow')
        expect(has).to.be.false
      })
    })
  })

  describe('reducer', function() {
    describe('put', function() {
      it('should transition state of a record', function() {
        let action1 = DataStore.put('a', Operations.completedStateTransition(1))
        let action2 = DataStore.put('b', Operations.completedStateTransition(2))
        let state = (_()
          .thru(state => DataStore.reduce(state, action1))
          .thru(state => DataStore.reduce(state, action2))
          .value()
        )
        expect(DataStore.get(state, 'a').value).to.equal(1)
        expect(DataStore.get(state, 'b').value).to.equal(2)
      })
    })
    describe('putMultiple', function() {
      it('should transition state of multiple records', function() {
        let action = DataStore.putMultiple({
          'a': Operations.completedStateTransition(1),
          'b': Operations.completedStateTransition(2),
        })
        let state = DataStore.reduce(undefined, action)
        expect(DataStore.get(state, 'a').value).to.equal(1)
        expect(DataStore.get(state, 'b').value).to.equal(2)
      })
    })
  })

  describe('with records', function() {
    beforeEach(function() {
      let action = DataStore.putMultiple({
        'a': Operations.completedStateTransition(1),
        'b': Operations.completedStateTransition(2),
        'c': Operations.INITIAL_OPERATION_STATE,
        'd': Operations.loadingStateTransition(),
      })
      this.state = DataStore.reduce(undefined, action)
    })
    describe('has', function() {
      it('has should return true if touched', function() {
        expect(DataStore.has(this.state, 'a')).to.be.true
        expect(DataStore.has(this.state, 'b')).to.be.true
        expect(DataStore.has(this.state, 'c')).to.be.true
        expect(DataStore.has(this.state, 'd')).to.be.true
      })
      it('has should return false if untouched', function() {
        expect(DataStore.has(this.state, 'e')).to.be.false
      })
    })
    describe('clear', function() {
      it('should clear the store', function() {
        this.state = DataStore.reduce(this.state, DataStore.clear())
        expect(DataStore.has(this.state, 'a')).to.be.false
      })
    })
  })
})
