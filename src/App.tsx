import { Canvas } from '@react-three/fiber'
import Ground from './components/Ground.tsx'
import './styles/App.css'
import {OrbitControls} from "@react-three/drei";

export function App() {
  const groundSize = {"width": 20, "height": 20}
  return (
    <>
      <Canvas
        camera={{
          position: [0, 10, 10],
        }}
      >
        <Physics gravity={[0, -9.81, 0]}>
          <Ground scale={groundSize} />

        </Physics>
        <OrbitControls />
      </Canvas>
    </>
  )
}
