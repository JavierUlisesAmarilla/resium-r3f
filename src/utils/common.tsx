import * as Cesium from 'cesium'
import {MathUtils, Vector3} from 'three'


// Get the Euclidean modulo of angle % 2 * PI.
export const normalizeAngle = (angle: number) => {
  const TAU = Math.PI * 2
  return MathUtils.euclideanModulo(angle, TAU)
}


// Convert three.js based position to cesium based matrix.
export const threePositionToCesiumMatrix4 = (threePosition: Vector3, centerCartesian3 = Cesium.Cartesian3.ZERO) => {
  const centerCartesian3Matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(centerCartesian3)
  const threePositionCartesian3 = new Cesium.Cartesian3(threePosition.x, -threePosition.z, threePosition.y)
  const threePositionMatrix4 = Cesium.Matrix4.fromTranslation(threePositionCartesian3)
  const cesiumMatrix4 = Cesium.Matrix4.multiply(centerCartesian3Matrix4, threePositionMatrix4, new Cesium.Matrix4())
  return cesiumMatrix4
}


// Convert cesium based matrix to three.js based position.
export const cesiumCartesian3ToThreePosition = (cartesian3: Cesium.Cartesian3, centerCartesian3 = Cesium.Cartesian3.ZERO) => {
  const cesiumMatrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian3)
  const centerCartesian3Matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(centerCartesian3)
  const threePositionMatrix4 = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(centerCartesian3Matrix4, new Cesium.Matrix4()), cesiumMatrix4, new Cesium.Matrix4())
  const threePositionCartesian3 = Cesium.Matrix4.getTranslation(threePositionMatrix4, new Cesium.Cartesian3())
  const threePosition = new Vector3(threePositionCartesian3.x, threePositionCartesian3.z, -threePositionCartesian3.y)
  return threePosition
}
