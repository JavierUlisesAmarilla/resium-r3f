import {useEffect} from 'react'
import * as Resium from 'resium'
import {useZustand} from '../../store/useZustand'


export const ResiumWorld = () => {
  const {viewer} = Resium.useCesium()
  const {setResiumViewer, centerCartesian3} = useZustand()

  useEffect(() => {
    if (viewer) {
      viewer.camera.flyTo({destination: centerCartesian3, orientation: {heading: 0, pitch: -Math.PI / 4}})
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
      <Resium.Entity
        id='target'
        point={{pixelSize: 1}}
      />
    </>
  )
}
