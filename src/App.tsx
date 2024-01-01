import { Canvas } from '@react-three/fiber'
import './styles/App.css'

export function App() {
  const groundSize = {"width": 20, "height": 20}
  return (
    <>
      <Canvas
        camera={{
          position: [0, 10, 10],
        }}
      >
      </Canvas>
    </>
  )
}
