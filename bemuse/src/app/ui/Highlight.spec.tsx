import { Highlight } from './Highlight'
import React from 'react'
import { expect } from 'chai'
import { renderToStaticMarkup } from 'react-dom/server'

const render = (text: string, highlight?: string) =>
  renderToStaticMarkup(<Highlight text={text} highlight={highlight} />)
const hl = (s: string) => `<span class="MusicListItemのhighlight">${s}</span>`

describe('Highlight', () => {
  it('returns the text when there is no match', () => {
    expect(render('Exargon', 'zz')).to.equal('Exargon')
    expect(render('Exargon')).to.equal('Exargon')
  })

  it('highlights a match at the start', () => {
    expect(render('Dreamer', 'dr')).to.equal(hl('Dr') + 'eamer')
  })

  it('highlights a match in the middle', () => {
    expect(render('Exargon', 'arg')).to.equal('Ex' + hl('arg') + 'on')
  })

  it('highlights every match', () => {
    expect(render('Dr. Drum', 'dr')).to.equal(hl('Dr') + '. ' + hl('Dr') + 'um')
  })
})
