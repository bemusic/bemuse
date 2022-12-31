// This module defines the state shape, behavior, and actions of the Redux store.
//
// - Use action constants to create actions. They are in past tense, describing
//   what happened.
// - The reducers are used to apply the action to the state. Domain logic should
//   not be here. Instead, put them in entities.
// - The selectors can be used to query data from the store.
//

import * as Collections from '../entities/Collections'
import * as LoadState from '../entities/LoadState'
import * as MusicSearchText from '../entities/MusicSearchText'
import * as MusicSelection from '../entities/MusicSelection'
import * as Options from '../entities/Options'

import type {
  Chart,
  MusicServerIndex,
  SongMetadataInCollection,
} from 'bemuse-types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import _ from 'lodash'
import { createSelector } from 'reselect'
import { enableMapSet } from 'immer'
import filterSongs from 'bemuse/music-collection/filterSongs'
import getPlayableCharts from 'bemuse/music-collection/getPlayableCharts'
import groupSongsIntoCategories from 'bemuse/music-collection/groupSongsIntoCategories'
import preprocessCollection from 'bemuse/music-collection/preprocessCollection'
import sortSongs from 'bemuse/music-collection/sortSongs'

enableMapSet()

/** @deprecated Use the action in `collectionsSlice`. */
export const COLLECTION_LOADING_BEGAN = 'COLLECTION_LOADING_BEGAN'
/** @deprecated Use the action in `collectionsSlice`. */
export const COLLECTION_LOADING_ERRORED = 'COLLECTION_LOADING_ERRORED'
/** @deprecated Use the action in `collectionsSlice`. */
export const COLLECTION_LOADED = 'COLLECTION_LOADED'
/** @deprecated Use the action in `customSongLoadStateSlice`. */
export const CUSTOM_SONG_LOAD_STARTED = 'CUSTOM_SONG_LOAD_STARTED'
/** @deprecated Use the action in `customSongLoadStateSlice`. */
export const CUSTOM_SONG_LOADED = 'CUSTOM_SONG_LOADED'
/** @deprecated Use the action in `customSongLoadStateSlice`. */
export const CUSTOM_SONGS_LOADED = 'CUSTOM_SONGS_LOADED'
/** @deprecated Use the action in `musicSearchTextSlice`. */
export const MUSIC_SEARCH_TEXT_TYPED = 'MUSIC_SEARCH_TEXT_TYPED'
/** @deprecated Use the action in `musicSearchTextSlice`. */
export const MUSIC_SEARCH_TEXT_INITIALIZED = 'MUSIC_SEARCH_TEXT_INITIALIZED'
/** @deprecated Use the action in `musicSearchTextSlice`. */
export const MUSIC_SEARCH_DEBOUNCED = 'MUSIC_SEARCH_DEBOUNCED'
/** @deprecated Use the action in `musicSelectionSlice`. */
export const MUSIC_SONG_SELECTED = 'MUSIC_SONG_SELECTED'
/** @deprecated Use the action in `musicSelectionSlice`. */
export const MUSIC_CHART_SELECTED = 'MUSIC_CHART_SELECTED'
export const OPTIONS_LOADED_FROM_STORAGE = 'OPTIONS_LOADED_FROM_STORAGE'
/** @deprecated Use the action in `currentSongReadmeSlice`. */
export const README_LOADING_STARTED = 'README_LOADING_STARTED'
/** @deprecated Use the action in `currentSongReadmeSlice`. */
export const README_LOADED = 'README_LOADED'
/** @deprecated Use the action in `currentSongReadmeSlice`. */
export const README_LOADING_ERRORED = 'README_LOADING_ERRORED'
/** @deprecated Use the action in `rageQuitSlice`. */
export const RAGEQUITTED = 'RAGEQUITTED'
/** @deprecated Use the action in `rageQuitSlice`. */
export const RAGEQUIT_DISMISSED = 'RAGEQUIT_DISMISSED'

export interface AppState {
  collections: Map<string, LoadState.LoadState<MusicServerIndex>>
  customSongLoadState: LoadState.LoadState<undefined>
  customSongs: SongMetadataInCollection[]
  currentCollection: string
  musicSearchText: MusicSearchText.MusicSearchTextState
  musicSelection: MusicSelection.MusicSelectionState
  options: Options.OptionsState
  currentSongReadme: string
  rageQuit: boolean
}

// Slice
export const collectionsSlice = createSlice({
  name: 'collections',
  initialState: new Map<string, LoadState.LoadState<MusicServerIndex>>(),
  reducers: {
    COLLECTION_LOADING_BEGAN: (
      state,
      { payload: { url } }: PayloadAction<{ url: string }>
    ) => {
      state.set(url, LoadState.initLoading())
    },
    COLLECTION_LOADING_ERRORED: (
      state,
      { payload: { url, error } }: PayloadAction<{ url: string; error: Error }>
    ) => {
      state.set(url, LoadState.errorWithReason(error)())
    },
    COLLECTION_LOADED: (
      state,
      {
        payload: { url, data },
      }: PayloadAction<{ url: string; data: MusicServerIndex }>
    ) => {
      state.set(url, LoadState.completeWithValue(data)())
    },
  },
})
export const customSongLoadStateSlice = createSlice({
  name: 'customSongLoadState',
  initialState: LoadState.initCompletedWithValue(undefined),
  reducers: {
    CUSTOM_SONG_LOAD_STARTED: () => LoadState.beginLoading<undefined>()(),
    CUSTOM_SONG_LOADED: () => LoadState.completeWithValue(undefined)(),
  },
})
export const customSongsSlice = createSlice({
  name: 'customSongs',
  initialState: [] as SongMetadataInCollection[],
  reducers: {
    CUSTOM_SONG_LOADED: (
      _state,
      { payload: { song } }: PayloadAction<{ song: SongMetadataInCollection }>
    ) => [song],
    CUSTOM_SONGS_LOADED: (
      _state,
      {
        payload: { songs },
      }: PayloadAction<{ songs: SongMetadataInCollection[] }>
    ) => songs,
  },
})
export const currentCollectionSlice = createSlice({
  name: 'currentCollection',
  initialState: '',
  reducers: {
    COLLECTION_LOADING_BEGAN: (
      state,
      { payload: { url } }: PayloadAction<{ url: string }>
    ) => (state === '' ? url : state),
  },
})
export const currentSongReadmeSlice = createSlice({
  name: 'currentSongReadme',
  initialState: 'Omachi kudasai…',
  reducers: {
    README_LOADING_STARTED: () => 'Omachi kudasai…',
    README_LOADING_ERRORED: (
      _state,
      { payload: { url } }: PayloadAction<{ url: string }>
    ) => 'Cannot download ' + url,
    README_LOADED: (
      _state,
      { payload: { text } }: PayloadAction<{ text: string }>
    ) => text,
  },
})
export const rageQuitSlice = createSlice({
  name: 'rageQuit',
  initialState: false,
  reducers: {
    RAGEQUITTED: () => true,
    RAGEQUIT_DISMISSED: () => false,
  },
})

