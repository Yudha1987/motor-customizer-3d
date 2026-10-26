import { PART_GROUPS, formatDelta } from './ThreeModels'

function GroupIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-4 w-4',
    'aria-hidden': true,
  }

  if (name === 'exhaust') {
    return (
      <svg {...common}>
        <path d="M3 7h5c2.5 0 3.2 2.3 3.2 4.5V17" />
        <path d="M8 7v5.5c0 1.4 1 2.5 2.5 2.5H17" />
        <rect x="15.5" y="12" width="6" height="5.5" rx="2.6" />
        <path d="M21.5 14.8h.01" />
      </svg>
    )
  }

  if (name === 'wheels') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1" />
      </svg>
    )
  }

  if (name === 'tires') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.2" />
        <circle cx="12" cy="12" r="5.3" />
        <path d="M12 3.8v2.4M12 17.8v2.4M3.8 12h2.4M17.8 12h2.4" />
        <path d="M6.4 6.4l1.7 1.7M15.9 15.9l1.7 1.7M17.6 6.4l-1.7 1.7M8.1 15.9l-1.7 1.7" />
      </svg>
    )
  }

  if (name === 'carb') {
    return (
      <svg {...common}>
        <rect x="7" y="8" width="9" height="8" rx="2" />
        <path d="M16 10.5h2.2c.9 0 1.6.7 1.6 1.6v1.4" />
        <path d="M9 8V6.2M12 8V6M9 16v1.8M12 16v2" />
        <circle cx="11.5" cy="12" r="1.4" />
      </svg>
    )
  }

  if (name === 'magnet') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.6" />
        <circle cx="12" cy="6.4" r=".9" />
        <circle cx="16.9" cy="9.2" r=".9" />
        <circle cx="16.9" cy="14.8" r=".9" />
        <circle cx="12" cy="17.6" r=".9" />
        <circle cx="7.1" cy="14.8" r=".9" />
        <circle cx="7.1" cy="9.2" r=".9" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect x="3.5" y="8.5" width="10" height="8" rx="1.5" />
      <path d="M13.5 11h3.2M13.5 14h3.2M6 8.5V5.8M9.5 8.5V5.8M8 16.5v2.7M11.5 16.5v2.7" />
      <circle cx="19" cy="15" r="1.6" />
    </svg>
  )
}

export default function PartsPanel({ parts, onChange }) {
  return (
    <div className="space-y-5">
      {PART_GROUPS.map((group) => {
        const selected = parts[group.id]
        const selectedName =
          group.options.find((option) => option.id === selected)?.name ?? '—'

        return (
          <div key={group.id}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400">
                  <GroupIcon name={group.icon} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                  {group.label}
                </span>
              </div>
              <span className="truncate text-[10px] text-ember/90">{selectedName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={group.label}>
              {group.options.map((option) => {
                const active = option.id === selected
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange(group.id, option.id)}
                    className={`relative flex min-h-[78px] flex-col justify-between rounded-lg border px-2.5 py-2.5 text-left transition-all duration-150 ${
                      active
                        ? 'border-ember/60 bg-ember/[0.1]'
                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span
                      className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-colors ${
                        active ? 'bg-ember' : 'bg-white/10'
                      }`}
                    />
                    <span className="pr-2 text-[10px] font-semibold leading-snug text-zinc-200">
                      {option.name}
                    </span>
                    <span className="mt-1.5 block text-[9px] leading-snug text-zinc-500">
                      {option.note}
                    </span>
                    <span
                      className={`mt-1 block font-mono text-[8.5px] tracking-tight ${
                        active ? 'text-ember/90' : 'text-zinc-600'
                      }`}
                    >
                      {formatDelta(option.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
