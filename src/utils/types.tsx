import {AnimationAction} from 'three'


export type AnimationActionMap = {
  [key: string]: AnimationAction
}


export type AnimationMixerEvent = {
  action: AnimationAction
  loopDelta: number
}
