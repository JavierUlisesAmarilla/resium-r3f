import * as Cesium from 'cesium'
import {useControls} from 'leva'
import {useCallback, useEffect} from 'react'
import {MathUtils, OrthographicCamera, PerspectiveCamera} from 'three'
import {useZustand} from '../store/useZustand'
import {cesiumCartesian3ToThreePosition, normalizeAngle, threePositionToCesiumMatrix4} from '../utils/common'
import {AXES_LENGTH, CAMERA_NEAR, DEFAULT_TARGET_DISTANCE, SHOW_AXES_HELPER} from '../utils/constants'
import {controls} from '../utils/controls'


let resiumAxesHelpers: {[key: string]: Cesium.DebugModelMatrixPrimitive} = {}
const pickCartesian2 = new Cesium.Cartesian2()


export const useCameraUtils = () => {
  const {
    resiumViewer,
    r3fControlsRef,
    r3fCamera,
    centerCartesian3,
    isResiumCameraBeingUsed,
    isR3fCameraInSync, setIsR3fCameraInSync,
  } = useZustand()
  const {navigationMode} = useControls(controls)
  const resiumScene = resiumViewer?.scene
  const resiumCamera = resiumViewer?.camera
  const r3fControls = r3fControlsRef?.current

  // Synchronize field of view of r3f camera to resium camera.
  const syncFieldOfView = useCallback(() => {
    if (r3fCamera && resiumCamera) {
      if (r3fCamera instanceof PerspectiveCamera) {
        if (!(resiumCamera.frustum instanceof Cesium.PerspectiveFrustum)) {
          resiumCamera.switchToPerspectiveFrustum()
        }
        const r3fCameraAspect = r3fCamera.aspect
        const r3fCameraFov = r3fCamera.fov
        const resiumCameraFrustum = resiumCamera.frustum as Cesium.PerspectiveFrustum
        resiumCameraFrustum.near = CAMERA_NEAR

        // R3f camera's field of view is actual angle, not radians. So need to convert it to radians to synchronize with Resium camera.
        if (r3fCameraAspect < 1) { // When portrait mode
          resiumCameraFrustum.fov = Math.PI * (r3fCameraFov / 180)
        } else { // When landscape mode
          const resiumFovY = Math.PI * (r3fCameraFov / 180)
          const resiumFovX = Math.atan(Math.tan(0.5 * resiumFovY) * r3fCameraAspect) * 2
          resiumCameraFrustum.fov = resiumFovX
        }
      } else if (r3fCamera instanceof OrthographicCamera) {
        if (!(resiumCamera.frustum instanceof Cesium.OrthographicFrustum)) {
          resiumCamera.switchToOrthographicFrustum()
        }
        // This is experimental yet.
        const resiumOrthoFrustum = resiumCamera.frustum as Cesium.OrthographicFrustum
        resiumOrthoFrustum.aspectRatio = r3fCamera.right / r3fCamera.top
        resiumOrthoFrustum.width = (-r3fCamera.left + r3fCamera.right) / r3fCamera.zoom
      }
    }
  }, [r3fCamera, resiumCamera])

  // Show axes helper for convenient development. (optional)
  const devUpdateResiumAxesHelper = useCallback((key: string, cartesian3: Cesium.Cartesian3) => {
    if (resiumScene) {
      if (SHOW_AXES_HELPER && cartesian3) {
        const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian3)

        if (resiumAxesHelpers[key]) {
          resiumAxesHelpers[key].modelMatrix = modelMatrix
        } else {
          resiumAxesHelpers[key] = new Cesium.DebugModelMatrixPrimitive({modelMatrix, length: AXES_LENGTH})
          resiumScene.primitives.add(resiumAxesHelpers[key])
        }
      } else if (resiumAxesHelpers) {
        Object.values(resiumAxesHelpers).forEach((resiumAxesHelper) => {
          resiumScene.primitives.remove(resiumAxesHelper)
        })
        resiumAxesHelpers = {}
      }
    }
  }, [resiumScene])

  // Synchronize r3f camera to resium camera.
  const syncR3fToResium = useCallback(() => {
    if (resiumScene && resiumCamera && r3fControls && navigationMode === 'orbitControls') {
      resiumScene.screenSpaceCameraController.enableInputs = false
      syncFieldOfView()
      const resiumCameraTargetMatrix4 = threePositionToCesiumMatrix4(r3fControls.target, centerCartesian3)
      const heading = normalizeAngle(-1 * r3fControls.getAzimuthalAngle())
      const pitch = r3fControls.getPolarAngle() - MathUtils.degToRad(90)
      const range = r3fControls.getDistance()
      resiumCamera.lookAtTransform(resiumCameraTargetMatrix4, new Cesium.HeadingPitchRange(heading, pitch, range))
    }
  }, [centerCartesian3, navigationMode, r3fControls, resiumCamera, resiumScene, syncFieldOfView])

  // Synchronize resium camera to r3f camera.
  const syncResiumToR3f = useCallback(() => {
    if (resiumViewer && resiumScene && resiumCamera && r3fControls && r3fCamera && (navigationMode === 'mapControls' || isResiumCameraBeingUsed)) {
      syncFieldOfView()
      const canvasRect = resiumViewer.scene.canvas.getBoundingClientRect()
      pickCartesian2.x = canvasRect.width / 2
      pickCartesian2.y = canvasRect.height / 2
      const pickCartesian3 = new Cesium.Cartesian3()
      resiumScene.pickPosition(pickCartesian2, pickCartesian3)

      if (pickCartesian3.equals(Cesium.Cartesian3.ZERO)) {
        const resiumCameraDirection = new Cesium.Cartesian3()
        Cesium.Cartesian3.multiplyByScalar(resiumCamera.directionWC, DEFAULT_TARGET_DISTANCE, resiumCameraDirection)
        Cesium.Cartesian3.add(resiumCamera.positionWC, resiumCameraDirection, pickCartesian3)
      }

      const centerDistance = Cesium.Cartesian3.distance(resiumCamera.positionWC, pickCartesian3)
      const targetEntity = resiumViewer.entities.getById('target')
      if (targetEntity) {
        // @ts-expect-error - TODO
        targetEntity.position = pickCartesian3
      }
      if (centerDistance > DEFAULT_TARGET_DISTANCE) {
        Cesium.Cartesian3.lerp(resiumCamera.positionWC, pickCartesian3, DEFAULT_TARGET_DISTANCE / centerDistance, pickCartesian3)
      }
      const r3fCameraPosition = cesiumCartesian3ToThreePosition(resiumCamera.positionWC, centerCartesian3)
      r3fCamera.position.copy(r3fCameraPosition)
      const targetPosition = cesiumCartesian3ToThreePosition(pickCartesian3, centerCartesian3)
      r3fControls.target.copy(targetPosition)
      if (!isR3fCameraInSync) {
        setIsR3fCameraInSync(true)
      }
    }
  }, [centerCartesian3, isR3fCameraInSync, isResiumCameraBeingUsed, navigationMode, r3fCamera, r3fControls, resiumCamera, resiumScene, resiumViewer, setIsR3fCameraInSync, syncFieldOfView])

  useEffect(() => {
    resiumViewer?.scene.postRender.addEventListener(syncResiumToR3f)
    return () => {
      resiumViewer?.scene.postRender.removeEventListener(syncResiumToR3f)
    }
  }, [resiumViewer?.scene.postRender, syncResiumToR3f])

  useEffect(() => {
    if (centerCartesian3) {
      devUpdateResiumAxesHelper('center', centerCartesian3)
    }
  }, [centerCartesian3, devUpdateResiumAxesHelper])

  useEffect(() => {
    if (resiumViewer && resiumScene) {
      if (navigationMode === 'mapControls') {
        resiumScene.screenSpaceCameraController.enableInputs = true
        resiumViewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      } else {
        resiumScene.screenSpaceCameraController.enableInputs = false
      }
    }
  }, [navigationMode, resiumScene, resiumViewer])

  return {
    syncR3fToResium,
  }
}
