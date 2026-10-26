import { MODELS, formatIDR } from './ThreeModels'
import ModelSelector from './ModelSelector'
import PartsPanel from './PartsPanel'
import ColorPicker from './ColorPicker'

function Section({ index, title, meta, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="font-mono text-[9px] font-semibold text-ember">{index}</span>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-300">{title}</h2>
        <span className="section-rule h-px flex-1" />
        {meta && (
          <span className="max-w-[42%] truncate text-[9px] uppercase tracking-[0.12em] text-zinc-600">
            {meta}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

export default function Sidebar({
  modelId,
  onModelChange,
  parts,
  onPartChange,
  livery,
  onLiveryChange,
  total,
  onReset,
  onDownload,
}) {
  const model = MODELS.find((item) => item.id === modelId) ?? MODELS[0]

  return (
    <aside className="order-2 flex min-w-0 flex-col border-t border-white/[0.07] bg-panel lg:order-1 lg:h-screen lg:border-r lg:border-t-0">
      {/* Brand */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <div className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-ember to-ember-deep shadow-[0_8px_24px_-8px_rgba(225,91,52,.8)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
            <path d="M4 19L12 4l8 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 14.5h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="font-display text-[17px] leading-none tracking-[0.18em] text-zinc-50">
            APEX<span className="text-ember">/</span>MOTO
          </div>
          <div className="mt-1 text-[8px] uppercase tracking-[0.32em] text-zinc-600">
            Customizer Studio
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-500">Live 3D</span>
        </div>
      </div>

      {/* Controls */}
      <div className="nice-scroll flex-1 space-y-7 overflow-y-auto px-5 py-6">
        <Section index="01" title="Base Machine" meta={model.name}>
          <ModelSelector value={modelId} onChange={onModelChange} />
        </Section>

        {model.tip && (
          <div className="rounded-lg border border-ember/20 bg-ember/[0.06] px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-ember/90">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M9 18h6M10 21h4" />
                <path d="M12 3a6 6 0 00-3.5 10.9c.4.3.5.7.5 1.1V16h6v-1c0-.4.1-.8.5-1.1A6 6 0 0012 3z" />
              </svg>
              Catatan {model.name}
            </div>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-zinc-400">{model.tip}</p>
          </div>
        )}

        <Section index="02" title="Components" meta={`${Object.keys(parts).length} kategori`}>
          <PartsPanel parts={parts} onChange={onPartChange} />
        </Section>

        <Section index="03" title="Livery" meta="Warna & tekstur">
          <ColorPicker livery={livery} onChange={onLiveryChange} model={model} />
        </Section>

        <div className="flex gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6M12 7.5v.01" />
          </svg>
          <p className="text-[9.5px] leading-relaxed text-zinc-600">
            Drag untuk memutar, scroll untuk zoom. Semua perubahan tampil real-time di viewport 3D.
          </p>
        </div>

        <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
          <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">Referensi</div>
          <a
            href="https://otomotif.kompas.com/read/2022/10/16/090100215/yamaha-f1z-r-bebek-2-tak-yang-harganya-paling-anteng"
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-1.5 text-[9px] leading-relaxed text-zinc-500 transition-colors hover:text-ember"
          >
            <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-ember/60" />
            Kompas.com — sejarah &amp; harga F1ZR
          </a>
          <a
            href="https://www.tribunnews.com/otomotif/2018/10/04/trik-biar-perawatan-motor-yamaha-125z-lebih-murah-tapi-tenaganya-nendang"
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-1.5 text-[9px] leading-relaxed text-zinc-500 transition-colors hover:text-ember"
          >
            <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-ember/60" />
            Tribunnews — perawatan &amp; tenaga 125Z
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="shrink-0 border-t border-white/[0.07] bg-[#0a0c0f]/95 px-5 py-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Estimasi build</div>
            <div className="mt-1 font-mono text-[19px] font-semibold tracking-tight text-zinc-50">
              {formatIDR(total)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">{model.series}</div>
            <div className="text-[10px] font-medium text-zinc-400">{model.name}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="group flex items-center justify-center gap-2 rounded-lg bg-ember px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-ember-soft active:scale-[0.99]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 15v3.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V15" />
              <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
            </svg>
            Unduh Render
          </button>
          <button
            type="button"
            onClick={onReset}
            title="Reset build"
            aria-label="Reset build ke pengaturan awal"
            className="grid h-[42px] w-[42px] place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-zinc-100"
          >
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
              <path d="M3.5 12a8.5 8.5 0 101.9-5.3" />
              <path d="M3.5 4.5V9H8" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-[8.5px] leading-relaxed text-zinc-600">
          Harga indikatif termasuk part pilihan. Render PNG resolusi tinggi setiap build.
        </p>
      </div>
    </aside>
  )
}
