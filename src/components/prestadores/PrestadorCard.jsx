import { Phone, MessageCircle, Star, Users, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
import { StarDisplay } from '../ui/StarRating'
import { AlertBadge, getAlertConfig } from '../ui/AlertBadge'

function formatTelefone(tel) {
  const d = String(tel).replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return tel
}

function whatsappUrl(tel) {
  const d = String(tel).replace(/\D/g, '')
  const num = d.startsWith('55') ? d : `55${d}`
  return `https://wa.me/${num}`
}

export function PrestadorCard({ prestador, onAvaliar }) {
  const cfg = getAlertConfig(prestador.nota_media)
  const temNota = prestador.total_avaliacoes > 0

  return (
    <article
      className={`rounded-2xl border ${cfg?.border ?? 'border-gray-100'} ${cfg?.bg ?? 'bg-white'} shadow-sm overflow-hidden`}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {prestador.nome}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              {prestador.area_atuacao}
            </p>
          </div>
          <AlertBadge nota={prestador.nota_media} totalOpinioes={prestador.total_avaliacoes} />
        </div>

        {/* Nota e opiniões */}
        <div className="flex items-center gap-3 mt-3">
          {temNota ? (
            <>
              <StarDisplay nota={prestador.nota_media} size={15} />
              <span className={`text-sm font-bold ${cfg?.text ?? 'text-gray-700'}`}>
                {Number(prestador.nota_media).toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={12} />
                {prestador.total_avaliacoes} {prestador.total_avaliacoes === 1 ? 'opinião' : 'opiniões'}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Sem avaliações ainda</span>
          )}
        </div>
      </div>

      {/* Observações */}
      {(prestador.obs_positiva || prestador.obs_negativa) && (
        <div className="px-4 pb-3 space-y-1.5">
          {prestador.obs_positiva && (
            <div className="flex gap-2 items-start">
              <ThumbsUp size={13} className="text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">{prestador.obs_positiva}</p>
            </div>
          )}
          {prestador.obs_negativa && (
            <div className="flex gap-2 items-start">
              <ThumbsDown size={13} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">{prestador.obs_negativa}</p>
            </div>
          )}
        </div>
      )}

      {/* Alerta tip */}
      {cfg?.tip && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-amber-100 border border-amber-200">
          <p className="text-xs text-amber-800 font-medium">⚠️ {cfg.tip}</p>
        </div>
      )}

      {/* Footer ações */}
      <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
        <a
          href={whatsappUrl(prestador.telefone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors touch-manipulation"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href={`tel:${prestador.telefone}`}
          className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors touch-manipulation"
        >
          <Phone size={16} />
        </a>
        <button
          onClick={() => onAvaliar(prestador)}
          className="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors touch-manipulation"
        >
          <Star size={15} />
          Avaliar
          <ChevronRight size={13} />
        </button>
      </div>
    </article>
  )
}
