
import SCENE_MANAGER    from 'bemuse/scene-manager'
import React            from 'react'
import ResultScene      from 'bemuse/app/ui/result-scene'

export function main() {
  let props = {
    result: {
      '1': 9999,
      '2': 999,
      '3': 99,
      '4': 9,
      'missed': 123,
      'score': 456789,
      'maxCombo': 5555,
      'accuracy': 0.97,
      'grade': 'A',
    },
    chart: {
      info: {
        title: 'Test Song',
        subtitles: ['fl*cknother'],
        artist: 'iaht',
        subartists: ['obj.flicknote'],
        genre: 'Frantic Hardcore',
        level: 17,
      },
      md5: '12345670123456789abcdef89abemuse',
    },
    onExit: () => alert('Exit!'),
    playMode: 'BM',
  }
  SCENE_MANAGER.display(React.createElement(ResultScene, props)).done()
}
