# Model 3D (GLB)

Folder ini adalah slot untuk mesh GLTF/GLB asli.

- `f1zr.glb` → dipakai otomatis saat base machine **Yamaha F1ZR** dipilih
- `125z.glb` → dipakai otomatis saat base machine **Yamaha 125Z** dipilih

Selama file belum ada, aplikasi memakai model prosedural bawaan. Saat file
ditemukan, `BikeAsset` memuatnya, menyalakan shadow, lalu menormalkan skala
(panjang ±2,02 unit) dan menaruh roda menyentuh lantai showroom.

Catatan:

- Format harus binary `.glb` (bukan `.gltf` + folder tekstur).
- Material, livery, dan part (knalpot/velg/karburator/magnet) hanya berlaku
  pada model prosedural. Model GLB tampil apa adanya sesuai material di file.
- Arah hadap ideal: sumbu +Z sebagai depan motor.
