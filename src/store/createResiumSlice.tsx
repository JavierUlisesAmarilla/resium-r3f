import * as Cesium from 'cesium'
import {ZustandSlice} from './useZustand'


export type ResiumSlice = {
  resiumViewer: Cesium.Viewer | undefined
  setResiumViewer: (resiumViewer: Cesium.Viewer) => void

  centerCartesian3: Cesium.Cartesian3
  setCenterCartesian3: (centerCartesian3: Cesium.Cartesian3) => void

  isResiumCameraBeingUsed: boolean
  setIsResiumCameraBeingUsed: (isResiumCameraBeingUsed: boolean) => void
}


export const createResiumSlice: ZustandSlice<ResiumSlice> = (set) => {
  return {
    resiumViewer: undefined,
    setResiumViewer: (resiumViewer) => set(() => ({resiumViewer})),

    centerCartesian3: Cesium.Cartesian3.fromDegrees(120.984222, 14.599512, 100),
    setCenterCartesian3: (centerCartesian3) => set(() => ({centerCartesian3})),

    isResiumCameraBeingUsed: false,
    setIsResiumCameraBeingUsed: (isResiumCameraBeingUsed) => set(() => ({isResiumCameraBeingUsed})),
  }
}
