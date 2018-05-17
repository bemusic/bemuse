
import Promise from 'bluebird'
import meow from 'meow'
import { packIntoBemuse } from './packer'
import { index }          from './indexer'
import * as Server        from './server'

let commands = [
  {
    name: 'index',
    hints: '[-r]',
    description: 'Index BMS files in current directory',
    handle(args) {
      let recursive = args.flags['r']
      return index('.', { recursive })
    },
  },
  {
    name: 'pack',
    hints: '<path>',
    description: 'Packs sounds and BGAs into assets folder',
    handle(args) {
      let dir = args.input[0]
      if (!dir) throw new Error('Please specify the directory!')
      return packIntoBemuse(dir)
    },
  },
  {
    name: 'server',
    hints: '<path>',
    description: 'Serves a Bemuse server (no indexing or conversion)',
    handle(args) {
      let dir = args.input[0]
      if (!dir) throw new Error('Please specify the directory!')
      return Server.start(dir, args.flags.port || args.flags.p)
    },
  },
]

function main(args) {
  let targetCommand = args.input.shift()
  for (let command of commands) {
    if (command.name === targetCommand) {
      return command.handle(args)
    }
  }
  if (targetCommand) {
    console.error('Error: Unrecognized command.')
  } else {
    console.error('This is bemuse-tools v' + require('../package').version)
  }
  return args.showHelp()
}

function getHelpText(command) {
  return command.name + ' ' + command.hints + ' — ' + command.description
}

Promise.resolve(main(meow({
  help: commands.map(getHelpText).join('\n'),
  pkg: require('../package.json')
}))).done()
