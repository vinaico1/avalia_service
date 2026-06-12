import { Star } from 'lucide-react'

export function StarDisplay({ nota, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(nota) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none touch-manipulation"
        >
          <Star
            size={36}
            className={
              i <= value
                ? 'text-yellow-400 fill-yellow-400 drop-shadow'
                : 'text-gray-300 fill-gray-100'
            }
          />
        </button>
      ))}
    </div>
  )
}
