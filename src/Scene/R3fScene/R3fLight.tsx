/* eslint-disable react/no-unknown-property */
import {LIGHT_OFFSET} from '../../utils/constants'
import {LightPoint} from './R3fUtils'


export const R3fLight = () => {
  return (
    <>
      <pointLight
        position={[LIGHT_OFFSET, LIGHT_OFFSET, LIGHT_OFFSET]}
        color='#FFF'
        decay={0}
        distance={0}
        intensity={0.01}
        power={20}
      >
        <LightPoint/>
      </pointLight>
      <pointLight
        position={[-LIGHT_OFFSET, -LIGHT_OFFSET, -LIGHT_OFFSET]}
        color='#FFF'
        decay={0}
        distance={0}
        intensity={0.01}
        power={20}
      >
        <LightPoint/>
      </pointLight>
    </>
  )
}
