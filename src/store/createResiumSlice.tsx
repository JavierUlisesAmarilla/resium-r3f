import {Cartesian3, Viewer} from 'cesium'
import {ZustandSlice} from './useZustand'


export type ResiumSlice = {
  resiumViewer: Viewer | undefined
  setResiumViewer: (resiumViewer: Viewer | undefined) => void

  centerCart3: Cartesian3 | undefined
  setCenterCart3: (centerCart3: Cartesian3) => void
}


export const createResiumSlice: ZustandSlice<ResiumSlice> = (set) => {
  return {
    resiumViewer: undefined,
    setResiumViewer: (resiumViewer) => set(() => ({resiumViewer})),

    centerCart3: undefined,
    setCenterCart3: (centerCart3) => set(() => ({centerCart3})),
  }
}
