import {GetState, SetState, create} from 'zustand'
import {CommonSlice, createCommonSlice} from './createCommonSlice'
import {KeyboardSlice, createKeyboardSlice} from './createKeyboardSlice'
import {MouseSlice, createMouseSlice} from './createMouseSlice'
import {R3fSlice, createR3fSlice} from './createR3fSlice'
import {ResiumSlice, createResiumSlice} from './createResiumSlice'
import {UISlice, createUISlice} from './createUISlice'


export type ZustandState = CommonSlice & KeyboardSlice & MouseSlice & ResiumSlice & UISlice & R3fSlice


export type ZustandSlice<T> = (
  set: SetState<ZustandState>,
  get: GetState<ZustandState>
) => T


export const useZustand = create<ZustandState>((set, get) => ({
  ...createCommonSlice(set, get),
  ...createKeyboardSlice(set, get),
  ...createMouseSlice(set, get),
  ...createResiumSlice(set, get),
  ...createR3fSlice(set, get),
  ...createUISlice(set, get),
}))
