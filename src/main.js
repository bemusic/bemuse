
import Promise from 'bluebird'
import meow from 'meow'
import { packIntoBemuse } from './packer'
import { index }          from './indexer'

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
]

function main(args) {
  let targetCommand = args.input.shift()
  for (let command of commands) {
    if (command.name === targetCommand) {
      return command.handle(args)
    }
  }
  console.error('Error: Unrecognized command.')
  return args.showHelp()
}

function getHelpText(command) {
  return command.name + ' ' + command.hints + ' — ' + command.description
}

Promise.resolve(main(meow({
  help: commands.map(getHelpText).join('\n'),
  pkg: require('../package.json')
}))).done()
