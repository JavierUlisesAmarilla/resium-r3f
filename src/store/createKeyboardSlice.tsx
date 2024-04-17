import {ZustandSlice} from './useZustand'


export type KeyboardSlice = {
  isForward: boolean
  setIsForward: (isForward: boolean) => void

  isBackward: boolean
  setIsBackward: (isBackward: boolean) => void

  isLeft: boolean
  setIsLeft: (isLeft: boolean) => void

  isRight: boolean
  setIsRight: (isRight: boolean) => void

  isUpward: boolean
  setIsUpward: (isUpward: boolean) => void

  isDownward: boolean
  setIsDownward: (isDownward: boolean) => void
}


export const createKeyboardSlice: ZustandSlice<KeyboardSlice> = (set) => {
  return {
    isForward: false,
    setIsForward: (isForward) => set(() => ({isForward})),

    isBackward: false,
    setIsBackward: (isBackward) => set(() => ({isBackward})),

    isLeft: false,
    setIsLeft: (isLeft) => set(() => ({isLeft})),

    isRight: false,
    setIsRight: (isRight) => set(() => ({isRight})),

    isUpward: false,
    setIsUpward: (isUpward) => set(() => ({isUpward})),

    isDownward: false,
    setIsDownward: (isDownward) => set(() => ({isDownward})),
  }
}
