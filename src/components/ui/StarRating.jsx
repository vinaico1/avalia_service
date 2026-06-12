import { Star } from 'lucide-react'

export function StarDisplay({ nota, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(nota)
            ? 'text-lime fill-lime'
            : 'text-ink-faint fill-ink-faint'}
        />
      ))}
    </div>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none touch-manipulation transition-transform active:scale-90"
        >
          <Star
            size={38}
            className={i <= value
              ? 'text-lime fill-lime drop-shadow-[0_0_8px_rgba(170,255,0,0.5)]'
              : 'text-ink-faint fill-ink-faint'}
          />
        </button>
      ))}
    </div>
  )
}
