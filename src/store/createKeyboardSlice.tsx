import {ZustandSlice} from './useZustand'


export type KeyboardSlice = {
  isFront: boolean
  setIsFront: (isFront: boolean) => void

  isBack: boolean
  setIsBack: (isBack: boolean) => void

  isLeft: boolean
  setIsLeft: (isLeft: boolean) => void

  isRight: boolean
  setIsRight: (isRight: boolean) => void

  isFast: boolean
  setIsFast: (isFast: boolean) => void

  isGrab: boolean
  setIsGrab: (isGrab: boolean) => void

  isJump: boolean
  setIsJump: (isJump: boolean) => void
}


export const createKeyboardSlice: ZustandSlice<KeyboardSlice> = (set) => {
  return {
    isFront: false,
    setIsFront: (isFront) => set(() => ({isFront})),

    isBack: false,
    setIsBack: (isBack) => set(() => ({isBack})),

    isLeft: false,
    setIsLeft: (isLeft) => set(() => ({isLeft})),

    isRight: false,
    setIsRight: (isRight) => set(() => ({isRight})),

    isFast: false,
    setIsFast: (isFast) => set(() => ({isFast})),

    isGrab: false,
    setIsGrab: (isGrab) => set(() => ({isGrab})),

    isJump: false,
    setIsJump: (isJump) => set(() => ({isJump})),
  }
}
