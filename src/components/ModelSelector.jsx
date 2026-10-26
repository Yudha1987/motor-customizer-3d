import { MODELS, formatIDR } from './ThreeModels'

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="grid gap-2.5" role="radiogroup" aria-label="Pilih kendaraan dasar">
      {MODELS.map((model, index) => {
        const active = model.id === value
        return (
          <button
            key={model.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(model.id)}
            className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
              active
                ? 'border-ember/60 bg-gradient-to-br from-ember/[0.13] via-white/[0.03] to-transparent shadow-glow'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <span
              className={`pointer-events-none absolute -right-1 -top-4 font-display text-[64px] leading-none ${
                active ? 'text-ember/15' : 'text-white/[0.04]'
              }`}
            >
              0{index + 1}
            </span>

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.24em]">
                  <span className={active ? 'text-ember' : 'text-zinc-600'}>0{index + 1}</span>
                  <span className="text-zinc-500">{model.series}</span>
                  {model.engine && (
                    <span className="font-mono text-[8px] font-normal tracking-[0.12em] text-zinc-600">
                      {model.engine}
                    </span>
                  )}
                  {model.years && (
                    <span className="font-mono text-[8px] font-normal tracking-[0.12em] text-zinc-600">
                      {model.years}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-display text-[22px] leading-none tracking-wide text-zinc-50">
                  {model.name}
                </h3>
              </div>

              <div className="shrink-0 text-right">
                <div className="font-mono text-[10px] text-zinc-400">{formatIDR(model.basePrice)}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                  {model.power} · {model.weight}
                </div>
              </div>
            </div>

            <p className="relative mt-2.5 max-w-[85%] text-[11px] leading-relaxed text-zinc-500">
              {model.blurb}
            </p>

            <span
              className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                active ? 'w-full bg-gradient-to-r from-ember to-transparent' : 'w-0 bg-white/20'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