// Reducer
export const reducer = {
  collections: collectionsSlice.reducer,
  customSongLoadState: customSongLoadStateSlice.reducer,
  customSongs: customSongsSlice.reducer,
  currentCollection: currentCollectionSlice.reducer,
  musicSearchText: MusicSearchText.musicSearchTextSlice.reducer,
  musicSelection: MusicSelection.musicSelectionSlice.reducer,
  options: Options.optionsSlice.reducer,
  currentSongReadme: currentSongReadmeSlice.reducer,
  rageQuit: rageQuitSlice.reducer,
}

// Selectors
export const selectCurrentCollectionUrl = (state: AppState) =>
  state.currentCollection

export const selectCurrentCollection = createSelector(
  (state: AppState) => state.collections,
  selectCurrentCollectionUrl,
  (collections, currentCollection): LoadState.LoadState<MusicServerIndex> => {
    const index =
      Collections.getCollectionByUrl<MusicServerIndex>(currentCollection)(
        collections
      )
    if (!index) {
      throw new Error(
        `${currentCollection} is selected but not started to load yet`
      )
    }
    return index
  }
)

export const selectIsCurrentCollectionLoading = (state: AppState) =>
  LoadState.isLoading(selectCurrentCollection(state))

export const selectCurrentCorrectionLoadError = (state: AppState) =>
  LoadState.error(selectCurrentCollection(state))

export const selectRawCurrentCollectionValue = (state: AppState) =>
  LoadState.value(selectCurrentCollection(state))

export const selectCurrentCollectionValue = createSelector(
  selectRawCurrentCollectionValue,
  (collection) => collection && preprocessCollection(collection)
)

export const selectSearchInputText = (state: AppState) =>
  MusicSearchText.inputText(state.musicSearchText)

export const selectSearchText = (state: AppState) =>
  MusicSearchText.searchText(state.musicSearchText)

export const { selectGroups, selectSongs } = (() => {
  const selectSongListFromCurrentCollection = createSelector(
    selectCurrentCollectionValue,
    (collectionData) => (collectionData && collectionData.songs) || []
  )
  const selectSongList = createSelector(
    selectSongListFromCurrentCollection,
    (state: AppState) => state.customSongs,
    (songList, customSongs) => [...customSongs, ...songList]
  )
  const selectSortedSongList = createSelector(selectSongList, (songList) =>
    sortSongs(songList)
  )
  const selectFilteredSongList = createSelector(
    selectSortedSongList,
    selectSearchText,
    (songList, searchText) => filterSongs(songList, searchText)
  )
  const selectSongOfTheDayEnabled = createSelector(
    selectCurrentCollectionValue,
    (collectionData) => collectionData && collectionData.songOfTheDayEnabled
  )
  const selectGroups = createSelector(
    selectFilteredSongList,
    selectSongOfTheDayEnabled,
    (songs, songOfTheDayEnabled) =>
      groupSongsIntoCategories(songs, {
        songOfTheDayEnabled,
      })
  )
  const selectSongs = createSelector(selectGroups, (groups) =>
    _(groups).map('songs').flatten().value()
  )
  return { selectGroups, selectSongs }
})()

export const {
  selectSelectedSong,
  selectChartsForSelectedSong,
  selectSelectedChart,
} = (() => {
  const selectMusicSelection = (state: AppState) => state.musicSelection
  const selectSelectedSong = createSelector(
    selectMusicSelection,
    selectSongs,
    (musicSelection, songs) =>
      MusicSelection.selectedSongGivenSongs(songs)(musicSelection)
  )
  const selectChartsForSelectedSong = createSelector(
    selectSelectedSong,
    (song) => getPlayableCharts((song && song.charts) || [])
  )
  const selectSelectedChart = createSelector(
    selectMusicSelection,
    selectChartsForSelectedSong,
    (musicSelection, charts): Chart =>
      MusicSelection.selectedChartGivenCharts(charts)(musicSelection)
  )
  return {
    selectSelectedSong,
    selectChartsForSelectedSong,
    selectSelectedChart,
  }
})()

export const selectReadmeTextForSelectedSong = (state: AppState) =>
  state.currentSongReadme

export const selectOptions = (state: AppState) => state.options

export const selectPlayMode = (store: AppState) =>
  Options.playMode(store.options)

export const selectRageQuittedFlag = (store: AppState) => store.rageQuit
