/* eslint-disable react/no-unknown-property */
import {Euler, Vector3, useFrame} from '@react-three/fiber'
import {PointCloudOctree, Potree} from 'potree-core'
import {ReactNode, useEffect, useState} from 'react'


export type PotreeModelType = {
  fileName: string
  baseUrl: string
  children?: ReactNode
  pointBudget?: number
  modelPos?: Vector3
  modelRot?: Euler
  modelScale?: Vector3
}


export const PotreeModel = ({
  fileName,
  baseUrl,
  children,
  pointBudget = 1000000,
  modelPos = [0, 0, 0],
  modelRot = [0, 0, 0],
  modelScale = 1,
}: PotreeModelType) => {
  const [potree, setPotree] = useState<Potree>()
  const [pointCloudArr, setPointCloudArr] = useState<PointCloudOctree[]>()

  useEffect(() => {
    const newPotree = new Potree()
    newPotree.pointBudget = pointBudget
    setPotree(newPotree)
  }, [pointBudget])

  useEffect(() => {
    if (potree && fileName && baseUrl) {
      const newPointCloudArr: PointCloudOctree[] = []

      potree.loadPointCloud(fileName, (url) => `${baseUrl}${url}`).then((pco) => {
        newPointCloudArr.push(pco)
      })

      setPointCloudArr(newPointCloudArr)
    }
  }, [baseUrl, fileName, potree])

  useFrame((state) => {
    if (potree && pointCloudArr) {
      potree.updatePointClouds(pointCloudArr, state.camera, state.gl)
    }
  })

  return (
    <group
      position={modelPos}
      rotation={modelRot}
      scale={modelScale}
    >
      {pointCloudArr?.map((pointCloud, key) =>
        <primitive
          key={key}
          object={pointCloud}
        />,
      )}
      {children}
    </group>
  )
}
