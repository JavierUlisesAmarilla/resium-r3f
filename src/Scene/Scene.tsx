import * as Cesium from 'cesium'
import React from 'react'
import {useZustand} from '../store/useZustand'
import {R3fScene} from './R3fScene/R3fScene'
import {ResiumScene} from './ResiumScene/ResiumScene'


export const Scene = ({
  className,
  terrainProvider,
}: {
  className: string
  terrainProvider: Cesium.CesiumTerrainProvider
}) => {
  const {resiumViewer} = useZustand()

  const onPointerDown = (e: React.PointerEvent) => {
    resiumViewer?.canvas.dispatchEvent(new PointerEvent('pointerdown', {
      pointerId: e.pointerId,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    resiumViewer?.canvas.dispatchEvent(new PointerEvent('pointermove', {
      pointerId: e.pointerId,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    resiumViewer?.canvas.dispatchEvent(new PointerEvent('pointerup', {
      pointerId: e.pointerId,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
    }))
  }

  return (
    <div className={className}>
      <ResiumScene terrainProvider={terrainProvider}/>
      <R3fScene
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  )
}
