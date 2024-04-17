/* eslint-disable react/no-unknown-property */
import {PerformanceMonitor} from '@react-three/drei'
import {useThree} from '@react-three/fiber'
import {AXES_LENGTH, DPR_FACTOR, SHOW_AXES_HELPER} from '../../utils/constants'


export const R3fWorld = () => {
  const {setDpr} = useThree()

  return (
    <PerformanceMonitor
      onChange={({factor}) => {
        const newDpr = (0.5 + (1.5 * factor)) * DPR_FACTOR
        setDpr(newDpr)
      }}
      onIncline={() => {
        setDpr(2 * DPR_FACTOR)
      }}
      onDecline={() => {
        setDpr(0.5 * DPR_FACTOR)
      }}
      flipflops={3}
      onFallback={() => {
        setDpr(0.5 * DPR_FACTOR)
      }}
    >
      {/* <R3fAssets/> */}
      {SHOW_AXES_HELPER && <axesHelper args={[AXES_LENGTH]}/>}
    </PerformanceMonitor>
  )
}
