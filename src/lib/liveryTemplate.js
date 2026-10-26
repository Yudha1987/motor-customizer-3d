function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function panel(ctx, { x, y, w, h, label, hint }) {
  ctx.save()
  roundRect(ctx, x, y, w, h, 18)
  ctx.fillStyle = 'rgba(255,255,255,0.035)'
  ctx.fill()
  ctx.setLineDash([10, 8])
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(225,91,52,0.65)'
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = 'rgba(225,91,52,0.9)'
  ctx.font = '600 22px "Segoe UI", Arial, sans-serif'
  ctx.fillText(label, x + 24, y + 40)

  ctx.fillStyle = 'rgba(161,169,181,0.75)'
  ctx.font = '400 16px "Segoe UI", Arial, sans-serif'
  ctx.fillText(hint, x + 24, y + 66)

  ctx.save()
  roundRect(ctx, x + 20, y + 84, w - 40, h - 108, 12)
  ctx.clip()
  ctx.strokeStyle = 'rgba(255,255,255,0.045)'
  ctx.lineWidth = 1
  for (let i = -h; i < w + h; i += 28) {
    ctx.beginPath()
    ctx.moveTo(x + i, y)
    ctx.lineTo(x + i + h, y + h)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = 'rgba(161,169,181,0.4)'
  ctx.font = '500 15px "Segoe UI", Arial, sans-serif'
  ctx.fillText('GAMBAR / TEMPEL LIVERY DI AREA INI', x + 30, y + h - 26)
  ctx.restore()
}

export function downloadLiveryTemplate(modelId, modelName) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const bg = ctx.createLinearGradient(0, 0, 2048, 1024)
  bg.addColorStop(0, '#0b0d11')
  bg.addColorStop(1, '#12151b')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 2048, 1024)

  ctx.strokeStyle = 'rgba(255,255,255,0.035)'
  ctx.lineWidth = 1
  for (let x = 0; x <= 2048; x += 64) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 1024)
    ctx.stroke()
  }
  for (let y = 0; y <= 1024; y += 64) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(2048, y)
    ctx.stroke()
  }

  ctx.fillStyle = '#e15b34'
  ctx.fillRect(80, 58, 8, 62)
  ctx.fillStyle = '#f4f4f5'
  ctx.font = '700 42px "Segoe UI", Arial, sans-serif'
  ctx.fillText('APEX/MOTO', 110, 98)
  ctx.fillStyle = 'rgba(161,169,181,0.75)'
  ctx.font = '500 15px "Segoe UI", Arial, sans-serif'
  ctx.fillText('CUSTOMIZER STUDIO', 112, 124)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#f4f4f5'
  ctx.font = '700 30px "Segoe UI", Arial, sans-serif'
  ctx.fillText(`${modelName} — UV LIVERY TEMPLATE`, 1968, 92)
  ctx.fillStyle = 'rgba(161,169,181,0.75)'
  ctx.font = '400 15px "Segoe UI", Arial, sans-serif'
  ctx.fillText('2048 × 1024 px · PNG / JPG · maks 4 MB', 1968, 120)
  ctx.textAlign = 'left'

  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.moveTo(80, 154)
  ctx.lineTo(1968, 154)
  ctx.stroke()

  panel(ctx, {
    x: 80,
    y: 204,
    w: 760,
    h: 560,
    label: 'TANK / BODY',
    hint: 'Area utama bodi, tangki, dan fairing samping.',
  })
  panel(ctx, {
    x: 880,
    y: 204,
    w: 1088,
    h: 268,
    label: 'FRONT COWL / FAIRING',
    hint: 'Cowl depan, area lampu, dan pipi fairing.',
  })
  panel(ctx, {
    x: 880,
    y: 504,
    w: 1088,
    h: 260,
    label: 'TAIL / SIDE PANEL',
    hint: 'Ekor, side panel, dan cover belakang.',
  })
  panel(ctx, {
    x: 80,
    y: 796,
    w: 760,
    h: 150,
    label: 'ACCENT / STRIPE',
    hint: 'Garis aksen, stripe, dan detail kecil.',
  })

  ctx.save()
  roundRect(ctx, 880, 796, 1088, 150, 18)
  ctx.fillStyle = 'rgba(225,91,52,0.06)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(225,91,52,0.28)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = 'rgba(225,91,52,0.9)'
  ctx.font = '600 18px "Segoe UI", Arial, sans-serif'
  ctx.fillText('CARA PAKAI', 906, 836)
  ctx.fillStyle = 'rgba(190,196,205,0.8)'
  ctx.font = '400 15px "Segoe UI", Arial, sans-serif'
  ctx.fillText('1. Gambar livery di atas area bertanda.', 906, 866)
  ctx.fillText('2. Simpan sebagai PNG/JPG maksimal 4 MB.', 906, 890)
  ctx.fillText('3. Upload lewat panel LIVERY → Upload tekstur.', 906, 914)
  ctx.restore()

  ctx.fillStyle = 'rgba(120,127,138,0.55)'
  ctx.font = '400 13px "Segoe UI", Arial, sans-serif'
  ctx.fillText(
    'Template ini adalah panduan zona livery. Tekstur dipetakan berulang pada bodi 3D; hindari teks kecil di area sambungan.',
    80,
    986,
  )

  const link = document.createElement('a')
  link.download = `apex-uv-${modelId}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
