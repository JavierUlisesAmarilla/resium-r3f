import {Cartesian3} from 'cesium'
import {Vector3} from 'three'
import {getAngle, normalizeAngle, offsetCart3ToCart3, offsetVec3ToCart3} from './common'


test('getAngle', () => {
  expect(getAngle(new Vector3(1, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0))).toBe(Math.PI / 2)
  expect(getAngle(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0))).toBe(0)
  expect(getAngle(new Vector3(1, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0))).toBe(0)
})


test('normalizeAngle', () => {
  expect(normalizeAngle(-Math.PI)).toBe(Math.PI)
  expect(normalizeAngle(-Math.PI * 0.5)).toBe(Math.PI * 1.5)
})


test('offsetCart3ToCart3', () => {
  const resCart3 = new Cartesian3()
  const expectedCart = new Cartesian3(-1, 1, 1)
  expect(offsetCart3ToCart3(new Cartesian3(), new Cartesian3(1, 1, 1), resCart3)).toStrictEqual(expectedCart)
  expect(resCart3).toStrictEqual(expectedCart)
})


test('offsetVec3ToCart3', () => {
  const resCart3 = new Cartesian3()
  const expectedCart = new Cartesian3(-1, 1, 1)
  expect(offsetVec3ToCart3(new Cartesian3(), new Vector3(1, 1, -1), resCart3)).toStrictEqual(expectedCart)
  expect(resCart3).toStrictEqual(expectedCart)
})
