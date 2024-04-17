import {useEffect} from 'react'
import * as Resium from 'resium'
import {useZustand} from '../../store/useZustand'


export const ResiumWorld = () => {
  const {viewer} = Resium.useCesium()
  const {setResiumViewer, centerCartesian3} = useZustand()

  useEffect(() => {
    if (viewer) {
      setResiumViewer(viewer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Resium.Globe
        depthTestAgainstTerrain
      />
      <Resium.ScreenSpaceCameraController
        enableInputs={true}
        enableLook={false}
        inertiaZoom={0}
      />
      <Resium.CameraFlyTo destination={centerCartesian3}/>
      <Resium.Entity
        id='target'
        point={{pixelSize: 10}}
      />
    </>
  )
}
