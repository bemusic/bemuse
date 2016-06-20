
import * as options from '../options'

export const initialState = options.DEFAULTS
export const initWithDataFromStorage = (options) => ({ ...initialState, ...options })

export const gameMode = (state) => state['player.P1.mode']
