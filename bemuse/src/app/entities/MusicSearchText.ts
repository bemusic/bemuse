import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import produce, { Draft } from 'immer'

export interface MusicSearchTextState {
  staged: string
  committed: string
}

// Initializer
export const initWithText = (text: string): MusicSearchTextState => ({
  staged: text,
  committed: text,
})

// Default initial state
export const initialState = initWithText('')

// Queries
export const searchText = (state: MusicSearchTextState) => state.committed
export const inputText = (state: MusicSearchTextState) => state.staged

// Updaters
export const handleTextType = (text: string) =>
  produce((draft: Draft<MusicSearchTextState>) => {
    draft.staged = text
  })
export const handleDebounce = (state: MusicSearchTextState) => ({
  ...state,
  committed: state.staged,
})
export const setText = (text: string) => () => initWithText(text)

export const musicSearchTextSlice = createSlice({
  name: 'musicSearchText',
  initialState,
  reducers: {
    MUSIC_SEARCH_TEXT_TYPED: (
      state,
      { payload: { text } }: PayloadAction<{ text: string }>
    ) => handleTextType(text)(state),
    MUSIC_SEARCH_DEBOUNCED: (state) => handleDebounce(state),
    MUSIC_SEARCH_TEXT_INITIALIZED: (
      _state,
      { payload: { text } }: PayloadAction<{ text: string }>
    ) => setText(text)(),
  },
})
