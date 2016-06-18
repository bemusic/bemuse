
// HACK: This is only here to allow old Bacon.js-based code to access the store
// state to provide a smoother migration path!
// Only legacy code are allowed to access this file!!
//
// This code here should be moved to index.js.

import configureStore from './configureStore'

export const store = configureStore()
export default store
