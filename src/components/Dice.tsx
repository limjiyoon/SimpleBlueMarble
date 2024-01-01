import {useBox} from "@react-three/cannon";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import {BoxGeometry, BufferGeometry} from "three";
import React from "react";


const DiceAttribute = {
  segments: 40,
  edgeRadius: 0.07,
  notchRadius: 0.12,
  notchDepth: 0.1,
  offset: 0.23,
}


export default function Dice({position=[0,0,0], scale=[1,1,1], rotation=[0,0,0]}: {
  position: [x: number, y: number, z: number]
  scale: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
}) {
  const [groupMesh, api] = useBox(() => ({
    mass: 1,
    rotation: rotation,
    type: "Dynamic",
    position: position
  }));
  return (
    <>
      <group
        ref={groupMesh}
        receiveShadow
        castShadow
        // onClick={() => {
        //     api.angularVelocity.set(10, 0, 10)
        //     api.velocity.set(0, 10, 0)
        //   }
        // }
      >
        <mesh
          scale={scale}
        >
          <MyDiceGeometry />
          <meshLambertMaterial color={"white"}/>
          <axesHelper/>
        </mesh>
        <mesh
          scale={scale}
        >
          <InnerDiceGeometry />
          <meshBasicMaterial color={"black"}/>
        </mesh>
      </group>
    </>
  )
}

function MyDiceGeometry() {
  let boxGeometry: BufferGeometry = new THREE.BoxGeometry(1, 1, 1, DiceAttribute.segments, DiceAttribute.segments, DiceAttribute.segments);
  const subCubeHalfSize = 0.5 - DiceAttribute.edgeRadius;
  const positionAttirubte = boxGeometry.getAttribute("position")
  const notchWave = (v: number) => {
    v *= (1 / DiceAttribute.notchRadius)
    v = Math.PI * Math.max(-1, Math.min(1, v))
    return DiceAttribute.notchDepth * (Math.cos(v) + 1.0)
  }

  const notch = (pos: number[]) => notchWave(pos[0]) * notchWave(pos[1])


  for (let i=0; i < positionAttirubte.count; i++) {
    let position = new THREE.Vector3().fromBufferAttribute(positionAttirubte, i)

    // Rounding the edges of the Box
    const subCube = new THREE.Vector3(
      Math.sign(position.x),
      Math.sign(position.y),
      Math.sign(position.z),
    ).multiplyScalar(subCubeHalfSize)
    const addition = new THREE.Vector3().subVectors(position, subCube)

    // Corner Part
    if (
      Math.abs(position.x) > subCubeHalfSize
      && Math.abs(position.y) > subCubeHalfSize
      && Math.abs(position.z) > subCubeHalfSize
    ) {
      addition.normalize().multiplyScalar(DiceAttribute.edgeRadius)
      position = subCube.add(addition)
    } else if ( // Edge Z-Axis Part
      Math.abs(position.x) > subCubeHalfSize
      && Math.abs(position.y) > subCubeHalfSize ) {
      addition.z = 0
      addition.normalize().multiplyScalar(DiceAttribute.edgeRadius)
      position.x = subCube.x + addition.x
      position.y = subCube.y + addition.y
      position.z = subCube.z + addition.z
    } else if ( // Edge Y-Axis Part
      Math.abs(position.x) > subCubeHalfSize
      && Math.abs(position.z) > subCubeHalfSize ) {
      addition.y = 0
      addition.normalize().multiplyScalar(DiceAttribute.edgeRadius)
      position.x = subCube.x + addition.x
      position.z = subCube.z + addition.z
    } else if ( // Edge X-Axis Part
      Math.abs(position.y) > subCubeHalfSize
      && Math.abs(position.z) > subCubeHalfSize ) {
      addition.x = 0
      addition.normalize().multiplyScalar(DiceAttribute.edgeRadius)
      position.y = subCube.y + addition.y
      position.z = subCube.z + addition.z
    }

    // Make the notches
    if (position.y === 0.5) { // 1 Eye
      position.y -= notch([position.x, position.z])
    } else if(position.x === 0.5) { // 2 Eye
      position.x -= notch([position.y + DiceAttribute.offset, position.z + DiceAttribute.offset])
      position.x -= notch([position.y - DiceAttribute.offset, position.z - DiceAttribute.offset])
    } else if (position.z === 0.5) { // 3 Eye
      position.z -= notch([position.x + DiceAttribute.offset, position.y + DiceAttribute.offset])
      position.z -= notch([position.x, position.y])
      position.z -= notch([position.x - DiceAttribute.offset, position.y - DiceAttribute.offset])
    } else if (position.z === -0.5) { // 4 Eye
      position.z += notch([position.x + DiceAttribute.offset, position.y + DiceAttribute.offset])
      position.z += notch([position.x + DiceAttribute.offset, position.y - DiceAttribute.offset])
      position.z += notch([position.x - DiceAttribute.offset, position.y + DiceAttribute.offset])
      position.z += notch([position.x - DiceAttribute.offset, position.y - DiceAttribute.offset])
    } else if (position.x === -0.5) { // 5 Eye
      position.x += notch([position.y + DiceAttribute.offset, position.z + DiceAttribute.offset])
      position.x += notch([position.y + DiceAttribute.offset, position.z - DiceAttribute.offset])
      position.x += notch([position.y, position.z])
      position.x += notch([position.y - DiceAttribute.offset, position.z + DiceAttribute.offset])
      position.x += notch([position.y - DiceAttribute.offset, position.z - DiceAttribute.offset])
    } else if (position.y === -0.5) { // 6 Eye
      position.y += notch([position.x + DiceAttribute.offset, position.z + DiceAttribute.offset])
      position.y += notch([position.x + DiceAttribute.offset, position.z])
      position.y += notch([position.x + DiceAttribute.offset, position.z - DiceAttribute.offset])
      position.y += notch([position.x - DiceAttribute.offset, position.z + DiceAttribute.offset])
      position.y += notch([position.x - DiceAttribute.offset, position.z])
      position.y += notch([position.x - DiceAttribute.offset, position.z - DiceAttribute.offset])
    }

    positionAttirubte.setXYZ(i, position.x, position.y, position.z)
  }

  // Update the normals
  boxGeometry.deleteAttribute('normal')
  boxGeometry.deleteAttribute('uv')
  boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry)

  boxGeometry.computeVertexNormals()

  return <primitive object={boxGeometry} />
}

/*
 * This is the inner part of the dice, which is black.
 * This is used to color the notches.
*/
function InnerDiceGeometry() {
  // keep the plane size equal to flat surface of cube
  const baseGeometry = new THREE.PlaneGeometry(
    1 - 2 * DiceAttribute.edgeRadius,
    1 - 2 * DiceAttribute.edgeRadius,
    THREE.DoubleSide
  );

  // place planes a bit behind the box sides
  const offset = .49;

  // and merge them as we already have BufferGeometryUtils file loaded :)
  const notchPlanes = BufferGeometryUtils.mergeGeometries([
    baseGeometry.clone().translate(0, 0, offset),
    baseGeometry.clone().rotateX(Math.PI).translate(0, 0, -offset),
    baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
    baseGeometry.clone().rotateX(.5 * -Math.PI).translate(0, offset, 0),
    baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
    baseGeometry.clone().rotateY(.5 * -Math.PI).translate(-offset, 0, 0),
  ], false);

  return <primitive object={notchPlanes} />
}
