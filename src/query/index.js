
/**
 * This module exports the query string in browser.
 */

import querystring from 'querystring'
export default querystring.parse(location.search.replace(/^\?/, ''))
