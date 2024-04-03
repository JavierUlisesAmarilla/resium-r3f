import {Cartesian3, Cartographic, Cesium3DTile, Cesium3DTileset, Matrix4, Transforms} from 'cesium'
import {MathUtils, Vector3} from 'three'


export const offsetVec3ToCart3 = (centerCart3: Cartesian3, offsetVec3: Vector3, resCart3: Cartesian3 = new Cartesian3()): Cartesian3 => {
  return offsetCart3ToCart3(centerCart3, new Cartesian3(offsetVec3.x, -offsetVec3.z, offsetVec3.y), resCart3)
}


export const offsetCart3ToCart3 = (centerCart3: Cartesian3, offsetCart3: Cartesian3, resCart3: Cartesian3 = new Cartesian3()): Cartesian3 => {
  const transform = Transforms.eastNorthUpToFixedFrame(centerCart3)
  return Matrix4.multiplyByPoint(transform, offsetCart3, resCart3)
}


export const normalizeAngle = (angle: number) => {
  const TAU = Math.PI * 2
  return MathUtils.euclideanModulo(angle, TAU)
}


export const getAngle = (a: Vector3, b: Vector3, c: Vector3) => {
  const d1 = a.clone().sub(b)
  const d2 = c.clone().sub(b)
  const angle = (d1.length() && d2.length()) ? d1.angleTo(d2) : 0
  return angle
}


export const updateTilesetHeight = (tileset: Cesium3DTileset, height: number) => {
  const cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center)
  console.log('common#updateTilesetHeight: cartographic.height:', cartographic.height)
  const surfaceCart3 = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
  const offsetCart3 = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
  const translation = Cartesian3.subtract(offsetCart3, surfaceCart3, new Cartesian3())
  tileset.modelMatrix = Matrix4.fromTranslation(translation)
  return surfaceCart3
}


export const getTilesetMinBottomHeight = (rootTile: Cesium3DTile) => {
  let minHeight = Cartographic.fromCartesian(rootTile.boundingSphere.center).height

  for (let i = 0; i < rootTile.children.length; i++) {
    minHeight = Math.min(minHeight, getTilesetMinBottomHeight(rootTile.children[i]))
  }

  return minHeight
}


export const placeTilesetOnGround = (tileset: Cesium3DTileset) => {
  const minHeight = getTilesetMinBottomHeight(tileset.root)
  console.log('common#placeTilesetOnGround: minHeight:', minHeight)
  return updateTilesetHeight(tileset, -minHeight)
}
