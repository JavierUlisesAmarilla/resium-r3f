/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useRef} from 'react'


export const usePrevious = (value: any, initialValue: any) => {
  const ref = useRef(initialValue)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
