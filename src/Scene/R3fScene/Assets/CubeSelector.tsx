
/* eslint-disable react/no-unknown-property */
import {Edges, TransformControls} from '@react-three/drei'
import {useControls} from 'leva'
import {useRef, useState} from 'react'
import {Mesh, Vector3} from 'three'
import {useCameraUtils} from '../../../hooks/useCameraUtils'
import {useZustand} from '../../../store/useZustand'
import {controls} from '../../../utils/controls'


const vec3 = new Vector3()


export const CubeSelector = () => {
  const cuebRef = useRef<Mesh>(null)
  const {selR3fObj, setSelR3fObj} = useZustand()
  const [isSelected, setIsSelected] = useState(false)
  const {animLookAt} = useCameraUtils()
  const {transformMode} = useControls(controls)
  const mode = transformMode as 'translate' | 'rotate' | 'scale'

  const toggleSelect = () => {
    if (selR3fObj) {
      setSelR3fObj(undefined)
      setIsSelected(false)
    } else if (cuebRef.current) {
      cuebRef.current.getWorldPosition(vec3)
      animLookAt(vec3)
      setSelR3fObj(cuebRef.current)
      setIsSelected(true)
    }
  }

  return (
    <TransformControls
      makeDefault
      mode={mode}
      position={[0, 1, 0]}
      enabled={isSelected}
      showX={isSelected}
      showY={isSelected}
      showZ={isSelected}
    >
      <mesh
        ref={cuebRef}
        onClick={toggleSelect}
      >
        <boxGeometry args={[2, 2, 2]}/>
        <meshStandardMaterial
          color='red'
          opacity={0.5}
          transparent
        />
        {isSelected &&
          <Edges
            scale={1.1}
            color='white'
          />
        }
      </mesh>
    </TransformControls>
  )
}
