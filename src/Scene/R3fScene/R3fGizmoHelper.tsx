/* eslint-disable @typescript-eslint/no-explicit-any */
import {GizmoHelper, GizmoViewcube} from '@react-three/drei'
import {useCameraUtils} from '../../hooks/useCameraUtils'
import {useZustand} from '../../store/useZustand'


let timeout: any


export const R3fGizmoHelper = () => {
  const {selR3fObj} = useZustand()
  const {animCloseToObj} = useCameraUtils()

  const closeToSelObj = () => {
    animCloseToObj(selR3fObj)
  }

  const onUpdateEnd = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    timeout = setTimeout(closeToSelObj, 100)
  }

  return (
    <GizmoHelper
      alignment='top-right'
      onUpdate={onUpdateEnd}
    >
      <GizmoViewcube
        hoverColor='red'
        textColor='black'
      />
    </GizmoHelper>
  )
}
