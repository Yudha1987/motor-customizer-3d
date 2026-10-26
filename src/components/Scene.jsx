import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Bike from './ThreeModels'
import BikeAsset from './BikeAsset'

function CameraRig({ resetSignal }) {
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls)
  const size = useThree((state) => state.size)
  const initialized = useRef(false)

  useEffect(() => {
    if (!controls) return
    if (initialized.current && resetSignal === 0) return

    const aspect = size.width / Math.max(size.height, 1)
    const distance = aspect < 0.85 ? 7.4 : aspect < 1.05 ? 5.8 : 5.2
    camera.position.set(distance * 0.85, distance * 0.31, distance * 0.48)
    controls.target.set(0, 0.66, 0)
    controls.update()
    initialized.current = true
  }, [controls, camera, resetSignal, size.width, size.height])

  return null
}

function CaptureBridge({ apiRef }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useEffect(() => {
    apiRef.current = {
      snapshot: (filename = 'apex-moto-build.png') => {
        const aspect = size.width / Math.max(size.height, 1)
        let width = 3200
        let height = Math.round(width / Math.max(aspect, 0.2))
        if (height > 4000) {
          height = 4000
          width = Math.round(height * aspect)
        }

        const previousSize = gl.getSize(new THREE.Vector2())
        const previousPixelRatio = gl.getPixelRatio()
        const previousAspect = camera.aspect
        const previousColor = gl.getClearColor(new THREE.Color())
        const previousAlpha = gl.getClearAlpha()

        gl.setPixelRatio(1)
        gl.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        gl.setClearColor('#0a0c10', 1)
        gl.render(scene, camera)

        const data = gl.domElement.toDataURL('image/png')

        gl.setPixelRatio(previousPixelRatio)
        gl.setSize(previousSize.x, previousSize.y, false)
        gl.setClearColor(previousColor, previousAlpha)
        camera.aspect = previousAspect
        camera.updateProjectionMatrix()
        gl.render(scene, camera)

        const link = document.createElement('a')
        link.href = data
        link.download = filename
        link.click()
      },
    }

    return () => {
      apiRef.current = null
    }
  }, [apiRef, gl, scene, camera, size.width, size.height])

  return null
}

function Showroom() {
  return (
    <group>
      <mesh position={[0, -0.035, 0]} receiveShadow>
        <cylinderGeometry args={[2.18, 2.26, 0.07, 96]} />
        <meshStandardMaterial color="#131519" metalness={0.42} roughness={0.62} />
      </mesh>

      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.04, 96]} />
        <meshStandardMaterial color="#0e1014" metalness={0.48} roughness={0.52} />
      </mesh>

      <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.015, 2.045, 128]} />
        <meshBasicMaterial color="#e15b34" transparent opacity={0.55} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.86, 1.872, 128]} />
        <meshBasicMaterial color="#8c929b" transparent opacity={0.18} toneMapped={false} />
      </mesh>

      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.72}
        scale={5.4}
        blur={2.1}
        far={2.6}
        resolution={512}
        color="#000000"
        frames={1}
      />
    </group>
  )
}

export default function Scene({ modelId, parts, livery, autoRotate, resetSignal, apiRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.9, 2.1, 4.5], fov: 38, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <CameraRig resetSignal={resetSignal} />
      <CaptureBridge apiRef={apiRef} />

      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#dfe8ff', '#15100c', 0.55]} />

      <directionalLight
        castShadow
        position={[4.5, 7.5, 4.2]}
        intensity={2.4}
        color="#fff6ec"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-bias={-0.00025}
      />
      <directionalLight position={[-5, 3.2, -2.5]} intensity={1.5} color="#8fc5ff" />
      <directionalLight position={[0, 2.5, -5]} intensity={1.1} color="#ff9a6a" />

      <pointLight position={[2.8, 1.1, 2.4]} intensity={22} distance={7} color="#ff8a56" />
      <pointLight position={[-2.6, 1.3, 1.4]} intensity={14} distance={6} color="#6fb5ff" />
      <spotLight
        position={[0, 6.4, 1.2]}
        angle={0.55}
        penumbra={1}
        intensity={90}
        distance={20}
        color="#ffe3bb"
      />

      <Environment frames={1} resolution={256}>
        <Lightformer intensity={5} position={[0, 5, -5]} scale={[10, 5, 1]} color="#ffffff" />
        <Lightformer intensity={2.2} position={[-5, 2, 2]} scale={[4, 5, 1]} color="#9bd4ff" />
        <Lightformer intensity={2.8} position={[5, 2, 2]} scale={[4, 5, 1]} color="#ffb07a" />
        <Lightformer intensity={1.6} position={[0, 1.5, 6]} scale={[10, 6, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={3} position={[0, 4, 0]} scale={[4, 4, 1]} color="#ffe7c4" />
      </Environment>

      <BikeAsset
        key={modelId}
        url={`${import.meta.env.BASE_URL}models/${modelId}.glb`}
      >
        <Bike modelId={modelId} parts={parts} livery={livery} />
      </BikeAsset>
      <Showroom />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={3.4}
        maxDistance={9.5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.03}
        target={[0, 0.66, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.85}
      />
    </Canvas>
  )
}
