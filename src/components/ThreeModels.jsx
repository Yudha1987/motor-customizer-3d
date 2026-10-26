import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

/* ------------------------------------------------------------------ */
/*  Catalogue                                                          */
/* ------------------------------------------------------------------ */

export const MODELS = [
  {
    id: 'f1zr',
    name: 'Yamaha F1ZR',
    series: '2-Stroke Moped',
    years: '1997–2004',
    engine: '110 cc',
    tagline: 'Bebek 2-tak legendaris dengan harga paling ramah.',
    blurb: 'Mesin 110 cc responsif, parts murah, dan gampang dioprek. Ikon pelajar era 90-an.',
    tip: 'Harga pasar bekas 1997–2004 berkisar Rp 7–12,5 juta. Suku cadang murah dan mesin gampang dibongkar-pasang.',
    basePrice: 12500000,
    power: '8.6 hp',
    weight: '97 kg',
  },
  {
    id: 'z125',
    name: 'Yamaha 125Z',
    series: '2-Stroke Underbone',
    engine: '125 cc',
    tagline: 'Underbone 2-tak impor dari Malaysia.',
    blurb: '125 cc yang nendang, ringan, dan favorit kelas balap nostalgia Underbone 2-tak.',
    tip: 'Kampas kopling Honda Astrea Grand atau Tiger bisa langsung dipasang — lebih murah, ukuran sama, gigitan lebih pakem.',
    basePrice: 30000000,
    power: '17.3 hp',
    weight: '102 kg',
  },
]

export const PART_GROUPS = [
  {
    id: 'exhaust',
    label: 'Knalpot',
    icon: 'exhaust',
    options: [
      { id: 'street', name: 'Stock Pipe', note: 'Standar chrome', price: 0 },
      { id: 'race', name: 'Chamber Racing', note: 'Knalpot kolong 2-tak', price: 3500000 },
      { id: 'retro', name: 'Megaphone', note: 'Chrome cone', price: 2900000 },
    ],
  },
  {
    id: 'wheels',
    label: 'Velg',
    icon: 'wheels',
    options: [
      { id: 'sport', name: '5-Spoke', note: 'Enkei / OEM', price: 0 },
      { id: 'wire', name: 'Wire Spoke', note: 'Jari-jari chrome', price: 1500000 },
      { id: 'offroad', name: 'Knobby', note: 'Racing compound', price: 1200000 },
    ],
  },
  {
    id: 'tires',
    label: 'Ban',
    icon: 'tires',
    options: [
      { id: 'fdr', name: 'FDR', note: 'Sport touring', price: 0 },
      { id: 'maxxis', name: 'Maxxis', note: 'Grip basah', price: 450000 },
      { id: 'battlax', name: 'Battlax', note: 'Soft compound', price: 750000 },
    ],
  },
  {
    id: 'carb',
    label: 'Karburator',
    icon: 'carb',
    options: [
      { id: 'vm22', name: 'Mikuni VM22', note: 'Standar 22 mm', price: 0 },
      { id: 'pe28', name: 'Keihin PE28', note: '28 mm racing', price: 1200000 },
      { id: 'pwk28', name: 'Sudco PWK28', note: 'Flat slide 28 mm', price: 1800000 },
    ],
  },
  {
    id: 'magnet',
    label: 'Magnet',
    icon: 'magnet',
    options: [
      { id: 'oem', name: 'Magnet OEM', note: 'Standar', price: 0 },
      { id: 'bubut', name: 'Magnet Bubut', note: 'Racing ringan', price: 450000 },
      { id: 'kimcil', name: 'Rotor Kimcil / RM', note: 'Kit pengapian', price: 1200000 },
    ],
  },
  {
    id: 'engine',
    label: 'Mesin',
    icon: 'engine',
    options: [
      { id: 'stock', name: 'Stock 2-Tak', note: '110 / 125 cc', price: 0 },
      { id: 'ported', name: 'Porting Racing', note: 'Port + squish', price: 2500000 },
      { id: 'bigbore', name: 'Big Bore 150', note: 'High comp', price: 5500000 },
    ],
  },
]

export const DEFAULT_PARTS = {
  exhaust: 'street',
  wheels: 'sport',
  tires: 'fdr',
  carb: 'vm22',
  magnet: 'oem',
  engine: 'stock',
}

export const DEFAULT_LIVERY = {
  primary: '#d2542f',
  secondary: '#15171b',
  accent: '#e6c48a',
  finish: 'gloss',
  texture: null,
  textureName: '',
}

