
// This file holds the glob patterns for source code files.
//

import path from './path'

export let javascripts = [
  path('src', '**', '*.js'),
  path('tasks', '**', '*.js'),
  path('config', '**', '*.js'),
]

