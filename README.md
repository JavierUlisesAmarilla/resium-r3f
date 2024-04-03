### 1. Run:

```jsx
nvm install 18
nvm use 18
npm install
npm run dev
```

### 2. Main libraries used:

```jsx
'cesium' and 'resium' for 3D Geospatial
R3f packages for additional 3D features
'potree-core' for point cloud visualization
```

### 3. Key technologies:

#### 3.1. How to integrate R3f into Cesium:

##### This project uses two renderers (Cesium and Three.js), but the cameras need to be synchronized to make it feel like they're in one 3D space.

##### And camera related functions should be able to used for both Cesium and Three.js, so introduced useCameraUtils hook. (src/hooks/useCameraUtils.tsx ⇒ syncThreeToCesium)

##### This project uses Orbit Controls of Three.js, so Three.js scene should be overlaid onto Cesium scene.

```jsx
export const Scene = () => {
  return (
    <div className="relative flex h-full w-full flex-col">
      <ResiumScene />
      <R3fScene />
    </div>
  );
};
```

#### 3.2. How to integrate Potree into Three.js:

##### The [Original Potree](https://github.com/potree/potree) package doesn't support TypeScript and have some issues to integrate into Three.js. So decided to use [Potree Core](https://github.com/tentone/potree-core) package.

#### 3.3. How to write clean and efficient code:

##### Setup [ESLint](https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code).

##### Setup [TailwindCSS](https://tailwindcss.com/docs/guides/vite) and [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind). Use Ctrl + Alt + T to sort TailwindCSS classes.

##### [Enable automatic import sorting in VS Code](https://dev.to/shanesc/how-to-sort-and-cleanup-imports-on-save-in-vs-code-52p1).
