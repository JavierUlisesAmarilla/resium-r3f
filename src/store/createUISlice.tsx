import {ZustandSlice} from './useZustand'


export type UISlice = {
  isSeeingApp: boolean
  setIsSeeingApp: (isSeeingApp: boolean) => void
}


export const createUISlice: ZustandSlice<UISlice> = (set) => {
  return {
    isSeeingApp: true,
    setIsSeeingApp: (isSeeingApp) => set(() => ({isSeeingApp})),
  }
}
