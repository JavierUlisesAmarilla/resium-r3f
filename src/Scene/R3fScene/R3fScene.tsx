import {BakeShadows, Preload} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {MouseEventHandler, Suspense} from 'react'
import {R3fCamera} from './R3fCamera'
import {R3fControls} from './R3fControls'
import {R3fWorld} from './R3fWorld'


export const R3fScene = ({
  onPointerDown,
  onPointerUp,
}: {
  onPointerDown: MouseEventHandler
  onPointerUp: MouseEventHandler
}) => {
  return (
    <Suspense>
      <Canvas
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <R3fCamera/>
        <R3fWorld/>
        <BakeShadows/>
        <R3fControls/>
        <Preload all/>
      </Canvas>
    </Suspense>
  )
}
