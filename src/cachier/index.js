
export default new Cachier()
export { Cachier }

function Cachier(databaseName) {

  var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                  window.mozIndexedDB || window.OIndexedDB ||
                  window.msIndexedDB

  var connection = connect()

  databaseName = databaseName || 'cachier'

  function connect() {
    return new Promise(function(resolve, reject) {
      var request = indexedDB.open(databaseName, 1)
      request.onupgradeneeded = function(event) {
        var db = event.target.result
        var store = db.createObjectStore('cachier', { keyPath: '_id' })
        store.transaction.oncomplete = function() {
          resolve(db)
        }
        store.transaction.onerror = function() {
          reject(new Error('Cannot upgrade database!'))
        }
      }
      request.onerror = function() {
        reject(new Error('Cannot request database!'))
      }
      request.onsuccess = function(event) {
        var db = event.target.result
        resolve(db)
      }
    })
  }

  return {
    connection: connection,
    save(key, blob, metadata) {
      let NO_BLOB = !!this._NO_BLOB // for testing purpose
      return connection.then(function(db) {
        return Promise.resolve().then(function tryBlob() {
          if (NO_BLOB) throw new Error('Requested non-Blob storing mode')
          var request = db.transaction('cachier', 'readwrite')
                .objectStore('cachier')
                .put({ _id: key, blob: blob, metadata: metadata })
          return trap(request)
        })
        .catch(function tryObject() {
          console.log('Cannot store as blob, store as data-URL instead.')
          return blobToObject(blob).then(function(object) {
            var request = db.transaction('cachier', 'readwrite')
                  .objectStore('cachier')
                  .put({ _id: key, blob: object, metadata: metadata })
            return trap(request)
          })
        })
      })
    },
    load(key) {
      return connection.then(function(db) {
        var request = db.transaction('cachier').objectStore('cachier').get(key)
        return trap(request).then(function() {
          var result = request.result
          return {
            blob: objectToBlob(result.blob),
            metadata: result.metadata,
          }
        })
      })
    },
    delete(key) {
      return connection.then(function(db) {
        var request = db.transaction('cachier', 'readwrite')
              .objectStore('cachier')
              .delete(key)
        return trap(request)
      })
    },
    destroyDatabase() {
      if (!connection) return Promise.resolve()
      return connection.then(function(db) {
        db.close()
      }).then(function() {
        let request = indexedDB.deleteDatabase(databaseName)
        return trap(request)
      }).tap(function() {
        connection = null
      })
    },
  }

  function trap(request) {
    return new Promise(function(resolve, reject) {
      request.onerror = function() {
        reject(new Error('IndexedDB Error: ' + request.error))
      }
      request.onblocked = function() {
        console.log(request)
        reject(new Error('IndexedDB Blocked: ' + request))
      }
      request.onsuccess = function(event) {
        resolve(event)
      }
    })
  }

  function blobToObject(blob) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader()
      reader.onload = function() {
        resolve({ buffer: reader.result, type: blob.type })
      }
      reader.onerror = function() {
        reject(new Error('Unable to convert blob to object!'))
      }
      reader.readAsArrayBuffer(blob)
    })
  }

  function objectToBlob(object) {
    if (object instanceof Blob) {
      return object
    } else if (object.buffer) {
      return new Blob([object.buffer], { type: object.type })
    }
  }

}


