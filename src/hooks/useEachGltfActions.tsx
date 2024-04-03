import {useEffect, useState} from 'react'
import {AnimationMixer} from 'three'
import {GLTF} from 'three-stdlib'
import {AnimationActionMap} from '../utils/types'


export const useEachGltfActions = (mixer: AnimationMixer | undefined, animGltf: GLTF | undefined) => {
  const [actions, setActions] = useState<AnimationActionMap>()

  useEffect(() => {
    if (!mixer || !animGltf) {
      return
    }

    const newActions: AnimationActionMap = {}
    animGltf.animations.forEach((animation) => {
      newActions[animation.name] = mixer.clipAction(animation)
    })
    setActions(newActions)
  }, [animGltf, mixer])

  return actions
}
