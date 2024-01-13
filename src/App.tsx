import * as CANNON from 'cannon-es'
import { Canvas } from '@react-three/fiber'
import Dice from './components/Dice.tsx'
import Ground from './components/Ground.tsx'
import { Physics } from "@react-three/cannon";
import PointLight from "./components/PointLight.tsx";
import './styles/App.css'
import {OrbitControls} from "@react-three/drei";
import {useRef, useState} from "react";
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
  const [dices, setDices] = useState(DiceGroup(2))

  const throwDice = () => {
    const scoreElement = document.getElementById("score-result")
    const diceThrowButton = document.getElementById("dice-roll-btn")
    // scoreElement.innerText = "0"
    const diceGroup = dices.ref.current
    let score = 0

    diceGroup.children.forEach((dice, index) => {
      let diceObject = dice as Group
      diceObject.api.position.set(0, 5 + index, 0)
      diceObject.api.applyImpulse([Math.random() * 3, Math.random() * 3, Math.random() * 3], [0, 0, 0])
    })
  }

  return (
    <>
      <div>Score: <span id="score-result">0</span></div>
      <button id="dice-roll-btn" onClick={throwDice}>Throw the dice</button>
      <Canvas
        camera={{
          position: [0, 10, 10],
        }}
      >
        <ambientLight />
        <PointLight/>
        <Physics gravity={[0, -9.81, 0]}>
          <Ground scale={groundSize}/>
          {dices}
        </Physics>
        <OrbitControls />
        <axesHelper args={[groundSize.width]} />
        <gridHelper args={[groundSize.width, groundSize.height]} />
      </Canvas>
    </>
  )
}
