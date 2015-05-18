
import { Action, Store }        from 'bemuse/flux'

export const drop = new Action((e, callback) => ({ event: e, callback }))
