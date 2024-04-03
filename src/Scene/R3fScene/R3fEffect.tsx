import {Bloom, EffectComposer} from '@react-three/postprocessing'


export const R3fEffect = () => {
  return (
    <EffectComposer >
      <Bloom
        // width={1}
        // height={1}
        intensity={1}
        // radius={1}
        levels={1}
        // luminanceSmoothing={1}
        luminanceThreshold={1}
        mipmapBlur
      />
    </EffectComposer>
  )
}
