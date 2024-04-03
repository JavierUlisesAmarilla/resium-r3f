/* eslint-disable react/no-unknown-property */
import {PerformanceMonitor} from '@react-three/drei'
import {useThree} from '@react-three/fiber'
import {AXES_LENGTH, SHOW_AXES_HELPER} from '../../utils/constants'
import {Assets} from './Assets/Assets'
import {R3fLight} from './R3fLight'


const dprFactor = 1


export const R3fWorld = () => {
  const {setDpr} = useThree()

  return (
    <PerformanceMonitor
      onChange={({factor}) => {
        const newDpr = (0.5 + (1.5 * factor)) * dprFactor
        setDpr(newDpr)
      }}
      onIncline={() => {
        setDpr(2 * dprFactor)
      }}
      onDecline={() => {
        setDpr(0.5 * dprFactor)
      }}
      flipflops={3}
      onFallback={() => {
        setDpr(0.5 * dprFactor)
      }}
    >
      {/* <R3fEffect/> */}
      <R3fLight/>
      <Assets/>
      {SHOW_AXES_HELPER && <axesHelper args={[AXES_LENGTH]}/>}
    </PerformanceMonitor>
  )
}
