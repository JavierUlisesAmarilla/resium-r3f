import * as Cesium from 'cesium'
import {useEffect, useState} from 'react'
import {Scene} from './Scene/Scene'


export const App = () => {
  const [terrainProvider, setTerrainProvider] = useState<Cesium.CesiumTerrainProvider>()

  useEffect(() => {
    Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true,
    }).then(setTerrainProvider)
  }, [])

  return terrainProvider && (
    <Scene
      className='relative flex flex-col w-full h-full'
      terrainProvider={terrainProvider}
    />
  )
}
