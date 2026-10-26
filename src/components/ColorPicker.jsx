import { useRef, useState } from 'react'
import { LIVERY_PRESETS } from './ThreeModels'
import { downloadLiveryTemplate } from '../lib/liveryTemplate'

const FINISHES = [
  { id: 'gloss', label: 'Gloss', hint: 'Clearcoat' },
  { id: 'matte', label: 'Matte', hint: 'Flat' },
  { id: 'metal', label: 'Metal', hint: 'Flake' },
]

function ColorField({ label, hint, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
      <div>
        <div className="text-[11px] font-medium text-zinc-300">{label}</div>
        <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-tight text-zinc-500">{value}</span>
        <label
          className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-md border border-white/25 shadow-inner"
          style={{ backgroundColor: value }}
          title={`Pilih ${label}`}
        >
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={`Pilih warna ${label}`}
          />
        </label>
      </div>
    </div>
  )
}

export default function ColorPicker({ livery, onChange, model }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar PNG, JPG, atau WEBP.')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Ukuran maksimal 4 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onChange({ texture: reader.result, textureName: file.name })
      setError('')
    }
    reader.onerror = () => setError('Gagal membaca file.')
    reader.readAsDataURL(file)
  }

  const onDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  return (
    <div className="space-y-3">
      {/* Finish */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Finish</span>
          <span className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
            {FINISHES.find((finish) => finish.id === livery.finish)?.hint}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-1">
          {FINISHES.map((finish) => {
            const active = finish.id === livery.finish
            return (
              <button
                key={finish.id}
                type="button"
                onClick={() => onChange({ finish: finish.id })}
                aria-pressed={active}
                className={`rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active ? 'bg-ember text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                {finish.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Colours */}
      <ColorField
        label="Primary"
        hint="Bodywork"
        value={livery.primary}
        onChange={(value) => onChange({ primary: value })}
      />
      <ColorField
        label="Secondary"
        hint="Frame"
        value={livery.secondary}
        onChange={(value) => onChange({ secondary: value })}
      />
      <ColorField
        label="Accent"
        hint="Details"
        value={livery.accent}
        onChange={(value) => onChange({ accent: value })}
      />

      {/* Presets */}
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Preset livery</div>
        <div className="flex items-center gap-2">
          {LIVERY_PRESETS.map((preset) => {
            const active =
              livery.primary.toLowerCase() === preset.primary.toLowerCase() &&
              livery.secondary.toLowerCase() === preset.secondary.toLowerCase() &&
              livery.accent.toLowerCase() === preset.accent.toLowerCase()
            return (
              <button
                key={preset.name}
                type="button"
                title={preset.name}
                aria-label={`Preset ${preset.name}`}
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    primary: preset.primary,
                    secondary: preset.secondary,
                    accent: preset.accent,
                  })
                }
                className={`relative h-8 w-8 overflow-hidden rounded-full border transition-all ${
                  active
                    ? 'scale-110 border-white/70 ring-2 ring-ember/40'
                    : 'border-white/15 hover:scale-105 hover:border-white/40'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.primary} 0 48%, ${preset.accent} 48% 72%, ${preset.secondary} 72% 100%)`,
                }}
              >
                <span className="sr-only">{preset.name}</span>
              </button>
            )
          })}
          <span className="ml-1 text-[9px] uppercase tracking-[0.14em] text-zinc-600">Pilih mood</span>
        </div>
      </div>

      {/* Texture upload */}
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-lg border border-dashed p-3 transition-colors ${
          dragOver ? 'border-ember/70 bg-ember/[0.06]' : 'border-white/[0.12] bg-white/[0.02]'
        }`}
      >
        {livery.texture ? (
          <div className="flex items-center gap-2.5">
            <img
              src={livery.texture}
              alt="Preview tekstur livery"
              className="h-11 w-11 shrink-0 rounded-md border border-white/10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10px] font-medium text-zinc-300">
                {livery.textureName || 'livery.png'}
              </div>
              <div className="text-[9px] text-emerald-400/80">Tekstur aktif di bodywork</div>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange({ texture: null, textureName: '' })}
              aria-label="Hapus tekstur"
              className="grid h-6 w-6 place-items-center rounded-md border border-white/10 text-zinc-500 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 16V4M7.5 8.5L12 4l4.5 4.5" />
                <path d="M4 15v3.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V15" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-medium text-zinc-300">
                Upload tekstur livery
              </span>
              <span className="block text-[9px] text-zinc-600">PNG / JPG · drag &amp; drop · maks 4 MB</span>
            </span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => downloadLiveryTemplate(model.id, model.name)}
        className="group flex w-full items-center gap-2.5 rounded-lg border border-white/[0.09] bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:border-ember/40 hover:bg-ember/[0.05]"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-ember/25 bg-ember/10 text-ember">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3v11M7.5 9.5L12 14l4.5-4.5" />
            <path d="M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold text-zinc-200">
            Download Template UV Livery
          </span>
          <span className="block text-[9px] text-zinc-600">
            Panduan gambar livery {model.name} · PNG 2048×1024
          </span>
        </span>
      </button>

      {error && (
        <p role="alert" className="text-[10px] text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
