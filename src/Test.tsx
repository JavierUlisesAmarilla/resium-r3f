/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {MouseEvent as RME, PointerEvent as RPE, useRef} from 'react'


export const Test = () => {
  const zDownRef = useRef<HTMLDivElement>(null)

  const onZTopClick = (e: RME) => {
    console.log('Test#onZTopClick: e:', e)
    zDownRef.current?.dispatchEvent(new MouseEvent('click', {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  const onZDownClick = (e: RME) => {
    console.log('Test#onZDownClick: e:', e)
  }

  const onZTopPointerDown = (e: RPE) => {
    console.log('Test#onZTopPointerDown: e:', e)
    zDownRef.current?.dispatchEvent(new PointerEvent('pointerdown', {
      pointerId: e.pointerId,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  const onZDownPointerDown = (e: RPE) => {
    console.log('Test#onZDownPointerDown: e:', e)
  }

  const onZTopPointerUp = (e: RPE) => {
    console.log('Test#onZTopPointerUp: e:', e)
    zDownRef.current?.dispatchEvent(new PointerEvent('pointerup', {
      pointerId: e.pointerId,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  const onZDownPointerUp = (e: RPE) => {
    console.log('Test#onZDownPointerUp: e:', e)
  }

  return (
    <div className='fixed top-0 right-0 w-48 h-48 text-yellow-500'>
      <div
        ref={zDownRef}
        className='absolute flex items-center justify-center w-full h-full bg-red-500'
        onClick={onZDownClick}
        onPointerDown={onZDownPointerDown}
        onPointerUp={onZDownPointerUp}
      >
        Red
      </div>
      <div
        className='absolute flex items-center justify-center w-full h-full bg-green-500'
        onClick={onZTopClick}
        onPointerDown={onZTopPointerDown}
        onPointerUp={onZTopPointerUp}
      >
        Green
      </div>
    </div>
  )
}
