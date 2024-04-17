/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useEffect, useRef} from 'react'
import {useZustand} from '../../store/useZustand'
import './ResiumViewCube.css'


export const ResiumViewCube = () => {
  const cubeRef = useRef<HTMLDivElement>(null)
  const {resiumViewer, setIsResiumCameraBeingUsed} = useZustand()

  const flyResiumCameraToEntity = (heading = 0, pitch = 0) => {
    if (!resiumViewer) {
      return
    }
    const targetEntity = resiumViewer.entities.getById('target')
    if (!targetEntity) {
      return
    }
    setIsResiumCameraBeingUsed(true)
    resiumViewer.flyTo(targetEntity, {offset: {heading, pitch, range: 100}}).then(() => {
      setIsResiumCameraBeingUsed(false)
    })
  }

  useEffect(() => {
    resiumViewer?.scene.postRender.addEventListener(() => {
      if (cubeRef.current) {
        const camera = resiumViewer.scene.camera
        cubeRef.current.style.transform = `rotateX(${camera.pitch}rad) rotateY(${camera.heading}rad)`
      }
    })
  }, [resiumViewer])

  return (
    <div id='wrapper'>
      <div
        ref={cubeRef}
        id='cube'
      >
        {/* Sides */}
        <>
          <div
            id='side_t'
            className='side'
          >
            <div onClick={() => flyResiumCameraToEntity(0, -Math.PI / 2)}>T</div>
          </div>
          <div
            id='side_w'
            className='side'
          >
            <div onClick={() => flyResiumCameraToEntity(Math.PI / 2)}>W</div>
          </div>
          <div
            id='side_s'
            className='side'
          >
            <div onClick={() => flyResiumCameraToEntity()}>S</div>
          </div>
          <div
            id='side_e'
            className='side'
          >
            <div onClick={() => flyResiumCameraToEntity(-Math.PI / 2)}>E</div>
          </div>
          <div
            id='side_n'
            className='side'
          >
            <div onClick={() => flyResiumCameraToEntity(Math.PI)}>N</div>
          </div>
          <div
            id='side_b'
            className='side'
          />
        </>
        {/* Edges */}
        <>
          <div
            id='edge_tw'
            className='edge'
            onClick={() => flyResiumCameraToEntity(Math.PI / 2, -Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_ts'
            className='edge'
            onClick={() => flyResiumCameraToEntity(0, -Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_te'
            className='edge'
            onClick={() => flyResiumCameraToEntity(-Math.PI / 2, -Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_tn'
            className='edge'
            onClick={() => flyResiumCameraToEntity(Math.PI, -Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_ws'
            className='edge'
            onClick={() => flyResiumCameraToEntity(Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_se'
            className='edge'
            onClick={() => flyResiumCameraToEntity(-Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_en'
            className='edge'
            onClick={() => flyResiumCameraToEntity(-3 * Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
          <div
            id='edge_nw'
            className='edge'
            onClick={() => flyResiumCameraToEntity(3 * Math.PI / 4)}
          >
            <div/>
            <div/>
          </div>
        </>
        {/* Vertices */}
        <>
          <div
            id='vertex_tws'
            className='vertex'
            onClick={() => flyResiumCameraToEntity(Math.PI / 4, -Math.PI / 4)}
          >
            <div/>
            <div/>
            <div/>
          </div>
          <div
            id='vertex_tse'
            className='vertex'
            onClick={() => flyResiumCameraToEntity(-Math.PI / 4, -Math.PI / 4)}
          >
            <div/>
            <div/>
            <div/>
          </div>
          <div
            id='vertex_ten'
            className='vertex'
            onClick={() => flyResiumCameraToEntity(-3 * Math.PI / 4, -Math.PI / 4)}
          >
            <div/>
            <div/>
            <div/>
          </div>
          <div
            id='vertex_tnw'
            className='vertex'
            onClick={() => flyResiumCameraToEntity(3 * Math.PI / 4, -Math.PI / 4)}
          >
            <div/>
            <div/>
            <div/>
          </div>
        </>
      </div>
    </div >
  )
}
