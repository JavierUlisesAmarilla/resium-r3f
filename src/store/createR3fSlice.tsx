/* eslint-disable @typescript-eslint/no-explicit-any */
import {RefObject} from 'react'
import {OrthographicCamera, PerspectiveCamera} from 'three'
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib'
import {ZustandSlice} from './useZustand'


export type R3fSlice = {
  selR3fObj: any
  setSelR3fObj: (selR3fObj: any) => void

  r3fControlsRef: RefObject<OrbitControlsImpl> | undefined
  setR3fControlsRef: (r3fControlsRef: RefObject<OrbitControlsImpl>) => void

  r3fCamera: PerspectiveCamera | OrthographicCamera | null
  setR3fCamera: (r3fCamera: PerspectiveCamera | OrthographicCamera | null) => void
}


export const createR3fSlice: ZustandSlice<R3fSlice> = (set) => {
  return {
    selR3fObj: undefined,
    setSelR3fObj: (selR3fObj) => set(() => ({selR3fObj})),

    r3fControlsRef: undefined,
    setR3fControlsRef: (r3fControlsRef) => set(() => ({r3fControlsRef})),

    r3fCamera: null,
    setR3fCamera: (r3fCamera) => set(() => ({r3fCamera})),
  }
}
