import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import Scene from './components/Scene'
import {
  DEFAULT_LIVERY,
  DEFAULT_PARTS,
  MODELS,
  PART_GROUPS,
  buildTotal,
  formatIDR,
  optionName,
} from './components/ThreeModels'

function SpecChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 backdrop-blur-md">
      <span className="text-[8px] uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <span className="text-[10px] font-medium text-zinc-200">{value}</span>
    </span>
  )
}

function ToolButton({ children, label, onClick, active = false, accent = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-10 w-10 place-items-center rounded-lg border backdrop-blur-md transition-all active:scale-95 ${
        active
          ? 'border-ember/60 bg-ember/20 text-ember'
          : accent
            ? 'border-ember/50 bg-ember text-white hover:bg-ember-soft'
            : 'border-white/10 bg-black/35 text-zinc-400 hover:border-white/25 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [modelId, setModelId] = useState('f1zr')
  const [parts, setParts] = useState({ ...DEFAULT_PARTS })
  const [livery, setLivery] = useState({ ...DEFAULT_LIVERY })
  const [autoRotate, setAutoRotate] = useState(true)
  const [resetSignal, setResetSignal] = useState(0)
  const [toast, setToast] = useState(false)

  const sceneApi = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const model = MODELS.find((item) => item.id === modelId) ?? MODELS[0]
  const modelIndex = MODELS.findIndex((item) => item.id === modelId)
  const total = buildTotal(modelId, parts)

  const handlePartChange = (groupId, optionId) => {
    setParts((previous) => ({ ...previous, [groupId]: optionId }))
  }

  const handleLiveryChange = (patch) => {
    setLivery((previous) => ({ ...previous, ...patch }))
  }

  const handleDownload = () => {
    const filename = `apex-${modelId}-${new Date().toISOString().slice(0, 10)}.png`
    sceneApi.current?.snapshot(filename)
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 2400)
  }

  const handleReset = () => {
    setModelId('f1zr')
    setParts({ ...DEFAULT_PARTS })
    setLivery({ ...DEFAULT_LIVERY })
    setAutoRotate(true)
    setResetSignal((value) => value + 1)
  }

  const handleResetView = () => setResetSignal((value) => value + 1)

  return (
    <div className="min-h-screen bg-ink text-zinc-100 lg:grid lg:h-screen lg:grid-cols-[404px_minmax(0,1fr)] lg:overflow-hidden">
      {/* Viewport */}
      <main className="showroom-bg relative order-1 h-[68vh] min-h-[470px] overflow-hidden lg:order-2 lg:h-screen lg:min-h-0">
        <div className="showroom-grid pointer-events-none absolute inset-0" />
        <div className="absolute inset-0">
          <Scene
            modelId={modelId}
            parts={parts}
            livery={livery}
            autoRotate={autoRotate}
            resetSignal={resetSignal}
            apiRef={sceneApi}
          />
        </div>
        <div className="vignette pointer-events-none absolute inset-0" />

        {/* Header overlay */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-5 sm:p-7 lg:p-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_rgba(225,91,52,.9)]" />
              {model.series} / Build 0{modelIndex + 1}
            </div>
            <h1 className="mt-2 font-display text-[40px] leading-[0.9] tracking-wide text-zinc-50 sm:text-6xl">
              {model.name}
            </h1>
            <p className="mt-2 hidden max-w-sm text-xs leading-relaxed text-zinc-400 sm:block">
              {model.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              <SpecChip label="Engine" value={model.engine} />
              <SpecChip label="Power" value={model.power} />
              <SpecChip label="Weight" value={model.weight} />
              <span className="hidden sm:inline-flex">
                <SpecChip label="Build" value={formatIDR(total)} />
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ToolButton
              label={autoRotate ? 'Hentikan rotasi' : 'Putar otomatis'}
              active={autoRotate}
              onClick={() => setAutoRotate((value) => !value)}
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
                <path d="M20 11a8 8 0 10-2.3 6.2" />
                <path d="M20 4v7h-7" />
              </svg>
            </ToolButton>

            <ToolButton label="Reset kamera" onClick={handleResetView}>
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
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                <circle cx="12" cy="12" r="2.4" />
              </svg>
            </ToolButton>

            <ToolButton label="Unduh render PNG" onClick={handleDownload} accent>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 8.5A2.5 2.5 0 016.5 6h1L9 4h6l1.5 2h1A2.5 2.5 0 0120 8.5v8A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-8z" />
                <circle cx="12" cy="12.5" r="3.2" />
              </svg>
            </ToolButton>
          </div>
        </header>

        {/* Footer overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7 lg:p-8">
          <div className="flex flex-wrap gap-1.5">
            {PART_GROUPS.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-black/30 px-2.5 py-1.5 backdrop-blur-md"
              >
                <span className="text-[8px] uppercase tracking-[0.16em] text-zinc-600">{group.label}</span>
                <span className="text-[10px] font-medium text-zinc-300">
                  {optionName(group.id, parts[group.id])}
                </span>
              </span>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-zinc-500 sm:flex">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <rect x="7" y="3" width="10" height="18" rx="5" />
              <path d="M12 7v4" strokeLinecap="round" />
            </svg>
            Drag · Scroll
          </div>
        </div>

        {/* Download toast */}
        {toast && (
          <div
            role="status"
            className="pointer-events-none absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-emerald-200 backdrop-blur-md"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            Render disimpan
          </div>
        )}
      </main>

      <Sidebar
        modelId={modelId}
        onModelChange={setModelId}
        parts={parts}
        onPartChange={handlePartChange}
        livery={livery}
        onLiveryChange={handleLiveryChange}
        total={total}
        onReset={handleReset}
        onDownload={handleDownload}
      />
    </div>
  )
}
