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
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import createReducer from './createReducer'

import _ from 'lodash'
import sortSongs from '../interactors/sortSongs'
import filterSongs from '../interactors/filterSongs'
import groupSongsIntoCategories from '../interactors/groupSongsIntoCategories'
import getPlayableCharts from '../interactors/getPlayableCharts'

// Actions
export const COLLECTION_LOADING_BEGAN = 'COLLECTION_LOADING_BEGAN'
export const COLLECTION_LOADING_ERRORED = 'COLLECTION_LOADING_ERRORED'
export const COLLECTION_LOADED = 'COLLECTION_LOADED'
export const CUSTOM_SONG_LOAD_STARTED = 'CUSTOM_SONG_LOAD_STARTED'
export const CUSTOM_SONG_LOG_EMITTED = 'CUSTOM_SONG_LOG_EMITTED'
export const CUSTOM_SONG_LOADED = 'CUSTOM_SONG_LOADED'
export const MUSIC_SEARCH_TEXT_TYPED = 'MUSIC_SEARCH_TEXT_TYPED'
export const MUSIC_SEARCH_TEXT_INITIALIZED = 'MUSIC_SEARCH_TEXT_INITIALIZED'
export const MUSIC_SEARCH_DEBOUNCED = 'MUSIC_SEARCH_DEBOUNCED'
export const MUSIC_SONG_SELECTED = 'MUSIC_SONG_SELECTED'
export const MUSIC_CHART_SELECTED = 'MUSIC_CHART_SELECTED'
export const OPTIONS_LOADED_FROM_STORAGE = 'OPTIONS_LOADED_FROM_STORAGE'
export const README_LOADING_STARTED = 'README_LOADING_STARTED'
export const README_LOADED = 'README_LOADED'
export const README_LOADING_ERRORED = 'README_LOADING_ERRORED'

// Reducer
export const reducer = combineReducers({
  collections: createReducer(Collections.initialState, {
    [COLLECTION_LOADING_BEGAN]: (action) => (
      Collections.beginLoading(action.url)
    ),
    [COLLECTION_LOADING_ERRORED]: (action) => (
      Collections.completeLoading(action.url, action.error)
    ),
    [COLLECTION_LOADED]: (action) => (
      Collections.completeLoading(action.url, action.data)
    ),
  }),
  customSongLoadState: createReducer(LoadState.initCompletedWithValue(null), {
    [CUSTOM_SONG_LOAD_STARTED]: (action) => (
      LoadState.beginLoading
    ),
    [CUSTOM_SONG_LOADED]: (action) => (
      LoadState.completeWithValue()
    )
  }),
  customSongs: createReducer([ ], {
    [CUSTOM_SONG_LOADED]: (action) => (state) => [ action.song ]
  }),
  customSongLoaderLog: createReducer(null, {
    [CUSTOM_SONG_LOAD_STARTED]: (action) => (state) => [ ],
    [CUSTOM_SONG_LOG_EMITTED]: (action) => (state) => state && [ ...state, action.text ],
    [CUSTOM_SONG_LOADED]: (action) => (state) => null
  }),
  currentCollection: createReducer('', {
    [COLLECTION_LOADING_BEGAN]: (action) => (state) => (state === ''
      ? action.url
      : state
    )
  }),
  musicSearchText: createReducer(MusicSearchText.initialState, {
    [MUSIC_SEARCH_TEXT_TYPED]: (action) => MusicSearchText.handleTextType(action.text),
    [MUSIC_SEARCH_DEBOUNCED]: (action) => MusicSearchText.handleDebounce,
    [MUSIC_SEARCH_TEXT_INITIALIZED]: (action) => MusicSearchText.setText(action.text)
  }),
  musicSelection: createReducer(MusicSelection.initialState, {
    [CUSTOM_SONG_LOADED]: (action) => (
      MusicSelection.selectSong(action.song.id)
    ),
    [MUSIC_SONG_SELECTED]: (action) => (
      MusicSelection.selectSong(action.songId)
    ),
    [MUSIC_CHART_SELECTED]: (action) => (
      MusicSelection.selectChart(action.songId, action.chartId, action.chartLevel)
    ),
  }),
  options: createReducer(Options.initialState, {
    [OPTIONS_LOADED_FROM_STORAGE]: (action) => (state) => (
      Options.initWithDataFromStorage(action.options)
    )
  }),
  currentSongReadme: createReducer('Omachi kudasai…', {
    [README_LOADING_STARTED]: (action) => (state) => 'Omachi kudasai…',
    [README_LOADING_ERRORED]: (action) => (state) => 'Cannot download ' + action.url,
    [README_LOADED]: (action) => (state) => action.text
  })
})

// Selectors
export const selectCurrentCollectionUrl = (state) => (
  state.currentCollection
)

export const selectCurrentCollection = createSelector(
  state => state.collections,
  selectCurrentCollectionUrl,
  (collections, currentCollection) => (
    Collections.getCollectionByUrl(currentCollection)(collections)
  )
)

export const selectCustomSongLoaderLog = state => state.customSongLoaderLog

export const selectIsCurrentCollectionLoading = (state) => (
  LoadState.isLoading(selectCurrentCollection(state))
)

export const selectCurrentCorrectionLoadError = (state) => (
  LoadState.error(selectCurrentCollection(state))
)

export const selectCurrentCollectionValue = (state) => (
  LoadState.value(selectCurrentCollection(state))
)

export const selectSearchInputText = (state) => (
  MusicSearchText.inputText(state.musicSearchText)
)

export const selectSearchText = (state) => (
  MusicSearchText.searchText(state.musicSearchText)
)

export const { selectGroups, selectSongs } = (() => {
  const selectSongListFromCurrentCollection = createSelector(
    selectCurrentCollectionValue,
    (collectionData) => collectionData && collectionData.songs || [ ]
  )
  const selectSongList = createSelector(
    selectSongListFromCurrentCollection,
    (state) => state.customSongs,
    (songList, customSongs) => [ ...customSongs, ...songList ]
  )
  const selectSortedSongList = createSelector(
    selectSongList,
    songList => sortSongs(songList)
  )
  const selectFilteredSongList = createSelector(
    selectSortedSongList,
    selectSearchText,
    (songList, searchText) => filterSongs(songList, searchText)
  )
  const selectGroups = createSelector(
    selectFilteredSongList,
    groupSongsIntoCategories
  )
  const selectSongs = createSelector(
    selectGroups,
    groups => _(groups).map('songs').flatten().value()
  )
  return { selectGroups, selectSongs }
})()

export const { selectSelectedSong, selectChartsForSelectedSong, selectSelectedChart } = (() => {
  const selectMusicSelection = (state) => (
    state.musicSelection
  )
  const selectSelectedSong = createSelector(
    selectMusicSelection,
    selectSongs,
    (musicSelection, songs) => MusicSelection.selectedSongGivenSongs(songs)(musicSelection)
  )
  const selectChartsForSelectedSong = createSelector(
    selectSelectedSong,
    (song) => getPlayableCharts((song && song.charts) || [ ])
  )
  const selectSelectedChart = createSelector(
    selectMusicSelection,
    selectChartsForSelectedSong,
    (musicSelection, charts) => MusicSelection.selectedChartGivenCharts(charts)(musicSelection)
  )
  return { selectSelectedSong, selectChartsForSelectedSong, selectSelectedChart }
})()

export const selectReadmeTextForSelectedSong = (state) => state.currentSongReadme

export const selectPlayMode = (store) => (
  Options.playMode(store.options)
)
