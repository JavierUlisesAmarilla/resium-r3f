/* eslint-disable react/no-unknown-property */
import {Euler, Vector3, useFrame, useThree} from '@react-three/fiber'
import {Boolean3Array, RapierRigidBody, RigidBody, RigidBodyAutoCollider, vec3} from '@react-three/rapier'
import {useGesture} from '@use-gesture/react'
import {AnimatePresence} from 'framer-motion'
import {motion} from 'framer-motion-3d'
import {ReactNode, useEffect, useRef} from 'react'
import * as THREE from 'three'
import {useCameraUtils} from '../../hooks/useCameraUtils'
import {useCustomGltf} from '../../hooks/useCustomGltf'
import {useZustand} from '../../store/useZustand'
import {AXES_LENGTH} from '../../utils/constants'


const worldPos = new THREE.Vector3()


export type ModelType = {
  modelPath: string
  children?: ReactNode
  rigidPos?: Vector3
  rigidRot?: Euler
  rigidScale?: Vector3
  modelPos?: Vector3
  modelRot?: Euler
  modelScale?: Vector3
  visible?: boolean
  usePhysics?: boolean
  colliders?: RigidBodyAutoCollider
  enabledRotations?: Boolean3Array
  enabledTranslations?: Boolean3Array
  enableZoom?: boolean
  zoomDistance?: number
  showModelAnim?: boolean
  showAxesHelper?: boolean
  useCloneGltf?: boolean
  useMotion?: boolean
}


export const Model = ({
  modelPath,
  children,
  rigidPos = [0, 0, 0],
  rigidRot = [0, 0, 0],
  rigidScale = 1,
  modelPos = [0, 0, 0],
  modelRot = [0, 0, 0],
  modelScale = 1,
  visible = true,
  usePhysics = false,
  colliders = false,
  enabledRotations = [true, true, true],
  enabledTranslations = [true, true, true],
  enableZoom = false,
  zoomDistance = 10,
  showModelAnim = true,
  showAxesHelper = false,
  useCloneGltf = false,
  useMotion = false,
}: ModelType) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const groupRef = useRef<THREE.Group>(null)
  const {camera} = useThree()
  const {preventAllEvent} = useZustand()
  const {modelScene, mixer, actions} = useCustomGltf(modelPath, useCloneGltf)
  const {animMoveToTarget} = useCameraUtils()
  const realModelScale = modelScale || 1

  const bind = useGesture({
    onPointerDown: (state) => {
      const {event} = state

      if (event.button === 0 && enableZoom && !preventAllEvent && rigidBodyRef.current && groupRef.current) { // Left
        if (usePhysics) {
          worldPos.copy(vec3(rigidBodyRef.current.translation()))
        } else {
          groupRef.current.getWorldPosition(worldPos)
        }

        const distance = camera.position.distanceTo(worldPos)

        if (distance > zoomDistance) {
          const direc = worldPos.clone().sub(camera.position).multiplyScalar((distance - (zoomDistance * 0.9)) / distance)
          const cameraTarget = camera.position.clone().add(direc)
          animMoveToTarget(cameraTarget)
        }
      }
    },
  })

  useEffect(() => {
    if (actions && showModelAnim) {
      Object.values(actions).forEach((action) => {
        action.play()
      })
    }
  }, [actions, showModelAnim])

  useFrame((_state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })

  return (
    <AnimatePresence>
      {modelScene && (usePhysics ?
        <RigidBody
          ref={rigidBodyRef}
          colliders={colliders}
          position={rigidPos || [0, 0, 0]}
          rotation={rigidRot || [0, 0, 0]}
          scale={rigidScale || 1}
          enabledRotations={enabledRotations}
          enabledTranslations={enabledTranslations}
          {...bind()}
        >
          <motion.primitive
            object={modelScene}
            position={modelPos || [0, 0, 0]}
            rotation={modelRot || [0, 0, 0]}
            visible={visible}
            initial={{
              scale: useMotion ? 0 : realModelScale,
            }}
            animate={{
              scale: realModelScale,
            }}
            exit={{
              scale: useMotion ? 0 : realModelScale,
            }}
          />
          {children}
          {showAxesHelper && <axesHelper args={[AXES_LENGTH]}/>}
        </RigidBody> :
        <group
          ref={groupRef}
          position={rigidPos || [0, 0, 0]}
          rotation={rigidRot || [0, 0, 0]}
          scale={rigidScale || 1}
        >
          <motion.primitive
            object={modelScene}
            position={modelPos || [0, 0, 0]}
            rotation={modelRot || [0, 0, 0]}
            visible={visible}
            initial={{
              scale: useMotion ? 0 : realModelScale,
            }}
            animate={{
              scale: realModelScale,
            }}
            exit={{
              scale: useMotion ? 0 : realModelScale,
            }}
            {...bind()}
          />
          {children}
          {showAxesHelper && <axesHelper args={[AXES_LENGTH]}/>}
        </group>
      )}
    </AnimatePresence>
  )
}
