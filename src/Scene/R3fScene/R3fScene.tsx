import {BakeShadows, Preload} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {useControls} from 'leva'
import {MouseEventHandler, Suspense} from 'react'
import {controls} from '../../utils/controls'
import {R3fCamera} from './R3fCamera'
import {R3fControls} from './R3fControls'
import {R3fLight} from './R3fLight'
import {R3fWorld} from './R3fWorld'


export const R3fScene = ({
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  onPointerDown: MouseEventHandler
  onPointerMove: MouseEventHandler
  onPointerUp: MouseEventHandler
}) => {
  const {navigationMode} = useControls(controls)

  return (
    <Suspense>
      <Canvas
        className={`${navigationMode !== 'orbitControls' && '!pointer-events-none'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <R3fLight/>
        <R3fCamera/>
        <R3fControls/>
        <R3fWorld/>
        <BakeShadows/>
        <Preload all/>
      </Canvas>
    </Suspense>
  )
}
