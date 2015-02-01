
import path from './path'

export default [
  {
    src: path('public'),
    dest: [],
  },
  {
    src: path('src'),
    dest: ['src'],
  },
  {
    src: path('spec'),
    dest: ['spec'],
  },
]
