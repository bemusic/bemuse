
import { Action } from 'bemuse/flux'

export const drop = new Action((e, callback) => ({ event: e, callback }))
