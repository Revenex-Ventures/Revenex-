import { Suspense, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { BookOpen, Bus, Calendar, FileEdit, IndianRupee, MessageCircle, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Set up gltf decoders and preload
useGLTF.setDecoderPath('/draco/')
useGLTF.preload('/student.glb')

// Constant for spacing and dimensions
const RING_RADIUS = 2.5
const RING_CENTER_Y = 0.57

type RingDef = {
  radius: number
  tube: number
  color: string
  tilt: [number, number, number]
  speed: number
  accent: string
  poleSize: number
  metalness: number
  roughness: number
}

const RINGS: RingDef[] = [
  {
    radius: RING_RADIUS,
    tube: 0.025,
    color: '#C89B5C', // Gold/Bronze
    tilt: [15 * Math.PI / 180, 0, 0], // rotated ~15° on X
    speed: 0.04,
    accent: '#E5A93B',
    poleSize: 0.055,
    metalness: 0.7,
    roughness: 0.3,
  },
  {
    radius: RING_RADIUS,
    tube: 0.025,
    color: '#E8E4DC', // Silver/White
    tilt: [12 * Math.PI / 180, 70 * Math.PI / 180, 0], // rotated ~70° on Y, slight X tilt
    speed: -0.05,
    accent: '#FFFFFF',
    poleSize: 0.05,
    metalness: 0.8,
    roughness: 0.25,
  },
  {
    radius: RING_RADIUS,
    tube: 0.025,
    color: '#D4B896', // Pale Gold
    tilt: [-20 * Math.PI / 180, 40 * Math.PI / 180, 0], // rotated ~-20° on X, ~40° on Y
    speed: 0.035,
    accent: '#F0D3B0',
    poleSize: 0.05,
    metalness: 0.7,
    roughness: 0.3,
  },
]

/* ─── Character model with forced PBR override ─── */
function StudentModel() {
  const { scene } = useGLTF('/student.glb')
  // Load texture manually since the GLB doesn't bundle it
  const baseColor = useLoader(THREE.TextureLoader, '/student-basecolor.png')
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    // Configure texture colorSpace and uv mapping
    baseColor.colorSpace = THREE.SRGBColorSpace
    baseColor.flipY = false // GLTF expects flipY = false
    baseColor.needsUpdate = true

    const logged = new Set<string>()
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of materials) {
        const mat = m as THREE.MeshStandardMaterial
        
        // Force critical material fixes
        mat.map = baseColor
        mat.metalness = 0
        mat.roughness = 0.65
        mat.envMapIntensity = 0.6
        
        // Ensure extraneous maps are cleared
        mat.metalnessMap = null
        mat.roughnessMap = null
        mat.normalMap = null
        mat.aoMap = null
        mat.needsUpdate = true

        if (!logged.has(mat.uuid)) {
          logged.add(mat.uuid)
          console.log(
            `[Hero3D] material override applied → metalness=${mat.metalness} roughness=${mat.roughness} envMapIntensity=${mat.envMapIntensity}`
          )
        }
      }
    })

    // Center model horizontally and position bottom at y = 0
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const g = group.current
    if (g) {
      g.position.set(-center.x, -box.min.y, -center.z)
    }
  }, [scene, baseColor])

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

