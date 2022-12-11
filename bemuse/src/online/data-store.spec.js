import * as DataStore from './data-store'
import * as Operations from './operations'

import _ from 'lodash'

describe('Online DataStore', function () {
  describe('initial state', function () {
    describe('get', function () {
      it('should return initial operation state when not exist', function () {
        const item = DataStore.get(DataStore.initialState(), 'meow')
        expect(item).to.deep.equal(Operations.INITIAL_OPERATION_STATE)
      })
    })
    describe('has', function () {
      it('has should return false', function () {
        const has = DataStore.has(DataStore.initialState(), 'meow')
        void expect(has).to.be.false
      })
    })
  })

  describe('reducer', function () {
    describe('put', function () {
      it('should transition state of a record', function () {
        const action1 = DataStore.put('a', Operations.completed(1))
        const action2 = DataStore.put('b', Operations.completed(2))
        const state = _()
          .thru((state) => DataStore.reduce(state, action1))
          .thru((state) => DataStore.reduce(state, action2))
          .value()
        expect(DataStore.get(state, 'a').value).to.equal(1)
        expect(DataStore.get(state, 'b').value).to.equal(2)
      })
    })
    describe('putMultiple', function () {
      it('should transition state of multiple records', function () {
        const action = DataStore.putMultiple({
          a: Operations.completed(1),
          b: Operations.completed(2),
        })
        const state = DataStore.reduce(undefined, action)
        expect(DataStore.get(state, 'a').value).to.equal(1)
        expect(DataStore.get(state, 'b').value).to.equal(2)
      })
    })
  })

  describe('with records', function () {
    beforeEach(function () {
      const action = DataStore.putMultiple({
        a: Operations.completed(1),
        b: Operations.completed(2),
        c: Operations.INITIAL_OPERATION_STATE,
        d: Operations.loading(),
      })
      this.state = DataStore.reduce(undefined, action)
    })
    describe('has', function () {
      it('has should return true if touched', function () {
        void expect(DataStore.has(this.state, 'a')).to.be.true
        void expect(DataStore.has(this.state, 'b')).to.be.true
        void expect(DataStore.has(this.state, 'c')).to.be.true
        void expect(DataStore.has(this.state, 'd')).to.be.true
      })
      it('has should return false if untouched', function () {
        void expect(DataStore.has(this.state, 'e')).to.be.false
      })
    })
    describe('clear', function () {
      it('should clear the store', function () {
        this.state = DataStore.reduce(this.state, DataStore.clear())
        void expect(DataStore.has(this.state, 'a')).to.be.false
      })
    })
  })
})
