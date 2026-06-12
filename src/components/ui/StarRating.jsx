import { Star } from 'lucide-react'

export function StarDisplay({ nota, size = 15 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(nota)
            ? 'text-brand-500 fill-brand-500'
            : 'text-ink-faint fill-ink-faint'}
        />
      ))}
    </div>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none touch-manipulation transition-transform active:scale-90"
        >
          <Star
            size={42}
            className={i <= value
              ? 'text-brand-500 fill-brand-500 drop-shadow-sm'
              : 'text-ink-faint fill-ink-faint'}
          />
        </button>
      ))}
    </div>
  )
}
