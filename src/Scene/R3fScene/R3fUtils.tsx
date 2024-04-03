/* eslint-disable react/no-unknown-property */
import {meshBounds} from '@react-three/drei'
import {LIGHT_RADIUS} from '../../utils/constants'


export const LightPoint = () => {
  return (
    <mesh raycast={meshBounds}>
      <sphereBufferGeometry args={[LIGHT_RADIUS]}/>
      <meshStandardMaterial color='red'/>
    </mesh>
  )
}
