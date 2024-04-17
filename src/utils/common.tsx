import turfCenter from '@turf/center'
import * as Cesium from 'cesium'
import {MathUtils, Vector3} from 'three'


// Get the Euclidean modulo of angle % 2 * PI.
export const normalizeAngle = (angle: number) => {
  const TAU = Math.PI * 2
  return MathUtils.euclideanModulo(angle, TAU)
}


// Get angle between line ba and bc.
export const getAngle = (a: Vector3, b: Vector3, c: Vector3) => {
  const d1 = a.clone().sub(b)
  const d2 = c.clone().sub(b)
  const angle = (d1.length() && d2.length()) ? d1.angleTo(d2) : 0
  return angle
}


// Move tileset vertically by earth's surface.
export const moveTilesetVertically = (tileset: Cesium.Cesium3DTileset, height: number) => {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  const surfaceCartesian3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
  const offsetCartesian3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
  const translation = Cesium.Cartesian3.subtract(offsetCartesian3, surfaceCartesian3, new Cesium.Cartesian3())
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
}


export const getTilesetMinBottomHeight = (rootTile: Cesium.Cesium3DTile) => {
  let minHeight = Cesium.Cartographic.fromCartesian(rootTile.boundingSphere.center).height

  for (let i = 0; i < rootTile.children.length; i++) {
    minHeight = Math.min(minHeight, getTilesetMinBottomHeight(rootTile.children[i]))
  }

  return minHeight
}


// Attach tileset to earth's ground. (This is unnecessary for now)
export const clampTilesetToTerrain = async (terrainProvider: Cesium.CesiumTerrainProvider, tileset: Cesium.Cesium3DTileset) => {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  cartographic.height = 0
  await Cesium.sampleTerrainMostDetailed(terrainProvider, [cartographic])
  const minHeight = getTilesetMinBottomHeight(tileset.root)
  moveTilesetVertically(tileset, cartographic.height - minHeight)
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

export const positionArrToGeoJSONPolygon = (positionArr: Cesium.Cartesian3[]) => {
  const coordinateArr = positionArr.map((position) => {
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    return [
      cartographic.longitude,
      cartographic.latitude,
    ]
  })

  // First and last coordinates must be the same for GeoJSON Polygons
  const cartographic = Cesium.Cartographic.fromCartesian(positionArr[0])
  coordinateArr.push([cartographic.longitude, cartographic.latitude])

  return {
    type: 'Polygon',
    coordinates: [coordinateArr],
  }
}

export const getCenterPosition = (positionArr: Cesium.Cartesian3[]) => {
  const centerPoint = turfCenter(positionArrToGeoJSONPolygon(positionArr))
  const cartographic = Cesium.Cartographic.fromCartesian(positionArr[0])
  const centerPosition = Cesium.Cartesian3.fromRadians(
      centerPoint.geometry.coordinates[0],
      centerPoint.geometry.coordinates[1],
      cartographic.height,
  )
  return centerPosition
}
