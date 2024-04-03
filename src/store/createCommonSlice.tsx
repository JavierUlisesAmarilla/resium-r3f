import {ZustandSlice} from './useZustand'


export type CommonSlice = {
  preventAllEvent: boolean
  setPreventAllEvent: (preventAllEvent: boolean) => void
}


export const createCommonSlice: ZustandSlice<CommonSlice> = (set) => {
  return {
    preventAllEvent: false,
    setPreventAllEvent: (preventAllEvent) => set(() => ({preventAllEvent})),
  }
}
