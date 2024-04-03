import {DebugModelMatrixPrimitive, HeadingPitchRange, OrthographicFrustum, PerspectiveFrustum, Transforms} from 'cesium'
import gsap from 'gsap'
import {useEffect} from 'react'
import {Box3, MathUtils, Mesh, OrthographicCamera, PerspectiveCamera, Vector3} from 'three'
import {useZustand} from '../store/useZustand'
import {getAngle, normalizeAngle, offsetVec3ToCart3} from '../utils/common'
import {ANGLE_TOLERANCE_FACTOR, ANIM_DURATION, AXES_LENGTH, ROT_ANIM_FACTOR, SHOW_AXES_HELPER} from '../utils/constants'


let axesHelper: DebugModelMatrixPrimitive | undefined
const box3 = new Box3()
const vec3 = new Vector3()


export const useCameraUtils = () => {
  const {resiumViewer, preventAllEvent, setPreventAllEvent, r3fControlsRef, centerCart3, r3fCamera} = useZustand()
  const resiumScene = resiumViewer?.scene
  const resiumCamera = resiumViewer?.camera

  useEffect(() => {
    return () => {
      if (axesHelper) {
        resiumViewer?.scene.primitives.remove(axesHelper)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (centerCart3) {
      syncCesium()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerCart3])

  const syncFov = () => {
    if (r3fCamera && resiumCamera) {
      // Sync frustum
      if (r3fCamera instanceof PerspectiveCamera) {
        if (!(resiumCamera.frustum instanceof PerspectiveFrustum)) {
          resiumCamera.switchToPerspectiveFrustum()
        }

        const r3fCameraAspect = r3fCamera.aspect
        const r3fCameraFov = r3fCamera.fov
        const resiumCameraFrustum = resiumCamera.frustum as PerspectiveFrustum

        if (r3fCameraAspect < 1) {
          resiumCameraFrustum.fov = Math.PI * (r3fCameraFov / 180)
        } else {
          const resiumFovY = Math.PI * (r3fCameraFov / 180)
          const resiumFovX = Math.atan(Math.tan(0.5 * resiumFovY) * r3fCameraAspect) * 2
          resiumCameraFrustum.fov = resiumFovX
        }
      } else if (r3fCamera instanceof OrthographicCamera) {
        if (!(resiumCamera.frustum instanceof OrthographicFrustum)) {
          resiumCamera.switchToOrthographicFrustum()
        }

        const resiumOrhtoFrustum = resiumCamera.frustum as OrthographicFrustum
        resiumOrhtoFrustum.aspectRatio = r3fCamera.right / r3fCamera.top
        resiumOrhtoFrustum.width = (-r3fCamera.left + r3fCamera.right) / r3fCamera.zoom
      }
    }
  }

  const syncCesium = () => {
    if (resiumScene && resiumCamera && r3fControlsRef?.current && r3fCamera && centerCart3) {
      syncFov()
      const r3fCameraTarget = r3fControlsRef.current.target
      const resiumCameraCart3Target = offsetVec3ToCart3(centerCart3, r3fCameraTarget)
      const resiumCameraCart3TargetMatrix4 = Transforms.eastNorthUpToFixedFrame(resiumCameraCart3Target)
      const heading = normalizeAngle(-1 * r3fControlsRef.current.getAzimuthalAngle())
      const pitch = r3fControlsRef.current.getPolarAngle() - MathUtils.degToRad(90)
      const range = r3fControlsRef.current.getDistance()
      resiumCamera.lookAtTransform(resiumCameraCart3TargetMatrix4, new HeadingPitchRange(heading, pitch, range))

      // Axes helper
      if (SHOW_AXES_HELPER) {
        if (!axesHelper) {
          axesHelper = new DebugModelMatrixPrimitive({modelMatrix: resiumCameraCart3TargetMatrix4, length: AXES_LENGTH})
          resiumViewer.scene.primitives.add(axesHelper)
        } else {
          axesHelper.modelMatrix = resiumCameraCart3TargetMatrix4
        }
      } else if (axesHelper) {
        resiumViewer.scene.primitives.remove(axesHelper)
        axesHelper = undefined
      }
    }
  }

  const animLookAt = async (target: Vector3) => {
    if (r3fControlsRef?.current && !preventAllEvent && r3fCamera) {
      setPreventAllEvent(true)
      const angleTo = getAngle(r3fControlsRef.current.target, r3fCamera.position, target)
      await gsap.timeline().to(r3fControlsRef.current.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: angleTo > Math.PI * ANGLE_TOLERANCE_FACTOR ? ANIM_DURATION * ROT_ANIM_FACTOR : 0,
      })
      setPreventAllEvent(false)
    }
  }

  const animCloseToObj = async (obj: Mesh) => {
    if (obj) {
      box3.setFromObject(obj)
      const maxSize = (box3.max.x - box3.min.x + box3.max.y - box3.min.y + box3.max.z - box3.min.z) / 2
      obj.getWorldPosition(vec3)
      await animMoveToTarget(vec3, maxSize)
    }
  }

  const animMoveToTarget = async (target: Vector3, zoomDistance: number = 0) => {
    await animLookAt(target)

    if (!preventAllEvent && r3fCamera) {
      setPreventAllEvent(true)
      const direc = target.sub(r3fCamera.position)
      const direcLen = direc.length()
      const scale = (direcLen - zoomDistance) / direcLen
      direc.multiplyScalar(scale)
      const moveTarget = r3fCamera.position.clone().add(direc)
      await gsap.timeline().to(r3fCamera.position, {
        x: moveTarget.x,
        y: moveTarget.y,
        z: moveTarget.z,
        duration: ANIM_DURATION,
      })
      setPreventAllEvent(false)
    }
  }

  return {syncCesium, animLookAt, animCloseToObj, animMoveToTarget}
}
