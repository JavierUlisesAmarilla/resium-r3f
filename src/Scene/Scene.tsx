import {PointerEvent as RPE} from 'react'
import {useZustand} from '../store/useZustand'
import {MOUSE_SYNC_DELAY} from '../utils/constants'
import {R3fScene} from './R3fScene/R3fScene'
import {ResiumScene} from './ResiumScene/ResiumScene'


export const Scene = ({
  className,
  assetId,
}: {
  className: string
  assetId: number
}) => {
  const {resiumViewer} = useZustand()

  const onPointerDown = (e: RPE) => {
    setTimeout(() => {
      resiumViewer?.canvas.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: e.pointerId,
        bubbles: e.bubbles,
        cancelable: e.cancelable,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
      }))
    }, MOUSE_SYNC_DELAY)
  }

  const onPointerUp = (e: RPE) => {
    setTimeout(() => {
      resiumViewer?.canvas.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: e.pointerId,
        bubbles: e.bubbles,
        cancelable: e.cancelable,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
      }))
    }, MOUSE_SYNC_DELAY)
  }

  return (
    <div className={className}>
      <ResiumScene assetId={assetId}/>
      <R3fScene
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
    </div>
  )
}
