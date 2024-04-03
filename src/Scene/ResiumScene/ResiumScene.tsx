import {Ion, SceneMode} from 'cesium'
import {Viewer} from 'resium'
import {ResiumWorld} from './ResiumWorld'


// eslint-disable-next-line max-len
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YmZhMWZkYy01ZTZjLTQ2NWYtYTkyNi0yZTk5MjcwMzIwZjMiLCJpZCI6MTIwOTI3LCJpYXQiOjE2NzMzNjU5MDV9.t8oV9N6iImPQNUOQm-T-EE3VKyh65U6pGbv5_m0Kx80'


export const ResiumScene = ({
  assetId,
}: {
  assetId: number
}) => {
  return (
    <Viewer
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
      sceneMode={SceneMode.SCENE3D}
    >
      <ResiumWorld assetId={assetId}/>
    </Viewer>
  )
}