/* ─── Orbiting atom-style ring with glowing pole spheres ─── */
function OrbitingRing({ def }: { def: RingDef }) {
  const spinRef = useRef<THREE.Group>(null)

  // Spin the ring around its local Z-axis (plane normal) in useFrame
  useFrame((_, delta) => {
    const g = spinRef.current
    if (g) {
      g.rotation.z += def.speed * delta
    }
  })

  return (
    <group rotation={def.tilt}>
      <group ref={spinRef}>
        {/* Main torus ring */}
        <mesh>
          <torusGeometry args={[def.radius, def.tube, 32, 128]} />
          <meshStandardMaterial 
            color={def.color} 
            metalness={def.metalness} 
            roughness={def.roughness} 
            envMapIntensity={1.2} 
          />
        </mesh>
        
        {/* Accent glowing spheres at top and bottom poles */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[0, def.radius * s, 0]}>
            <sphereGeometry args={[def.poleSize, 24, 24]} />
            <meshStandardMaterial
              color={def.accent}
              emissive={def.accent}
              emissiveIntensity={1.2}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Rings() {
  return (
    <group position={[0, RING_CENTER_Y, 0]}>
      {RINGS.map((r, i) => (
        <OrbitingRing key={i} def={r} />
      ))}
    </group>
  )
}

/* ─── Loading placeholder while the GLB streams in ─── */
function LoadingOverlay() {
  const { active } = useProgress()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!active) {
      const t = window.setTimeout(() => setHidden(true), 800)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [active])

  if (hidden) return null
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="w-12 h-12 rounded-full border-2 border-[#8B4513]/15 border-t-[#8B4513] animate-spin" />
    </div>
  )
}

type Pill = {
  label: string
  Icon: LucideIcon
  style: CSSProperties
  dur: number
  delay: number
}

// Fixed 2D screen positions matching the reference design layout
const PILLS: Pill[] = [
  { label: 'Library', Icon: BookOpen, style: { top: '1%', right: '12%' }, dur: 4.2, delay: 0 },
  { label: 'Attendance', Icon: Calendar, style: { top: '22%', right: '4%' }, dur: 4.8, delay: 1.2 },
  { label: 'Fees', Icon: IndianRupee, style: { top: '50%', right: '2%' }, dur: 4.4, delay: 0.9 },
  { label: 'Transport', Icon: Bus, style: { bottom: '10%', right: '10%' }, dur: 5.0, delay: 0.5 },
  { label: 'Homework', Icon: FileEdit, style: { bottom: '10%', left: '10%' }, dur: 4.0, delay: 1.5 },
  { label: 'Communication', Icon: MessageCircle, style: { top: '50%', left: '2%' }, dur: 3.6, delay: 0.3 },
  { label: 'Admissions', Icon: UserPlus, style: { top: '22%', left: '4%' }, dur: 3.8, delay: 0.6 },
]

export default function Hero3D() {
  return (
    <div className="relative w-full h-[680px] max-md:h-[420px] max-md:scale-[0.65] flex items-center justify-center">
      <div className="relative w-[560px] h-[560px]">
        <LoadingOverlay />

        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 9.6], fov: 34 }}
          gl={{
            alpha: true,
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          style={{ background: 'transparent' }}
        >
          {/* Ambient Fill Light */}
          <ambientLight intensity={0.4} />
          
          {/* Key Light: warm directional from front-upper-left */}
          <directionalLight position={[-3, 4, 4]} intensity={1.2} color="#fff2e0" />

          <Suspense fallback={null}>
            <StudentModel />
            <Rings />
            
            {/* Soft contact shadow under feet */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.4}
              scale={6.5}
              blur={2.5}
              far={3.5}
              color="#4a2f15"
              resolution={512}
            />
            
            {/* Realistic environment preset */}
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>

        {/* Floating Label Pills */}
        {PILLS.map((p) => (
          <motion.div
            key={p.label}
            className="absolute z-30 flex items-center gap-2.5 pl-2 pr-5 py-2 rounded-full cursor-default"
            style={{
              ...p.style,
              background: '#FFFDF9',
              border: '1px solid rgba(139,69,19,0.08)',
              boxShadow: '0 8px 24px rgba(139,69,19,0.12), 0 2px 8px rgba(139,69,19,0.06)',
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            whileHover={{ scale: 1.06 }}
          >
            <div className="w-8 h-8 rounded-full bg-[#F5DFC8] flex items-center justify-center shrink-0">
              <p.Icon size={15} color="#3D2B1F" strokeWidth={2.2} />
            </div>
            <span className="text-[13px] font-medium text-[#3D2B1F] whitespace-nowrap">{p.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
