import configureStore from 'bemuse/app/redux/configureStore'
import React from 'react'
import ResultScene from 'bemuse/app/ui/ResultScene'
import SCENE_MANAGER from 'bemuse/scene-manager'
import { Provider } from 'react-redux'

export function main () {
  let props = {
    result: {
      '1': 9999,
      '2': 999,
      '3': 99,
      '4': 9,
      'missed': 123,
      'score': 543210,
      'maxCombo': 5555,
      'accuracy': 0.97,
      'totalCombo': 11106,
      'grade': 'A',
      'deltas': [0, 0.01, 0.03, -0.03, -0.06]
    },
    chart: {
      info: {
        title: 'Test Song',
        subtitles: ['fl*cknother'],
        artist: 'iaht',
        subartists: ['obj.flicknote'],
        genre: 'Frantic Hardcore',
        level: 17
      },
      md5: '12345670123456789abcdef89abemuse'
    },
    lr2Timegate: [ 20, 40 ],
    onExit: () => alert('Exit!'),
    onReplay: () => alert('Replay!'),
    playMode: 'BM'
  }
  SCENE_MANAGER.display(
    <Provider store={configureStore()}><ResultScene {...props} /></Provider>
  ).done()
}
