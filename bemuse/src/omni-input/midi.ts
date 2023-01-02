import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  from,
  fromEvent,
  tap,
} from 'rxjs'

import { EventListenerObject } from 'rxjs/internal/observable/fromEvent'

declare global {
  interface Navigator {
    requestMIDIAccess?(options?: MIDIAccessOptions): Promise<MIDIAccess>
  }

  interface MIDIAccessOptions {
    sysex: boolean
    software: boolean
  }

  interface MIDIAccess {
    readonly inputs: Map<string, MIDIInput>
    readonly outputs: Map<string, MIDIOutput>
    onstatechange: (event: MIDIConnectEvent) => void
  }
  interface MIDIInput extends MIDIPort {
    type: 'input'

    addEventListener(
      type: 'midimessage',
      listener:
        | ((evt: MIDIMessageEvent) => void)
        | EventListenerObject<MIDIMessageEvent>
        | null,
      options?: boolean | AddEventListenerOptions
    ): void
    removeEventListener(
      type: 'midimessage',
      listener:
        | ((evt: MIDIMessageEvent) => void)
        | EventListenerObject<MIDIMessageEvent>
        | null,
      options?: EventListenerOptions | boolean
    ): void
  }
  interface MIDIOutput extends MIDIPort {
    type: 'output'
  }
  interface MIDIPort {
    type: 'input' | 'output'
    id: string
  }
  interface MIDIConnectEvent {
    readonly port: MIDIPort
  }

  interface MIDIMessageEvent {
    readonly data: Uint8Array
    readonly target: MIDIPort | null
  }
}

function observeMidiAccess(access: MIDIAccess) {
  return new Observable<MIDIPort>((subscriber) => {
    for (const port of access.inputs.values()) {
      subscriber.next(port)
    }
    for (const port of access.outputs.values()) {
      subscriber.next(port)
    }
    access.onstatechange = (e) => {
      subscriber.next(e.port)
    }
  })
}

function requestMIDIAccess() {
  if (!navigator.requestMIDIAccess) {
    return Promise.reject(new Error('MIDI is not supported'))
  }
  return navigator.requestMIDIAccess()
}

export function getMidi川(): Observable<MIDIMessageEvent> {
  return from(requestMIDIAccess())
    .pipe(concatMap(observeMidiAccess))
    .pipe(
      catchError((e: Error) => {
        console.warn('MIDI Error:', e.stack)
        return EMPTY
      })
    )
    .pipe(concatMap(message川ForPort))
    .pipe(tap((message) => console.log('messageforport', message)))
}

function message川ForPort(port: MIDIPort): Observable<MIDIMessageEvent> {
  if (port.type !== 'input') return EMPTY
  return fromEvent<MIDIMessageEvent>(port as MIDIInput, 'midimessage')
}

export default getMidi川
