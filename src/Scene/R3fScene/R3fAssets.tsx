import {useZustand} from '../../store/useZustand'
import {Model} from '../Utils/Model'
import {Sprite} from '../Utils/Sprite'


export const R3fAssets = () => {
  const {isR3fCameraInSync} = useZustand()

  return isR3fCameraInSync && (
    <>
      {/* <PotreeModel
        fileName='cloud.js'
        baseUrl='http://5.9.65.151/mschuetz/potree/resources/pointclouds/weiss/subsea_equipment/'
        modelPosition={[-30, -10, -5]}
        modelRotation={[-Math.PI / 2, 0, 0]}
        modelScale={0.5}
      >
        <Sprite
          position={[5, -10, 40]}
          zoomDistance={20}
        >
          <div className='p-3 text-3xl font-bold text-white bg-black cursor-pointer opacity-60 rounded-xl hover:text-yellow-500'>Potree Model</div>
        </Sprite>
      </PotreeModel> */}
      <Model
        modelPath='models/planet_o.glb'
        rigidPosition={[5, 5, -30]}
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
