import {PerspectiveCamera} from '@react-three/drei'
import {useEffect, useRef} from 'react'
import {PerspectiveCamera as TPC} from 'three'
import {useZustand} from '../../store/useZustand'


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
      position={[100, 100, 100]}
    />
  )
}
