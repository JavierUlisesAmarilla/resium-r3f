import {RefObject} from 'react'
import {OrthographicCamera, PerspectiveCamera} from 'three'
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib'
import {ZustandSlice} from './useZustand'


export type R3fSlice = {
  r3fControlsRef: RefObject<OrbitControlsImpl> | undefined
  setR3fControlsRef: (r3fControlsRef: RefObject<OrbitControlsImpl>) => void

  r3fCamera: PerspectiveCamera | OrthographicCamera | null
  setR3fCamera: (r3fCamera: PerspectiveCamera | OrthographicCamera | null) => void

  isR3fCameraInSync: boolean
  setIsR3fCameraInSync: (isR3fCameraInSync: boolean) => void
}


export const createR3fSlice: ZustandSlice<R3fSlice> = (set) => {
  return {
    r3fControlsRef: undefined,
    setR3fControlsRef: (r3fControlsRef) => set(() => ({r3fControlsRef})),

    r3fCamera: null,
    setR3fCamera: (r3fCamera) => set(() => ({r3fCamera})),

    isR3fCameraInSync: false,
    setIsR3fCameraInSync: (isR3fCameraInSync) => set(() => ({isR3fCameraInSync})),
  }
}
