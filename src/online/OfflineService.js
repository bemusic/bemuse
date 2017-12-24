const no = () => Promise.reject(new Error('Online services not enabled.'))

export class OfflineService {
  getCurrentUser () {
    return null
  }

  isLoggedIn () {
    return false
  }

  signUp ({ username, password, email }) {
    return no()
  }

  logIn ({ username, password }) {
    return no()
  }

  logOut () {
    return no()
  }

  submitScore (info) {
    return Promise.reject(new Error('Online services not enabled.'))
  }

  // Retrieves a record.
  //
  // Returns a record object.
  retrieveRecord (level, user) {
    return Promise.reject(new Error('Online services not enabled.'))
  }

  // Retrieves the scoreboard
  retrieveScoreboard ({ md5, playMode }) {
    return Promise.reject(new Error('Online services not enabled.'))
  }

  // Retrieve multiple records!
  retrieveMultipleRecords (items, user) {
    return Promise.reject(new Error('Online services not enabled.'))
  }
}

export default OfflineService
