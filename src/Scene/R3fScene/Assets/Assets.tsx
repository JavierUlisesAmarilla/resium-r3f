import {Model} from '../../Utils/Model'
import {PotreeModel} from '../../Utils/PotreeModel'
import {Sprite} from '../../Utils/Sprite'
import {CubeSelector} from './CubeSelector'


export const Assets = () => {
  return (
    <>
      <CubeSelector/>
      <PotreeModel
        fileName='cloud.js'
        baseUrl='http://5.9.65.151/mschuetz/potree/resources/pointclouds/weiss/subsea_equipment/'
        modelPos={[-30, -10, -5]}
        modelRot={[-Math.PI / 2, 0, 0]}
        modelScale={0.5}
      >
        <Sprite
          position={[5, -10, 40]}
          zoomDistance={20}
        >
          <div className='p-3 text-3xl font-bold text-white bg-black cursor-pointer opacity-60 rounded-xl hover:text-yellow-500'>Potree Model</div>
        </Sprite>
      </PotreeModel>
      <Model
        modelPath='models/planet_o.glb'
        rigidPos={[5, 5, -30]}
        rigidScale={0.05}
      >
        <Sprite
          position={[0, 120, 0]}
          zoomDistance={20}
        >
          <div className='p-3 text-3xl font-bold text-white bg-black cursor-pointer opacity-60 rounded-xl hover:text-yellow-500'>GLB Model</div>
        </Sprite>
      </Model>
    </>
  )
}
