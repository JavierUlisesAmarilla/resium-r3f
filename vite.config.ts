import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import cesium from 'vite-plugin-cesium'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium(), glsl()],
})
