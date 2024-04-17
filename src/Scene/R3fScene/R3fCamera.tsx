import {PerspectiveCamera} from '@react-three/drei'
import {useEffect, useRef} from 'react'
import {PerspectiveCamera as TPC} from 'three'
import {useZustand} from '../../store/useZustand'
import {DEFAULT_CAMERA_DISTANCE} from '../../utils/constants'


export const R3fCamera = () => {
  const pcRef = useRef<TPC>(null)
  const {setR3fCamera} = useZustand()

  useEffect(() => {
    setR3fCamera(pcRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PerspectiveCamera
      ref={pcRef}
      makeDefault
      position={[DEFAULT_CAMERA_DISTANCE, DEFAULT_CAMERA_DISTANCE, DEFAULT_CAMERA_DISTANCE]}
    />
  )
}