export const LIVERY_PRESETS = [
  { name: 'Ember', primary: '#d2542f', secondary: '#15171b', accent: '#e6c48a' },
  { name: 'Acid', primary: '#c8f751', secondary: '#111315', accent: '#7dd3fc' },
  { name: 'Midnight', primary: '#3056e0', secondary: '#0e0f12', accent: '#8be9fd' },
  { name: 'Bone', primary: '#e7e2d6', secondary: '#1a1a1a', accent: '#c0562f' },
  { name: 'Sakura', primary: '#f0a7be', secondary: '#201a1e', accent: '#f2d36b' },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatIDR(value) {
  return idr.format(value).replace(/\s/g, ' ')
}

export function formatDelta(value) {
  if (!value) return 'Included'
  const millions = value / 1_000_000
  return `+${millions.toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
}

export function optionPrice(groupId, optionId) {
  const group = PART_GROUPS.find((g) => g.id === groupId)
  return group?.options.find((o) => o.id === optionId)?.price ?? 0
}

export function buildTotal(modelId, parts) {
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0]
  return Object.entries(parts).reduce(
    (sum, [groupId, optionId]) => sum + optionPrice(groupId, optionId),
    model.basePrice,
  )
}

export function optionName(groupId, optionId) {
  const group = PART_GROUPS.find((g) => g.id === groupId)
  return group?.options.find((o) => o.id === optionId)?.name ?? '—'
}

const BIKE_CONFIG = {
  f1zr: {
    frontZ: 0.88,
    rearZ: -0.84,
    frontR: 0.41,
    rearR: 0.42,
    tankPos: [0, 1.05, 0.14],
    tankScale: [0.3, 0.23, 0.45],
    seatPos: [0, 1.06, -0.29],
    seatSize: [0.32, 0.1, 0.5],
    tailPos: [0, 1.1, -0.66],
    tailSize: [0.3, 0.16, 0.42],
    bars: 'clip',
    headlight: 'led',
    fender: 'low',
    features: { fairing: true, raisedTail: true },
  },
  z125: {
    frontZ: 0.85,
    rearZ: -0.82,
    frontR: 0.42,
    rearR: 0.42,
    tankPos: [0, 1.03, 0.08],
    tankScale: [0.31, 0.24, 0.46],
    seatPos: [0, 1.02, -0.32],
    seatSize: [0.31, 0.08, 0.5],
    tailPos: [0, 1.06, -0.66],
    tailSize: [0.28, 0.15, 0.36],
    bars: 'flat',
    headlight: 'led',
    fender: 'low',
    features: { numberBoards: true },
  },
}

const METAL = {
  dark: '#23262c',
  steel: '#c3c8d1',
  brushed: '#8d939c',
  gold: '#c9a86a',
  black: '#121417',
}

/* ------------------------------------------------------------------ */
/*  Materials                                                          */
/* ------------------------------------------------------------------ */

function paintProps(finish) {
  if (finish === 'matte') return { roughness: 0.74, metalness: 0.14, clearcoat: 0 }
  if (finish === 'metal') return { roughness: 0.2, metalness: 0.94, clearcoat: 0.4 }
  return { roughness: 0.26, metalness: 0.42, clearcoat: 1, clearcoatRoughness: 0.06 }
}

function PaintMaterial({ color, finish, map, side, ...rest }) {
  return (
    <meshPhysicalMaterial
      color={map ? '#ffffff' : color}
      map={map}
      side={side}
      envMapIntensity={1.25}
      {...paintProps(finish)}
      {...rest}
    />
  )
}

function useLiveryMap(src) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!src) {
      setMap(null)
      return undefined
    }
    let cancelled = false
    const texture = new THREE.TextureLoader().load(
      src,
      (loaded) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.wrapS = THREE.RepeatWrapping
        loaded.wrapT = THREE.RepeatWrapping
        loaded.repeat.set(2.4, 2.4)
        loaded.anisotropy = 4
        setMap(loaded)
      },
      undefined,
      () => setMap(null),
    )
    return () => {
      cancelled = true
      texture.dispose()
    }
  }, [src])

  return map
}

/* ------------------------------------------------------------------ */
/*  Primitive builders                                                 */
/* ------------------------------------------------------------------ */

function Bar({ a, b, radius = 0.02, color = METAL.dark, metalness = 0.9, roughness = 0.3, segments = 12 }) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...a)
    const end = new THREE.Vector3(...b)
    const delta = new THREE.Vector3().subVectors(end, start)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.clone().normalize(),
    )
    return { position: mid, quaternion: quat, length: delta.length() }
  }, [a[0], a[1], a[2], b[0], b[1], b[2]])

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, segments]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  )
}

function Tube({ points, radius = 0.03, color = METAL.steel, metalness = 1, roughness = 0.24, segments = 48 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(curve, segments, radius, 10, false)
  }, [JSON.stringify(points), radius, segments])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  )
}

function Bolt({ position, radius = 0.018, color = METAL.steel, axis = 'x' }) {
  const rotation = axis === 'x' ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, 0.012, 16]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.22} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Wheels                                                             */
/* ------------------------------------------------------------------ */

const TIRE_BRANDS = {
  fdr: '#e8e6df',
  maxxis: '#e6b93a',
  battlax: '#d95343',
}

function Wheel({ z, radius, variant, accent, tire = 'fdr' }) {
  const alloy = variant !== 'wire'
  const spokeCount = variant === 'offroad' ? 6 : 5
  const brandColor = TIRE_BRANDS[tire] ?? TIRE_BRANDS.fdr

  return (
    <group position={[0, radius, z]}>
      {/* Tire */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <torusGeometry args={[radius * 0.84, radius * 0.16, 20, 72]} />
        <meshStandardMaterial color="#0a0b0d" roughness={0.86} metalness={0.04} />
      </mesh>

      {/* Ban brand sidewall stripe */}
      {[-1, 1].map((side) => (
        <mesh
          key={`brand-${side}`}
          position={[side * radius * 0.135, 0, 0]}
          rotation={[0, (side * Math.PI) / 2, 0]}
        >
          <ringGeometry args={[radius * 0.78, radius * 0.832, 48]} />
          <meshStandardMaterial
            color={brandColor}
            metalness={0.08}
            roughness={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Rim barrel */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 0.62, radius * 0.023, 10, 64]} />
        <meshStandardMaterial
          color={variant === 'wire' ? METAL.steel : '#3a3f47'}
          metalness={1}
          roughness={variant === 'wire' ? 0.16 : 0.28}
        />
      </mesh>

      {variant === 'wire' ? (
        Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const side = i % 2 === 0 ? 1 : -1
          return (
            <Bar
              key={i}
              a={[side * 0.035, 0, 0]}
              b={[side * 0.008, Math.cos(angle) * radius * 0.62, Math.sin(angle) * radius * 0.62]}
              radius={radius * 0.0075}
              color={METAL.steel}
              metalness={1}
              roughness={0.2}
              segments={6}
            />
          )
        })
      ) : (
        Array.from({ length: spokeCount }).map((_, i) => (
          <group key={i} rotation={[(i / spokeCount) * Math.PI * 2, 0, 0]}>
            <mesh position={[0, radius * 0.31, 0]} castShadow>
              <boxGeometry args={[0.034, radius * 0.62, variant === 'offroad' ? 0.085 : 0.05]} />
              <meshStandardMaterial
                color={variant === 'offroad' ? '#2c3037' : '#343941'}
                metalness={0.92}
                roughness={0.26}
              />
            </mesh>
          </group>
        ))
      )}

      {/* Hub + axle */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius * 0.15, radius * 0.15, alloy ? 0.19 : 0.12, 24]} />
        <meshStandardMaterial color={METAL.dark} metalness={0.9} roughness={0.3} />
      </mesh>
      <Bolt position={[0, 0, 0]} radius={radius * 0.06} />
      <Bolt position={[0.1, 0, 0]} radius={radius * 0.055} color={accent} />

      {/* Brake disc */}
      <mesh position={[0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.34, radius * 0.34, 0.01, 32]} />
        <meshStandardMaterial color="#9aa1ab" metalness={1} roughness={0.32} />
      </mesh>
      <mesh position={[0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.1, radius * 0.1, 0.014, 20]} />
        <meshStandardMaterial color="#4a5059" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Caliper */}
      <mesh position={[0.082, radius * 0.26, radius * 0.2]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.035, 0.075, 0.13]} />
        <meshStandardMaterial color={accent} metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Knobby tread */}
      {variant === 'offroad' &&
        Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2
          return (
            <mesh
              key={`tread-${i}`}
              position={[0, Math.cos(angle) * radius, Math.sin(angle) * radius]}
              rotation={[-angle, 0, 0]}
              castShadow
            >
              <boxGeometry args={[radius * 0.48, radius * 0.2, radius * 0.09]} />
              <meshStandardMaterial color="#111215" roughness={0.94} />
            </mesh>
          )
        })}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Front end                                                          */
/* ------------------------------------------------------------------ */

function Fender({ config, paint, high = false }) {
  const baseR = config.frontR
  const ringR = baseR * (high ? 1.1 : 1.08)
  const lift = high ? 0.07 : 0.015

  return (
    <group position={[0, baseR + lift, config.frontZ]} rotation={[0, Math.PI / 2, 0]}>
      <mesh rotation={[0, 0, 0.42]} scale={[1, 1, 6.2]} castShadow>
        <torusGeometry args={[ringR, baseR * 0.045, 6, 30, Math.PI * 0.78]} />
        <PaintMaterial {...paint} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Headlight({ config }) {
  const z = config.frontZ + 0.07
  const y = 1.02

  if (config.headlight === 'led') {
    return (
      <group position={[0, y, z]}>
        <RoundedBox args={[0.2, 0.13, 0.12]} radius={0.03} smoothness={4} castShadow>
          <meshStandardMaterial color="#0e1013" metalness={0.65} roughness={0.32} />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.046, 0, 0.065]}>
            <boxGeometry args={[0.046, 0.066, 0.012]} />
            <meshStandardMaterial
              color="#fff4d6"
              emissive="#ffe6ad"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.064]}>
          <boxGeometry args={[0.135, 0.012, 0.006]} />
          <meshStandardMaterial
            color="#ffcf9a"
            emissive="#ff8a3d"
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.155, 0.17, 0.15, 32]} />
        <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0, 0.078]}>
        <circleGeometry args={[0.138, 32]} />
        <meshStandardMaterial
          color="#fff3d9"
          emissive="#ffdb9e"
          emissiveIntensity={1.6}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.081]}>
        <ringGeometry args={[0.142, 0.158, 32]} />
        <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.18} />
      </mesh>
      {config.features?.grille &&
        [-1, 0, 1].map((n) => (
          <mesh key={n} position={[n * 0.06, 0, 0.088]}>
            <boxGeometry args={[0.012, 0.25, 0.01]} />
            <meshStandardMaterial color="#2a2c30" metalness={0.7} roughness={0.5} />
          </mesh>
        ))}
    </group>
  )
}

function Bars({ config }) {
  const topZ = config.frontZ - 0.2
  const topY = 1.06

  if (config.bars === 'clip') {
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side}>
            <Bar
              a={[side * 0.1, topY, topZ]}
              b={[side * 0.27, topY + 0.02, topZ - 0.15]}
              radius={0.016}
              color={METAL.black}
              roughness={0.4}
            />
            <mesh position={[side * 0.27, topY + 0.02, topZ - 0.15]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.13, 12]} />
              <meshStandardMaterial color="#17191d" roughness={0.86} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  const wide = config.bars === 'wide'
  const width = wide ? 0.36 : 0.3
  const y = wide ? 1.17 : 1.09
  const z = topZ - 0.03

  return (
    <group>
      {wide &&
        [-1, 1].map((side) => (
          <Bar
            key={`riser-${side}`}
            a={[side * 0.1, topY - 0.01, topZ]}
            b={[side * 0.1, y, z]}
            radius={0.017}
            color={METAL.black}
          />
        ))}
      <Bar a={[-width, y, z]} b={[width, y, z]} radius={0.017} color={METAL.black} roughness={0.4} />
      {[-1, 1].map((side) => (
        <mesh key={`grip-${side}`} position={[side * (width - 0.04), y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.13, 12]} />
          <meshStandardMaterial color="#17191d" roughness={0.86} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={`mirror-${side}`}>
          <Bar
            a={[side * 0.23, y + 0.01, z]}
            b={[side * 0.3, y + 0.14, z + 0.02]}
            radius={0.008}
            color={METAL.black}
          />
          <mesh position={[side * 0.3, y + 0.15, z + 0.02]} scale={[0.075, 0.05, 0.014]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#9ba3ad" metalness={1} roughness={0.08} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function FrontEnd({ config, paint, livery }) {
  const { frontZ, frontR } = config
  const topY = 1.06
  const topZ = frontZ - 0.2

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Bar
            a={[side * 0.125, frontR, frontZ]}
            b={[side * 0.125, 0.78, frontZ - 0.09]}
            radius={0.038}
            color={METAL.gold}
            metalness={1}
            roughness={0.26}
          />
          <Bar
            a={[side * 0.125, 0.76, frontZ - 0.1]}
            b={[side * 0.125, topY, topZ]}
            radius={0.026}
            color={METAL.steel}
            metalness={1}
            roughness={0.16}
          />
          {config.features?.gaiters && (
            <mesh position={[side * 0.125, 0.69, frontZ - 0.055]} rotation={[0.17, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.2, 12]} />
              <meshStandardMaterial color="#15171a" roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}

      <Bar a={[-0.155, topY - 0.03, topZ]} b={[0.155, topY - 0.03, topZ]} radius={0.034} color={METAL.dark} />
      <Bar a={[-0.14, frontR + 0.3, frontZ - 0.045]} b={[0.14, frontR + 0.3, frontZ - 0.045]} radius={0.022} color={METAL.dark} />
      <Bar a={[0, 1.0, topZ + 0.02]} b={[0, 1.01, frontZ + 0.01]} radius={0.018} color={METAL.dark} />

      <Fender config={config} paint={paint} high={config.fender === 'high'} />
      <Headlight config={config} />
      <Bars config={config} />

      {/* Steering damper detail */}
      <Bar
        a={[0.13, 0.98, frontZ - 0.1]}
        b={[0.2, 0.9, frontZ - 0.25]}
        radius={0.012}
        color={livery.accent}
        metalness={0.9}
        roughness={0.3}
      />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Frame, swingarm & ancillaries                                      */
/* ------------------------------------------------------------------ */

function FrameSet({ config, livery }) {
  const { frontZ, rearZ, rearR } = config
  const frame = livery.secondary
  const accent = livery.accent

  return (
    <group>
      {/* Headstock */}
      <Bar a={[0, 1.1, frontZ - 0.27]} b={[0, 1.0, frontZ - 0.42]} radius={0.047} color={frame} roughness={0.42} />
      {/* Main spar */}
      <Bar a={[0, 1.0, frontZ - 0.4]} b={[0, 0.96, -0.24]} radius={0.05} color={frame} roughness={0.42} />
      {[-1, 1].map((side) => (
        <Bar
          key={side}
          a={[side * 0.115, 0.99, frontZ - 0.44]}
          b={[side * 0.135, 0.9, -0.28]}
          radius={0.026}
          color={frame}
          roughness={0.45}
        />
      ))}
      {/* Down tube */}
      <Bar a={[0, 0.99, frontZ - 0.44]} b={[0, 0.52, 0.24]} radius={0.04} color={frame} roughness={0.45} />
      <Bar a={[0, 0.56, 0.18]} b={[0, 0.5, -0.22]} radius={0.035} color={frame} roughness={0.45} />

      {/* Swingarm */}
      {[-1, 1].map((side) => (
        <Bar
          key={`arm-${side}`}
          a={[side * 0.155, 0.51, -0.22]}
          b={[side * 0.15, rearR, rearZ]}
          radius={0.033}
          color={METAL.dark}
          roughness={0.35}
        />
      ))}
      <Bar a={[-0.155, 0.51, -0.22]} b={[0.155, 0.51, -0.22]} radius={0.024} color={METAL.dark} />

      {/* Shocks */}
      {[-1, 1].map((side) => (
        <group key={`shock-${side}`}>
          <Bar
            a={[side * 0.1, 0.9, -0.27]}
            b={[side * 0.1, 0.52, -0.39]}
            radius={0.033}
            color={accent}
            metalness={0.95}
            roughness={0.22}
          />
          <Bar
            a={[side * 0.1, 0.85, -0.29]}
            b={[side * 0.1, 0.74, -0.32]}
            radius={0.046}
            color="#2a2d33"
            roughness={0.6}
          />
        </group>
      ))}

      {/* Subframe */}
      {[-1, 1].map((side) => (
        <group key={`sub-${side}`}>
          <Bar
            a={[side * 0.1, 0.96, -0.28]}
            b={[side * 0.1, 1.03, -0.74]}
            radius={0.022}
            color={frame}
            roughness={0.45}
          />
          <Bar
            a={[side * 0.1, 0.84, -0.3]}
            b={[side * 0.1, 1.0, -0.7]}
            radius={0.015}
            color={frame}
            roughness={0.5}
          />
        </group>
      ))}
      <Bar a={[-0.1, 1.03, -0.73]} b={[0.1, 1.03, -0.73]} radius={0.016} color={frame} />

      {/* Footpegs & levers */}
      {[-1, 1].map((side) => (
        <group key={`peg-${side}`}>
          <Bar
            a={[side * 0.15, 0.48, -0.06]}
            b={[side * 0.27, 0.48, -0.06]}
            radius={0.013}
            color={METAL.brushed}
          />
          <mesh position={[side * 0.24, 0.48, -0.06]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.1, 10]} />
            <meshStandardMaterial color="#17191d" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Chain + sprocket */}
      <Bar a={[-0.11, 0.53, -0.2]} b={[-0.11, rearR + 0.06, rearZ]} radius={0.012} color="#202329" />
      <Bar a={[-0.11, 0.47, -0.2]} b={[-0.11, rearR - 0.06, rearZ]} radius={0.012} color="#202329" />
      <mesh position={[-0.105, rearR, rearZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.016, 28]} />
        <meshStandardMaterial color="#4d535c" metalness={0.95} roughness={0.35} />
      </mesh>

      {/* Radiator */}
      <RoundedBox args={[0.3, 0.21, 0.05]} radius={0.012} smoothness={3} position={[0, 0.73, 0.34]} castShadow>
        <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.48} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <mesh key={`rad-${side}`} position={[side * 0.152, 0.73, 0.34]}>
          <boxGeometry args={[0.012, 0.17, 0.04]} />
          <meshStandardMaterial color={accent} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Rear hugger */}
      <group position={[0, rearR, rearZ]} rotation={[0, Math.PI / 2, 0]}>
        <mesh rotation={[0, 0, -0.6]} scale={[1, 1, 4]} castShadow>
          <torusGeometry args={[rearR * 1.08, rearR * 0.03, 5, 20, Math.PI * 0.5]} />
          <meshStandardMaterial color={frame} metalness={0.75} roughness={0.42} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Engine variants                                                    */
/* ------------------------------------------------------------------ */

function FinnedBarrel({ position = [0, 0, 0], rotation = [0, 0, 0], height = 0.3, radius = 0.1 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, height, 20]} />
        <meshStandardMaterial color="#454b54" metalness={0.88} roughness={0.38} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, -height / 2 + 0.03 + i * ((height - 0.06) / 6), 0]}>
          <cylinderGeometry args={[radius * 1.22, radius * 1.22, 0.012, 20]} />
          <meshStandardMaterial color="#565d67" metalness={0.9} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, height / 2 + 0.02, 0]} castShadow>
        <boxGeometry args={[radius * 2.1, 0.07, radius * 2.35]} />
        <meshStandardMaterial color="#262a30" metalness={0.82} roughness={0.4} />
      </mesh>
    </group>
  )
}

function MagnetRotor({ variant = 'oem', accent }) {
  const racing = variant !== 'oem'
  const kimcil = variant === 'kimcil'

  return (
    <group position={[-0.205, 0, 0.03]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[kimcil ? 0.092 : 0.1, kimcil ? 0.092 : 0.1, 0.035, 28]} />
        <meshStandardMaterial
          color={kimcil ? '#4b4740' : '#1b1e22'}
          metalness={racing ? 0.92 : 0.7}
          roughness={racing ? 0.26 : 0.45}
        />
      </mesh>

      {kimcil && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.062, 0.062, 0.045, 24]} />
          <meshStandardMaterial color={accent} metalness={0.9} roughness={0.24} />
        </mesh>
      )}

      {racing &&
        [-1, 1].map((side) => (
          <mesh
            key={`rotor-face-${side}`}
            position={[side * 0.019, 0, 0]}
            rotation={[0, (side * Math.PI) / 2, 0]}
          >
            <ringGeometry args={[kimcil ? 0.055 : 0.064, kimcil ? 0.088 : 0.096, 32]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.24} side={THREE.DoubleSide} />
          </mesh>
        ))}

      {variant === 'bubut' &&
        Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={`drill-${i}`}
              position={[-0.02, Math.cos(angle) * 0.048, Math.sin(angle) * 0.048]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.009, 0.009, 0.008, 10]} />
              <meshStandardMaterial color="#0b0c0e" metalness={0.4} roughness={0.7} />
            </mesh>
          )
        })}

      {kimcil &&
        Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
          return (
            <mesh
              key={`bolt-${i}`}
              position={[-0.024, Math.cos(angle) * 0.074, Math.sin(angle) * 0.074]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.007, 0.007, 0.012, 8]} />
              <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.2} />
            </mesh>
          )
        })}
    </group>
  )
}

function EngineBlock({ variant, accent, carb = 'vm22', magnet = 'oem' }) {
  const bigBore = variant === 'bigbore'
  const tuned = variant === 'ported' || bigBore
  const bore = bigBore ? 0.115 : tuned ? 0.102 : 0.092
  const stroke = bigBore ? 0.35 : tuned ? 0.315 : 0.285

  const carbSpec =
    carb === 'pwk28'
      ? { radius: 0.062, length: 0.185, body: '#3c424b', stack: true, flat: true }
      : carb === 'pe28'
        ? { radius: 0.055, length: 0.17, body: '#363b43', stack: true, flat: false }
        : { radius: 0.048, length: 0.16, body: '#2a2e34', stack: tuned, flat: false }
  const carbTuned = carb !== 'vm22'

  return (
    <group position={[0, 0.64, 0.02]}>
      {/* Crankcase */}
      <RoundedBox
        args={bigBore ? [0.42, 0.31, 0.48] : [0.4, 0.3, 0.48]}
        radius={0.05}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color="#2b2e34" metalness={0.86} roughness={0.36} />
      </RoundedBox>

      {/* Clutch / stator covers */}
      <mesh position={[0.205, 0.0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.045, 24]} />
        <meshStandardMaterial color={METAL.brushed} metalness={0.95} roughness={0.3} />
      </mesh>
      <mesh position={[0.233, 0.0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.078, 0.078, 0.014, 20]} />
        <meshStandardMaterial color={tuned ? accent : '#1a1d21'} metalness={0.9} roughness={0.26} />
      </mesh>
      <MagnetRotor variant={magnet} accent={accent} />

      {/* Single 2-stroke barrel */}
      <FinnedBarrel
        position={[0, 0.235, 0.04]}
        rotation={[-0.12, 0, 0]}
        height={stroke}
        radius={bore}
      />

      {/* Head + spark plug */}
      <mesh
        position={[0, 0.235 + stroke * 0.5 + 0.055, 0.11]}
        rotation={[-0.12, 0, 0]}
        castShadow
      >
        <boxGeometry args={[bore * 2.05, 0.032, bore * 2.2]} />
        <meshStandardMaterial color={tuned ? accent : '#3a3f47'} metalness={0.88} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.235 + stroke * 0.5 + 0.085, 0.185]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 0.075, 10]} />
        <meshStandardMaterial color="#d8dce2" metalness={0.95} roughness={0.24} />
      </mesh>

      {/* Reed block + carburetor */}
      <mesh position={[0.13, 0.31, -0.02]} rotation={[0, -0.45, 0]}>
        <boxGeometry args={[0.07, 0.15, 0.1]} />
        <meshStandardMaterial color="#23272d" metalness={0.82} roughness={0.38} />
      </mesh>
      <Bar
        a={[0.11, 0.31, -0.01]}
        b={[0.2, 0.36, -0.14]}
        radius={0.026}
        color={METAL.brushed}
        metalness={0.95}
        roughness={0.3}
      />
      <mesh
        position={[0.22, 0.4, -0.2]}
        rotation={[Math.PI / 2, 0, 0.25]}
        castShadow
      >
        <cylinderGeometry args={[carbSpec.radius, carbSpec.radius * 1.18, carbSpec.length, 18]} />
        <meshStandardMaterial
          color={carbSpec.body}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      {carbSpec.flat && (
        <mesh position={[0.22, 0.4, -0.16]} rotation={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.105, 0.095, 0.1]} />
          <meshStandardMaterial color={carbSpec.body} metalness={0.9} roughness={0.28} />
        </mesh>
      )}
      <mesh position={[0.22, 0.4, -0.285]} rotation={[Math.PI / 2, 0, 0.25]}>
        <cylinderGeometry args={[0.028, 0.028, 0.02, 14]} />
        <meshStandardMaterial color={carbTuned ? accent : '#8d939c'} metalness={0.9} roughness={0.25} />
      </mesh>
      {carbTuned && (
        <mesh position={[0.22, 0.4, -0.33]} rotation={[Math.PI / 2, 0, 0.25]}>
          <cylinderGeometry args={[0.072, 0.036, 0.07, 18, 1, true]} />
          <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.18} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Oil pump / detail */}
      <mesh position={[-0.12, -0.1, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.04, 14]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.85} roughness={0.35} />
      </mesh>
      {bigBore && (
        <mesh position={[0, -0.16, 0.04]}>
          <boxGeometry args={[0.34, 0.02, 0.42]} />
          <meshStandardMaterial color={accent} metalness={0.75} roughness={0.32} />
        </mesh>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Exhaust variants                                                   */
/* ------------------------------------------------------------------ */

function Exhaust({ variant, accent }) {
  if (variant === 'race') {
    return (
      <group>
        {/* Header from cylinder down to the underbelly chamber */}
        <Tube
          points={[
            [0.1, 0.66, 0.3],
            [0.19, 0.53, 0.22],
            [0.225, 0.41, 0.02],
            [0.2, 0.345, -0.2],
          ]}
          radius={0.031}
          color="#c9b9a8"
          roughness={0.28}
        />

        {/* Chamber kolong */}
        <mesh position={[0.2, 0.34, -0.41]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.078, 0.062, 0.44, 24]} />
          <meshStandardMaterial color="#b8ab9c" metalness={1} roughness={0.26} />
        </mesh>
        <mesh position={[0.2, 0.34, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.062, 0.045, 0.03, 24]} />
          <meshStandardMaterial color={accent} metalness={0.9} roughness={0.26} />
        </mesh>

        {/* Cone + stinger */}
        <mesh position={[0.2, 0.34, -0.675]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.075, 0.12, 22]} />
          <meshStandardMaterial color="#a99d90" metalness={1} roughness={0.24} />
        </mesh>
        <Bar
          a={[0.2, 0.35, -0.73]}
          b={[0.2, 0.37, -0.98]}
          radius={0.034}
          color="#c9b9a8"
          metalness={1}
          roughness={0.2}
          segments={16}
        />
        <mesh position={[0.2, 0.37, -0.99]}>
          <sphereGeometry args={[0.036, 16, 12]} />
          <meshStandardMaterial color="#16181b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Mount bracket */}
        <Bar a={[0.2, 0.42, -0.52]} b={[0.12, 0.55, -0.5]} radius={0.012} color={METAL.dark} />
      </group>
    )
  }

  if (variant === 'retro') {
    return (
      <group>
        <Tube
          points={[
            [0.1, 0.7, 0.3],
            [0.16, 0.56, 0.42],
            [0.23, 0.45, 0.28],
            [0.25, 0.44, 0.05],
          ]}
          radius={0.031}
          color={METAL.steel}
          roughness={0.2}
        />
        <Tube
          points={[
            [-0.1, 0.7, 0.3],
            [-0.03, 0.54, 0.38],
            [0.08, 0.46, 0.2],
            [0.17, 0.44, 0.05],
          ]}
          radius={0.026}
          color={METAL.steel}
          roughness={0.22}
        />
        <mesh position={[0.255, 0.44, -0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.108, 0.6, 28]} />
          <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.12} />
        </mesh>
        <mesh position={[0.255, 0.44, -0.582]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.012, 24]} />
          <meshStandardMaterial color="#111316" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0.255, 0.49, -0.25]}>
          <boxGeometry args={[0.02, 0.012, 0.4]} />
          <meshStandardMaterial color={accent} metalness={0.9} roughness={0.3} />
        </mesh>
        <Bar a={[0.21, 0.38, -0.46]} b={[0.14, 0.52, -0.4]} radius={0.012} color={METAL.dark} />
      </group>
    )
  }

  return (
    <group>
      <Tube
        points={[
          [0.1, 0.7, 0.3],
          [0.14, 0.55, 0.42],
          [0.2, 0.43, 0.3],
          [0.215, 0.41, 0.08],
        ]}
        radius={0.03}
        color={METAL.steel}
        roughness={0.22}
      />
      <Tube
        points={[
          [-0.1, 0.7, 0.3],
          [-0.08, 0.54, 0.4],
          [-0.02, 0.42, 0.3],
          [0.04, 0.4, 0.08],
        ]}
        radius={0.025}
        color={METAL.brushed}
        roughness={0.26}
      />
      <Bar a={[0.215, 0.41, 0.08]} b={[0.24, 0.42, -0.1]} radius={0.033} color={METAL.brushed} />
      <mesh position={[0.25, 0.43, -0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.062, 0.084, 0.5, 24]} />
        <meshStandardMaterial color={METAL.steel} metalness={1} roughness={0.24} />
      </mesh>
      <mesh position={[0.25, 0.43, -0.612]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.062, 0.07, 0.02, 20]} />
        <meshStandardMaterial color="#17191d" metalness={0.7} roughness={0.45} />
      </mesh>
      <mesh position={[0.25, 0.48, -0.35]}>
        <boxGeometry args={[0.022, 0.01, 0.32]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.3} />
      </mesh>
      <Bar a={[0.2, 0.39, -0.5]} b={[0.13, 0.52, -0.42]} radius={0.012} color={METAL.dark} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Bodywork                                                           */
/* ------------------------------------------------------------------ */

function Bodywork({ config, paint, livery }) {
  const { tankPos, tankScale, seatPos, seatSize, tailPos, tailSize } = config

  return (
    <group>
      {/* Fuel tank */}
      <mesh position={tankPos} scale={tankScale} castShadow receiveShadow>
        <sphereGeometry args={[1, 44, 30]} />
        <PaintMaterial {...paint} />
      </mesh>

      {/* Tank centre stripe */}
      <RoundedBox
        args={[0.055, 0.012, 0.24]}
        radius={0.004}
        smoothness={2}
        position={[0, tankPos[1] + tankScale[1] * 0.94, tankPos[2] + 0.02]}
      >
        <meshStandardMaterial color={livery.accent} metalness={0.85} roughness={0.26} />
      </RoundedBox>

      {/* Knee pads */}
      {[-1, 1].map((side) => (
        <mesh
          key={`knee-${side}`}
          position={[side * tankScale[0] * 0.8, tankPos[1] - 0.05, tankPos[2] - 0.02]}
          scale={[0.075, 0.145, 0.27]}
        >
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color="#101216" roughness={0.9} metalness={0.06} />
        </mesh>
      ))}

      {/* Tank badges */}
      {[-1, 1].map((side) => (
        <group key={`badge-${side}`}>
          <mesh
            position={[side * tankScale[0] * 0.94, tankPos[1], tankPos[2] + 0.04]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.052, 0.052, 0.014, 20]} />
            <meshStandardMaterial color={livery.accent} metalness={0.92} roughness={0.22} />
          </mesh>
          <mesh
            position={[side * tankScale[0] * 0.955, tankPos[1], tankPos[2] + 0.04]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.031, 0.031, 0.016, 18]} />
            <meshStandardMaterial color="#101216" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Seat */}
      <RoundedBox args={seatSize} radius={0.035} smoothness={4} position={seatPos} castShadow>
        <meshStandardMaterial color="#0e1013" roughness={0.93} metalness={0.04} />
      </RoundedBox>
      <RoundedBox
        args={[seatSize[0] * 0.62, 0.006, seatSize[2] * 0.72]}
        radius={0.002}
        smoothness={2}
        position={[seatPos[0], seatPos[1] + seatSize[1] / 2 + 0.004, seatPos[2]]}
      >
        <meshStandardMaterial color="#2b2e34" roughness={0.7} metalness={0.15} />
      </RoundedBox>

      {/* Tail cowl */}
      <RoundedBox
        args={tailSize}
        radius={0.05}
        smoothness={5}
        position={tailPos}
        rotation={[config.features?.raisedTail ? -0.1 : 0, 0, 0]}
        castShadow
      >
        <PaintMaterial {...paint} />
      </RoundedBox>
      <RoundedBox
        args={[tailSize[0] * 0.74, 0.01, tailSize[2] * 0.66]}
        radius={0.003}
        smoothness={2}
        position={[0, tailPos[1] + tailSize[1] / 2 + 0.002, tailPos[2] - 0.01]}
      >
        <meshStandardMaterial color={livery.accent} metalness={0.85} roughness={0.26} />
      </RoundedBox>

      {/* Tail light */}
      <mesh position={[0, tailPos[1] + 0.01, tailPos[2] - tailSize[2] / 2 - 0.006]}>
        <boxGeometry args={[0.12, 0.03, 0.012]} />
        <meshStandardMaterial
          color="#ff3b30"
          emissive="#ff2d20"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Tail number boards */}
      {config.features?.numberBoards &&
        [-1, 1].map((side) => (
          <group key={`board-${side}`}>
            <mesh
              position={[side * (tailSize[0] / 2 + 0.003), tailPos[1] + 0.02, tailPos[2]]}
              rotation={[0, (side * Math.PI) / 2, 0]}
            >
              <circleGeometry args={[0.098, 32]} />
              <meshStandardMaterial color="#ece7db" roughness={0.62} metalness={0.05} side={THREE.DoubleSide} />
            </mesh>
            <mesh
              position={[side * (tailSize[0] / 2 + 0.007), tailPos[1] + 0.02, tailPos[2]]}
              rotation={[0, (side * Math.PI) / 2, 0]}
            >
              <ringGeometry args={[0.099, 0.112, 32]} />
              <meshStandardMaterial color="#16181b" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

      {/* Rear rack */}
      {config.features?.rack && (
        <group>
          {[-1, 1].map((side) => (
            <group key={`rack-${side}`}>
              <Bar a={[side * 0.12, 1.12, -0.64]} b={[side * 0.12, 1.12, -0.86]} radius={0.011} color={METAL.brushed} />
              <Bar a={[side * 0.1, 1.03, -0.72]} b={[side * 0.12, 1.12, -0.78]} radius={0.009} color={METAL.brushed} />
            </group>
          ))}
          <Bar a={[-0.12, 1.12, -0.84]} b={[0.12, 1.12, -0.84]} radius={0.01} color={METAL.brushed} />
        </group>
      )}
    </group>
  )
}

function FrontFairing({ paint, livery }) {
  return (
    <group>
      {/* Nose */}
      <mesh position={[0, 1.01, 0.7]} scale={[0.255, 0.22, 0.23]} castShadow>
        <sphereGeometry args={[1, 32, 24]} />
        <PaintMaterial {...paint} />
      </mesh>

      {/* Windscreen */}
      <RoundedBox
        args={[0.27, 0.15, 0.016]}
        radius={0.02}
        smoothness={3}
        position={[0, 1.17, 0.65]}
        rotation={[-0.4, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#10151d"
          metalness={0.3}
          roughness={0.16}
          transparent
          opacity={0.62}
          clearcoat={1}
        />
      </RoundedBox>

      {/* Side fairings */}
      {[-1, 1].map((side) => (
        <group key={`fairing-${side}`}>
          <mesh position={[side * 0.245, 0.86, 0.4]} scale={[0.07, 0.18, 0.3]} castShadow>
            <sphereGeometry args={[1, 28, 20]} />
            <PaintMaterial {...paint} />
          </mesh>
          <mesh position={[side * 0.3, 0.9, 0.42]} rotation={[0, 0, 0.14]}>
            <boxGeometry args={[0.012, 0.02, 0.34]} />
            <meshStandardMaterial color={livery.accent} metalness={0.85} roughness={0.26} />
          </mesh>
          <mesh position={[side * 0.3, 0.72, 0.38]} scale={[0.008, 0.055, 0.22]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={METAL.black} metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Belly pan */}
      <RoundedBox args={[0.28, 0.12, 0.6]} radius={0.05} smoothness={3} position={[0, 0.45, 0.1]} castShadow>
        <meshStandardMaterial color={livery.secondary} metalness={0.65} roughness={0.45} />
      </RoundedBox>

      {/* Winglets */}
      {[-1, 1].map((side) => (
        <mesh
          key={`wing-${side}`}
          position={[side * 0.27, 0.94, 0.62]}
          rotation={[0.12, side * 0.25, side * 0.1]}
        >
          <boxGeometry args={[0.018, 0.055, 0.22]} />
          <meshStandardMaterial color={METAL.black} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Bike assembly                                                      */
/* ------------------------------------------------------------------ */

export default function Bike({ modelId, parts, livery }) {
  const config = BIKE_CONFIG[modelId] ?? BIKE_CONFIG.f1zr
  const map = useLiveryMap(livery.texture)
  const paint = useMemo(
    () => ({ color: livery.primary, finish: livery.finish, map }),
    [livery.primary, livery.finish, map],
  )

  return (
    <group name={`bike-${modelId}`}>
      <Wheel
        z={config.frontZ}
        radius={config.frontR}
        variant={parts.wheels}
        tire={parts.tires}
        accent={livery.accent}
      />
      <Wheel
        z={config.rearZ}
        radius={config.rearR}
        variant={parts.wheels}
        tire={parts.tires}
        accent={livery.accent}
      />

      <FrameSet config={config} livery={livery} />
      <EngineBlock
        variant={parts.engine}
        accent={livery.accent}
        carb={parts.carb}
        magnet={parts.magnet}
      />
      <Exhaust variant={parts.exhaust} accent={livery.accent} />
      <FrontEnd config={config} paint={paint} livery={livery} />
      <Bodywork config={config} paint={paint} livery={livery} />

      {config.features?.fairing && <FrontFairing paint={paint} livery={livery} />}
    </group>
  )
}
