import * as Cesium from 'cesium'
import {useEffect, useState} from 'react'
import {Scene} from './Scene/Scene'


export const One = () => {
  const [terrainProvider, setTerrainProvider] = useState<Cesium.CesiumTerrainProvider>()
  const [tilesetUrl, setTilesetUrl] = useState<Cesium.IonResource>()

  useEffect(() => {
    Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true,
    }).then(setTerrainProvider)
    Cesium.IonResource.fromAssetId(2482359).then(setTilesetUrl)
  }, [])

  return terrainProvider && tilesetUrl && (
    <Scene
      className='relative flex flex-col w-full h-full'
      terrainProvider={terrainProvider}
      tilesetUrl={tilesetUrl}
    />
  )
}
