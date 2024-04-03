import {useGLTF} from '@react-three/drei'
import {useEffect, useState} from 'react'
import {AnimationMixer, Object3D} from 'three'
import {clone} from 'three/examples/jsm/utils/SkeletonUtils'
import {AnimationActionMap} from '../utils/types'


export const useCustomGltf = (gltfUrl: string, useCloneGltf: boolean = false) => {
  const [modelScene, setModelScene] = useState<Object3D>()
  const [mixer, setMixer] = useState<AnimationMixer>()
  const [actions, setActions] = useState<AnimationActionMap>()
  const gltf = useGLTF(gltfUrl)

  useEffect(() => {
    const newModelScene = useCloneGltf ? clone(gltf.scene) : gltf.scene
    const newMixer = new AnimationMixer(newModelScene)
    const newActions: AnimationActionMap = {}

    gltf.animations.forEach((animation) => {
      newActions[animation.name] = newMixer.clipAction(animation)
    })

    setModelScene(newModelScene)
    setMixer(newMixer)
    setActions(newActions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf])

  return {modelScene, mixer, actions}
}
