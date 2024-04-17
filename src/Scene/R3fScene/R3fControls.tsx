import {OrbitControls} from '@react-three/drei'
import {useEffect, useRef} from 'react'
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib'
import {useCameraUtils} from '../../hooks/useCameraUtils'
import {useZustand} from '../../store/useZustand'
import {MIN_POLAR_ANGLE_FACTOR} from '../../utils/constants'


export const R3fControls = () => {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)
  const {setR3fControlsRef} = useZustand()
  const {syncR3fToResium} = useCameraUtils()

  useEffect(() => {
    setR3fControlsRef(orbitControlsRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <OrbitControls
      ref={orbitControlsRef}
      makeDefault
      maxPolarAngle={(1 - MIN_POLAR_ANGLE_FACTOR) * Math.PI}
      minPolarAngle={MIN_POLAR_ANGLE_FACTOR * Math.PI}
      onChange={syncR3fToResium}
    />
  )
}
