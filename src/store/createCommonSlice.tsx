import {ZustandSlice} from './useZustand'


export type CommonSlice = {
  areAllEventsOnLockDown: boolean
  setAreAllEventsOnLockDown: (areAllEventsOnLockDown: boolean) => void
}


export const createCommonSlice: ZustandSlice<CommonSlice> = (set) => {
  return {
    areAllEventsOnLockDown: false,
    setAreAllEventsOnLockDown: (areAllEventsOnLockDown) => set(() => ({areAllEventsOnLockDown})),
  }
}
