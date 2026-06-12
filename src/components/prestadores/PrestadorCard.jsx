import { MessageCircle, Phone, Star, Users } from 'lucide-react'
import { StarDisplay } from '../ui/StarRating'
import { AlertBadge, getAlertConfig } from '../ui/AlertBadge'

function whatsappUrl(tel) {
  const d = String(tel).replace(/\D/g, '')
  return `https://wa.me/${d.startsWith('55') ? d : '55' + d}`
}

export function PrestadorCard({ prestador, onAvaliar }) {
  const cfg = getAlertConfig(prestador.nota_media)
  const temNota = prestador.total_avaliacoes > 0
  const nota = temNota ? Number(prestador.nota_media) : null

  return (
    <article className={`bg-card border rounded-3xl overflow-hidden shadow-card transition-all ${cfg?.cardBorder ?? 'border-border'} ${cfg?.cardGlow ?? ''}`}>

      {/* Topo colorido se nota crítica */}
      {cfg && nota !== null && nota <= 3 && (
        <div className={`h-0.5 w-full ${nota === 0 ? 'bg-danger' : 'bg-warn'}`} />
      )}
      {cfg && nota !== null && nota > 3 && (
        <div className="h-0.5 w-full bg-gradient-to-r from-lime/60 to-ok/40" />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink text-base leading-tight truncate">{prestador.nome}</h3>
            <span className="inline-block mt-1 text-xs text-ink-muted bg-raised border border-border px-2 py-0.5 rounded-full">
              {prestador.area_atuacao}
            </span>
          </div>
          {temNota && <AlertBadge nota={nota} />}
        </div>

        {/* Nota */}
        <div className="flex items-center gap-3 mb-3">
          {temNota ? (
            <>
              <StarDisplay nota={nota} size={14} />
              <span className="text-lime font-extrabold text-lg leading-none">{nota.toFixed(1)}</span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Users size={11} />
                {prestador.total_avaliacoes} {prestador.total_avaliacoes === 1 ? 'opinião' : 'opiniões'}
              </span>
            </>
          ) : (
            <span className="text-xs text-ink-muted italic">Sem avaliações ainda — seja o primeiro!</span>
          )}
        </div>

        {/* Observações */}
        {(prestador.obs_positiva || prestador.obs_negativa) && (
          <div className="space-y-1.5 mb-3">
            {prestador.obs_positiva && (
              <div className="flex gap-2 p-2.5 bg-ok/5 border border-ok/10 rounded-2xl">
                <span className="text-ok text-xs mt-0.5 shrink-0">↑</span>
                <p className="text-xs text-ink-muted leading-snug line-clamp-2">{prestador.obs_positiva}</p>
              </div>
            )}
            {prestador.obs_negativa && (
              <div className="flex gap-2 p-2.5 bg-danger/5 border border-danger/10 rounded-2xl">
                <span className="text-danger text-xs mt-0.5 shrink-0">↓</span>
                <p className="text-xs text-ink-muted leading-snug line-clamp-2">{prestador.obs_negativa}</p>
              </div>
            )}
          </div>
        )}

        {/* Alerta tip */}
        {cfg?.tip && (
          <div className="mb-3 px-3 py-2 bg-warn/10 border border-warn/20 rounded-2xl">
            <p className="text-xs text-warn font-medium">⚠ {cfg.tip}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-1">
          <a
            href={whatsappUrl(prestador.telefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/20 text-[#25D366] text-sm font-semibold py-2.5 rounded-2xl transition-colors touch-manipulation"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          <a
            href={`tel:${prestador.telefone}`}
            className="flex items-center justify-center w-11 border border-border hover:border-lime/30 bg-raised text-ink-muted hover:text-lime rounded-2xl transition-colors touch-manipulation"
          >
            <Phone size={15} />
          </a>
          <button
            onClick={() => onAvaliar(prestador)}
            className="flex items-center justify-center gap-1.5 bg-lime/10 hover:bg-lime/20 border border-lime/20 text-lime text-sm font-semibold py-2.5 px-4 rounded-2xl transition-colors touch-manipulation"
          >
            <Star size={14} />
            Avaliar
          </button>
        </div>
      </div>
    </article>
  )
}
