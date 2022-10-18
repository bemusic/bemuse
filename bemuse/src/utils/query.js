// :doc:
// This module exports the query string in browser.
//
// Example::
//
//    import query from 'bemuse/utils/query'
//    alert(query.mode)

export default Object.fromEntries(
  new URLSearchParams(location.search).entries()
)
