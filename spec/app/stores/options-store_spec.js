
import * as Options from 'bemuse/app/options'
import Store        from 'bemuse/app/stores/options-store'
import * as Actions from 'bemuse/app/actions/options-actions'

describe('OptionsStore', function() {

  let oldStorage
  let storage
  beforeEach(function() {
    oldStorage = Options.getStorage()
    storage = { }
    Options.setStorage({
      getItem(key) { return storage[key] },
      setItem(key, value) { storage[key] = String(value) }
    })
    Actions.reload()
  })
  afterEach(function() {
    Options.setStorage(oldStorage)
  })

  it('should contains options', function() {
    storage['player.P1.mode'] = 'KB'
    Actions.reload()
    expect(Store.get().options['player.P1.mode']).to.equal('KB')
    storage['player.P1.mode'] = 'BM'
    Actions.reload()
    expect(Store.get().options['player.P1.mode']).to.equal('BM')
  })
  it('should allow setting options', function() {
    storage['player.P1.mode'] = 'KB'
    Actions.reload()
    expect(Store.get().options['player.P1.mode']).to.equal('KB')
    Actions.setOptions({ 'player.P1.mode': 'BM' })
    expect(storage['player.P1.mode']).to.equal('BM')
    expect(Store.get().options['player.P1.mode']).to.equal('BM')
  })
  it('should allow setting mode', function() {
    Actions.setMode('BM')
    expect(storage['player.P1.mode']).to.equal('BM')
    Actions.setMode('KB')
    expect(storage['player.P1.mode']).to.equal('KB')
  })
  it('should allow setting scratch position', function() {
    Actions.setScratch('left')
    expect(storage['player.P1.mode']).to.equal('BM')
    expect(storage['player.P1.scratch']).to.equal('left')
    expect(Store.get().scratch).to.equal('left')
    Actions.setScratch('right')
    expect(storage['player.P1.mode']).to.equal('BM')
    expect(storage['player.P1.scratch']).to.equal('right')
    expect(Store.get().scratch).to.equal('right')
    Actions.setScratch('off')
    expect(storage['player.P1.mode']).to.equal('KB')
    expect(storage['player.P1.scratch']).to.equal('right')
    expect(Store.get().scratch).to.equal('off')
  })

})
