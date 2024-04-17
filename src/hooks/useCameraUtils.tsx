import * as Cesium from 'cesium'
import gsap from 'gsap'
import {useControls} from 'leva'
import {useCallback, useEffect} from 'react'
import {Box3, MathUtils, Mesh, OrthographicCamera, PerspectiveCamera, Vector3} from 'three'
import {useZustand} from '../store/useZustand'
import {cesiumCartesian3ToThreePosition, getAngle, getCenterPosition, normalizeAngle, threePositionToCesiumMatrix4} from '../utils/common'
import {ANGLE_TOLERANCE_FACTOR, ANIM_DURATION, AXES_LENGTH, CAMERA_NEAR, DEFAULT_CAMERA_DISTANCE, DEFAULT_TARGET_DISTANCE, ROT_ANIM_FACTOR, SHOW_AXES_HELPER} from '../utils/constants'
import {controls} from '../utils/controls'


let resiumAxesHelpers: {[key: string]: Cesium.DebugModelMatrixPrimitive} = {}
const box3 = new Box3()
const vector3 = new Vector3()
const pickCartesian2 = new Cesium.Cartesian2()


export const useCameraUtils = () => {
  const {
    resiumViewer,
    r3fControlsRef,
    r3fCamera,
    areAllEventsOnLockDown, setAreAllEventsOnLockDown,
    centerCartesian3,
    tileset,
    isResiumCameraBeingUsed, setIsResiumCameraBeingUsed,
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

  // Make r3f camera look at the given target smoothly with animation.
  const animateR3fLookAt = async (target: Vector3) => {
    if (r3fControls && !areAllEventsOnLockDown && r3fCamera) {
      setAreAllEventsOnLockDown(true)
      const angleTo = getAngle(r3fControls.target, r3fCamera.position, target)
      await gsap.timeline().to(r3fControls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: angleTo > Math.PI * ANGLE_TOLERANCE_FACTOR ? ANIM_DURATION * ROT_ANIM_FACTOR : 0,
      })
      setAreAllEventsOnLockDown(false)
    }
  }

  // Zoom and rotate r3f camera to the given target smoothly with animation.
  const animateR3fZoomToTarget = async (target: Vector3, zoomDistance = 0) => {
    await animateR3fLookAt(target)

    if (!areAllEventsOnLockDown && r3fCamera) {
      setAreAllEventsOnLockDown(true)
      const direction = target.sub(r3fCamera.position)
      const directionLength = direction.length()
      const scale = (directionLength - zoomDistance) / directionLength
      direction.multiplyScalar(scale)
      const moveTarget = r3fCamera.position.clone().add(direction)
      await gsap.timeline().to(r3fCamera.position, {
        x: moveTarget.x,
        y: moveTarget.y,
        z: moveTarget.z,
        duration: ANIM_DURATION,
      })
      setAreAllEventsOnLockDown(false)
    }
  }

  // Zoom and rotate r3f camera to the given object smoothly with animation.
  const animateR3fZoomToObject = async (obj: Mesh) => {
    box3.setFromObject(obj)
    const maxSize = (box3.max.x - box3.min.x + box3.max.y - box3.min.y + box3.max.z - box3.min.z) / 2
    obj.getWorldPosition(vector3)
    await animateR3fZoomToTarget(vector3, maxSize)
  }

  // Zoom and rotate r3f camera to the default position smoothly with animation.
  const animateR3fZoomToDefault = async () => {
    await animateR3fLookAt(new Vector3(0, 0, 0))

    if (!areAllEventsOnLockDown && r3fCamera) {
      setAreAllEventsOnLockDown(true)
      await gsap.timeline().to(r3fCamera.position, {
        x: DEFAULT_CAMERA_DISTANCE,
        y: DEFAULT_CAMERA_DISTANCE,
        z: DEFAULT_CAMERA_DISTANCE,
        duration: ANIM_DURATION,
      })
      setAreAllEventsOnLockDown(false)
    }
  }

  const flyResiumCameraToEntity = (entityId: string, height = 30) => {
    if (!resiumViewer) {
      return
    }
    const entity = resiumViewer.entities.getById(entityId)
    if (!entity) {
      return
    }
    let entityPosition

    if (entity.polygon) {
      const positionArr = entity.polygon.hierarchy?.getValue(resiumViewer.clock.currentTime).positions
      entityPosition = getCenterPosition(positionArr)
    }

    setIsResiumCameraBeingUsed(true)

    if (entityPosition) {
      const entityCartographic = Cesium.Cartographic.fromCartesian(entityPosition)
      const targetPosition = Cesium.Cartesian3.fromRadians(entityCartographic.longitude, entityCartographic.latitude, entityCartographic.height + height)
      resiumViewer.camera.flyTo({
        destination: targetPosition,
        maximumHeight: 0,
        complete: () => {
          setIsResiumCameraBeingUsed(false)
        },
      })
    } else {
      resiumViewer.flyTo(entity, {maximumHeight: 0}).then(() => {
        setIsResiumCameraBeingUsed(false)
      })
    }
  }

  // Zoom in or out r3f camera and synchronize to cesium camera.
  const zoomR3f = (factor: number) => {
    if (r3fControls && r3fCamera) {
      const direction = r3fControls.target.clone().sub(r3fCamera.position).multiplyScalar(factor)
      r3fCamera.position.add(direction)
    }
  }

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
    if (resiumScene) {
      if (navigationMode === 'mapControls') {
        resiumScene.screenSpaceCameraController.enableInputs = true
        if (tileset) {
          resiumViewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        }
      } else {
        resiumScene.screenSpaceCameraController.enableInputs = false
      }
    }
  }, [navigationMode, resiumScene, resiumViewer, tileset])

  return {
    animateR3fLookAt,
    animateR3fZoomToObject,
    animateR3fZoomToTarget,
    animateR3fZoomToDefault,
    syncR3fToResium,
    flyResiumCameraToEntity,
    zoomR3f,
  }
}
