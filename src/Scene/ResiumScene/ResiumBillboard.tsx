/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Cesium from 'cesium'
import {useEffect, useState} from 'react'
import * as Resium from 'resium'


const scaleByDistance = new Cesium.NearFarScalar(0, 1, 1000, 0)


export const ResiumBillboard = ({
  position,
  show = true,
  text = '',
  paddingX = 8,
  paddingY = 4,
  fontFamily = 'monospace',
  fontSize = 24,
  fontColor = 'black',
  backgroundColor = 'yellow',
}: {
  position: Cesium.Cartesian3
  show?: boolean
  text?: string
  paddingX?: number,
  paddingY?: number,
  fontSize?: number
  fontFamily?: string
  fontColor?: string
  backgroundColor?: string
}) => {
  const [billboardCanvas, setBillboardCanvas] = useState<any>()

  useEffect(() => {
    // Create div to get height and width then remove it
    const font = `${fontSize}px ${fontFamily}`
    const canvas = document.createElement('canvas')
    const textDiv = document.createElement('div')
    textDiv.style.position = 'absolute'
    textDiv.style.font = font
    textDiv.innerHTML = text
    document.body.appendChild(textDiv)
    const {height, width} = textDiv.getBoundingClientRect()
    canvas.width = width + (paddingX * 2)
    canvas.height = height + (paddingY * 2)
    document.body.removeChild(textDiv)

    // Create font in canvas element
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.font = font
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = fontColor
      ctx.lineWidth = 0
      ctx.strokeText(text, paddingX, height)
      ctx.fillText(text, paddingX, height)
    }

    setBillboardCanvas(canvas)
  }, [backgroundColor, fontColor, fontFamily, fontSize, paddingX, paddingY, text])

  return billboardCanvas && show && (
    <Resium.BillboardCollection modelMatrix={Cesium.Transforms.eastNorthUpToFixedFrame(position)}>
      <Resium.Billboard
        position={Cesium.Cartesian3.ZERO}
        image={billboardCanvas}
        scaleByDistance={scaleByDistance}
        disableDepthTestDistance={Number.POSITIVE_INFINITY}
      />
    </Resium.BillboardCollection>
  )
}
