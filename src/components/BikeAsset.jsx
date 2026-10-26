import { useEffect, useState } from 'react'
import * as THREE from 'three'

const GLB_MAGIC = 'glTF'
const TARGET_LENGTH = 2.02

function disposeObject(object) {
  object.traverse((node) => {
    if (!node.isMesh) return
    node.geometry?.dispose()
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => {
      if (!material) return
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose()
      })
      material.dispose()
    })
  })
}

function normalizeScene(root) {
  root.traverse((node) => {
    if (!node.isMesh) return
    node.castShadow = true
    node.receiveShadow = true
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => {
      if (material?.map) material.map.colorSpace = THREE.SRGBColorSpace
    })
  })

  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const length = Math.max(size.x, size.z, 0.001)
  const scale = TARGET_LENGTH / length

  root.scale.setScalar(scale)
  root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

  const wrapper = new THREE.Group()
  wrapper.name = 'bike-glb'
  wrapper.add(root)
  return wrapper
}

/**
 * Loads a per-model GLB from `public/models/<modelId>.glb` when it exists and
 * falls back to the procedural mesh otherwise. Assets are normalized so any
 * export scale/origin drops straight onto the showroom floor.
 */
export default function BikeAsset({ url, children }) {
  const [asset, setAsset] = useState(null)

  useEffect(() => {
    let cancelled = false
    let prepared = null

    async function load() {
      try {
        const response = await fetch(url)
        if (!response.ok) return

        const buffer = await response.arrayBuffer()
        const magic = new TextDecoder().decode(new Uint8Array(buffer, 0, 4))
        if (magic !== GLB_MAGIC) return

        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const gltf = await new Promise((resolve, reject) => {
          new GLTFLoader().parse(buffer, '', resolve, reject)
        })
        if (cancelled) {
          disposeObject(gltf.scene)
          return
        }

        prepared = normalizeScene(gltf.scene)
        setAsset(prepared)
      } catch {
        if (!cancelled) setAsset(null)
      }
    }

    load()

    return () => {
      cancelled = true
      if (prepared) disposeObject(prepared)
    }
  }, [url])

  if (!asset) return children
  return <primitive object={asset} />
}
