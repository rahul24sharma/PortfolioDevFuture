import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Grid, Line } from '@react-three/drei'
import * as THREE from 'three'

const NODE_POS = [
  [0, 0.35, 0],
  [1.25, -0.45, 0.65],
  [-1.1, 0.2, -0.55],
  [0.35, 1.05, -0.25],
  [-0.55, -0.85, 0.4],
]

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 0],
  [0, 3],
  [3, 4],
  [4, 1],
  [2, 4],
]

function NetworkGraph({ paused }) {
  const group = useRef(null)

  useFrame((_, delta) => {
    if (paused || document.visibilityState !== 'visible') return
    if (group.current) group.current.rotation.y += delta * 0.06
  })

  const lines = useMemo(
    () =>
      EDGES.map(([a, b]) => [new THREE.Vector3(...NODE_POS[a]), new THREE.Vector3(...NODE_POS[b])]),
    [],
  )

  return (
    <group ref={group}>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#38bdf8"
          lineWidth={1.25}
          transparent
          opacity={0.45}
        />
      ))}
      {NODE_POS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene({ paused = false }) {
  const group = useRef(null)
  const ringA = useRef(null)
  const ringB = useRef(null)
  const cube = useRef(null)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (paused || document.visibilityState !== 'visible') return
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.28,
      0.045,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.18,
      0.045,
    )
    if (ringA.current) ringA.current.rotation.z += delta * 0.08
    if (ringB.current) ringB.current.rotation.z -= delta * 0.055
    if (cube.current) {
      cube.current.rotation.x += delta * 0.28
      cube.current.rotation.y += delta * 0.22
    }
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} />
      <pointLight position={[12, 8, 10]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[-10, -6, -8]} intensity={0.75} color="#6366f1" />
      <spotLight
        position={[2, 12, 10]}
        angle={0.38}
        penumbra={0.85}
        intensity={1.05}
        color="#22d3ee"
      />

      <Grid
        position={[0, -2.15, 0]}
        args={[20, 20]}
        cellSize={0.32}
        cellThickness={0.55}
        cellColor="#1e3a5f"
        sectionSize={3.2}
        sectionThickness={0.95}
        sectionColor="rgba(56, 189, 248, 0.2)"
        fadeDistance={18}
        fadeStrength={1.1}
        infiniteGrid
        followCamera={false}
      />

      {/* Standard material: much cheaper than MeshDistortMaterial while keeping the look. */}
      <Float speed={0.85} rotationIntensity={0.06} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[0.95, 32, 32]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#1e40af"
            emissiveIntensity={0.26}
            roughness={0.4}
            metalness={0.72}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>

      <mesh ref={cube}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
      </mesh>

      <NetworkGraph paused={paused} />

      <mesh>
        <icosahedronGeometry args={[1.52, 1]} />
        <meshBasicMaterial color="#2563eb" wireframe transparent opacity={0.2} />
      </mesh>

      <group ref={ringA} rotation={[Math.PI / 2, 0.15, 0]}>
        <mesh>
          <torusGeometry args={[2.45, 0.018, 12, 72]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
        </mesh>
      </group>

      <group ref={ringB} rotation={[Math.PI / 2.35, 0.55, 0.25]}>
        <mesh>
          <torusGeometry args={[2.85, 0.01, 8, 64]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.32} wireframe />
        </mesh>
      </group>
    </group>
  )
}
