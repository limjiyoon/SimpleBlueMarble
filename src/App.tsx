import { Canvas } from '@react-three/fiber'
import Dice from './components/Dice.tsx'
import Ground from './components/Ground.tsx'
import { Physics } from "@react-three/cannon";
import PointLight from "./components/PointLight.tsx";
import './styles/App.css'
import {OrbitControls} from "@react-three/drei";
import {useRef} from "react";
import {Group} from "three";


function DiceGroup(numberOfDice: number) {
  const diceGroupRef= useRef<Group>(null)

  const dices = [...Array(numberOfDice)].map((_, idx) => {
    return (
      <Dice
        position={[0, 5 + idx, 0]}
        rotation={[0.4, 0.24, 0.15]}
        scale={[1, 1, 1]}
      />
    )

  })
  return (
    <group ref={diceGroupRef}>
      {dices}
    </group>
  )

}

export function App() {
  const groundSize = {"width": 20, "height": 20}

  return (
    <>
      <Canvas
        camera={{
          position: [0, 10, 10],
        }}
      >
        <ambientLight />
        <PointLight/>
        <Physics gravity={[0, -9.81, 0]}>
          <Ground scale={groundSize}/>
          {DiceGroup(2)}
        </Physics>
        <OrbitControls />
        <axesHelper args={[groundSize.width]} />
        <gridHelper args={[groundSize.width, groundSize.height]} />
      </Canvas>
    </>
  )
}
