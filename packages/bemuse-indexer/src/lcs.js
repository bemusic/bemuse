export function lcs (a, b) {
  var max = ''
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      var cur = lcp(a, i, b, j)
      if (cur.length > max.length) max = cur
    }
  }
  return max
}

export function lcp (a, i, b, j) {
  var m = Math.min(a.length - i, b.length - j)
  for (var k = 0; k < m; k++) {
    if (a[k + i].toLowerCase() !== b[k + j].toLowerCase()) break
  }
  return a.substr(i, k)
}
