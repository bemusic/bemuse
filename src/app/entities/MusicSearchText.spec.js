import * as MusicSearchText from './MusicSearchText'
import { given, shouldEqual } from 'circumstance'

describe('MusicSearchText', function () {
  it('is initially blank', () =>
    given(MusicSearchText.initialState)
      .then(MusicSearchText.searchText, shouldEqual(''))
      .and(MusicSearchText.inputText, shouldEqual(''))
  )

  it('should set inputText when typing', () =>
    given(MusicSearchText.initialState)
      .when(MusicSearchText.handleTextType('hello'))
      .then(MusicSearchText.searchText, shouldEqual(''))
      .and(MusicSearchText.inputText, shouldEqual('hello'))
  )

  it('should copy inputText to searchText when debounced', () =>
    given(MusicSearchText.initialState)
      .and(MusicSearchText.handleTextType('hello'))
      .when(MusicSearchText.handleDebounce)
      .then(MusicSearchText.searchText, shouldEqual('hello'))
      .and(MusicSearchText.inputText, shouldEqual('hello'))
  )

  it('should allow setting text, changing both', () =>
    given(MusicSearchText.initialState)
      .when(MusicSearchText.setText('meow'))
      .then(MusicSearchText.searchText, shouldEqual('meow'))
      .and(MusicSearchText.inputText, shouldEqual('meow'))
  )
})
