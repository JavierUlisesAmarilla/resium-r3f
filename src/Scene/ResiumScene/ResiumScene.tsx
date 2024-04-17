import * as Cesium from 'cesium'
import * as Resium from 'resium'
import {ResiumViewCube} from './ResiumViewCube'
import {ResiumWorld} from './ResiumWorld'


export const ResiumScene = ({
  terrainProvider,
}: {
  terrainProvider: Cesium.CesiumTerrainProvider
}) => {
  return (
    <>
      <Resium.Viewer
        full
        animation={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        vrButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        timeline={false}
        navigationHelpButton={false}
        navigationInstructionsInitiallyVisible={false}
        scene3DOnly={false}
        shouldAnimate={false}
        useDefaultRenderLoop={true}
        showRenderLoopErrors={false}
        useBrowserRecommendedResolution={false}
        automaticallyTrackDataSourceClocks={false}
        orderIndependentTranslucency={true}
        shadows={false}
        projectionPicker={false}
        blurActiveElementOnCanvasFocus={false}
        requestRenderMode={false}
        sceneMode={Cesium.SceneMode.SCENE3D}
        terrainProvider={terrainProvider}
      >
        <ResiumWorld/>
      </Resium.Viewer>
      <ResiumViewCube/>
    </>
  )
}
