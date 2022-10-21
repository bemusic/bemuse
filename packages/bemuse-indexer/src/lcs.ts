export function lcs(a: string, b: string) {
  let max = ''
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const cur = lcp(a, i, b, j)
      if (cur.length > max.length) max = cur
    }
  }
  return max
}

export function lcp(a: string, i: number, b: string, j: number) {
  const m = Math.min(a.length - i, b.length - j)
  let k = 0
  for (; k < m; k++) {
    if (a[k + i].toLowerCase() !== b[k + j].toLowerCase()) break
  }
  return a.substr(i, k)
}
