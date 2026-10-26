# APEX/MOTO Customizer Studio

3D motorcycle customizer untuk dua bebek 2-tak legendaris Indonesia: **Yamaha F1ZR** dan **Yamaha 125Z**. Dibangun dengan React, Vite, dan Three.js.

## Fitur

- Showroom 3D interaktif: orbit, auto-rotate, dan reset kamera
- Swap base machine F1ZR / 125Z (GLB bila tersedia, fallback ke mesh prosedural)
- Enam kategori part: knalpot, velg, ban, karburator, magnet pengapian, dan mesin
- Livery dinamis: preset warna, RGB picker, finish gloss/matte/metal, upload tekstur PNG/JPG, serta template UV 2048×1024
- Total harga build terhitung otomatis
- Ekspor render PNG resolusi tinggi (±3200 px)

## Spesifikasi base machine

| Model | Mesin | Tenaga | Berat | Harga acuan |
| --- | --- | --- | --- | --- |
| Yamaha F1ZR | 110 cc 2-tak | 8.6 hp | 97 kg | Rp 12.500.000 |
| Yamaha 125Z | 125 cc 2-tak | 17.3 hp | 102 kg | Rp 30.000.000 |

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://127.0.0.1:5173`.

## Model GLB

Letakkan file di `public/models/`:

- `f1zr.glb` untuk Yamaha F1ZR
- `125z.glb` untuk Yamaha 125Z

Model dinormalisasi otomatis (panjang ±2,02 unit, roda menyentuh lantai). Tanpa file tersebut, aplikasi memakai mesh prosedural. Detail ada di [`public/models/README.md`](public/models/README.md).

## Build produksi

```bash
npm run build
npm run preview
```

Output ada di `dist/`. Untuk GitHub Pages, set `base: '/nama-repo/'` di `vite.config.js`; untuk Vercel/Netlify cukup build command `npm run build` dan output `dist`.

## Referensi

- [Kompas: Yamaha F1ZR, bebek 2-tak yang harganya paling anteng](https://otomotif.kompas.com/read/2022/10/16/090100215/yamaha-f1z-r-bebek-2-tak-yang-harganya-paling-anteng)
- [Tribunnews: Trik perawatan Yamaha 125Z](https://www.tribunnews.com/otomotif/2018/10/04/trik-biar-perawatan-motor-yamaha-125z-lebih-murah-tapi-tenaganya-nendang)
