import {PotreeModel} from '../../Utils/PotreeModel'


export const Assets = () => {
  return (
    <>
      <PotreeModel
        fileName='cloud.js'
        baseUrl='http://5.9.65.151/mschuetz/potree/resources/pointclouds/faro/westend_palais/'
        modelPos={[-180, -85, 100]}
        modelRot={[-Math.PI / 2, 0, 0]}
        modelScale={1}
      />
    </>
  )
}
