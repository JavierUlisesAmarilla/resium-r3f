import {BakeShadows, Preload} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {useControls} from 'leva'
import {MouseEventHandler, Suspense} from 'react'
import {controls} from '../../utils/controls'
import {R3fCamera} from './R3fCamera'
import {R3fControls} from './R3fControls'
import {R3fGizmoHelper} from './R3fGizmoHelper'
import {R3fWorld} from './R3fWorld'


export const R3fScene = ({
  onPointerDown,
  onPointerUp,
}: {
  onPointerDown: MouseEventHandler
  onPointerUp: MouseEventHandler
}) => {
  const {useResium} = useControls(controls)

  return (
    <Suspense>
      <Canvas
        className={`${useResium && 'peni'}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <R3fCamera/>
        <R3fWorld/>
        <BakeShadows/>
        <R3fControls/>
        <R3fGizmoHelper/>
        <Preload all/>
      </Canvas>
    </Suspense>
  )
}
