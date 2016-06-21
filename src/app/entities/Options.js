
import * as options from '../options'

export const initialState = options.DEFAULTS
export const initWithDataFromStorage = (options) => ({ ...initialState, ...options })

export const playMode = (state) => state['player.P1.mode']
