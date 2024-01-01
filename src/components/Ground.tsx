import { usePlane } from "@react-three/cannon"
import { Mesh } from "three"


export default function Ground({scale,}: {
  scale: {width: number, height: number}}
) {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Rotate the plane to be horizontal
    material: {
      friction: 0.1,
    },
  }))

  return (
    <mesh
      ref={ref}
      receiveShadow
      scale={[scale.width, scale.height, 1]}
    >
      <planeGeometry/>
      {/*<meshStandardMaterial color="#171720"/>*/}
      <meshStandardMaterial color="white"/>
    </mesh>
  )
}