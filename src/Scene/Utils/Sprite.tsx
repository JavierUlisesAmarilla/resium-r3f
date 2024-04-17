/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {Html} from '@react-three/drei'
import {Vector3} from '@react-three/fiber'
import {ReactNode, useRef} from 'react'
import * as THREE from 'three'
import {useCameraUtils} from '../../hooks/useCameraUtils'


const vec3 = new THREE.Vector3()


export type SpriteType = {
  children: ReactNode
  position?: Vector3
  zoomDistance?: number // If 0, no zoom
  onClick?: VoidFunction
}


export const Sprite = ({
  children,
  position,
  zoomDistance,
  onClick,
}: SpriteType) => {
  const groupRef = useRef<THREE.Group>(null)
  const {animateR3fZoomToTarget} = useCameraUtils()

  const onSpriteClick = async () => {
    if (zoomDistance && groupRef.current?.getWorldPosition) {
      groupRef.current.getWorldPosition(vec3)
      await animateR3fZoomToTarget(vec3, zoomDistance)
    }

    if (onClick) {
      onClick()
    }
  }

  return (
    <group
      ref={groupRef}
      position={position}
    >
      <Html
        transform
        zIndexRange={[0, 0]}
        sprite={true}
      // occlude='raycast'
      >
        <div onClick={onSpriteClick}>
          {children}
        </div>
      </Html>
    </group>
  )
}
