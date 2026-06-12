import { useState } from 'react'
import { MessageCircle, Phone, Star, Users } from 'lucide-react'
import { StarDisplay } from '../ui/StarRating'
import { AlertBadge, getAlertConfig } from '../ui/AlertBadge'

function whatsappUrl(tel) {
  const d = String(tel).replace(/\D/g, '')
  return `https://wa.me/${d.startsWith('55') ? d : '55' + d}`
}

export function PrestadorCard({ prestador, onAvaliar }) {
  const [mostrarTel, setMostrarTel] = useState(false)
  const cfg = getAlertConfig(prestador.nota_media)
  const temNota = prestador.total_avaliacoes > 0
  const nota = temNota ? Number(prestador.nota_media) : null

  return (
    <article className={`bg-card rounded-2xl shadow-card border overflow-hidden ${cfg?.cardBorder ?? 'border-border'}`}>

      {/* Barra de topo colorida por nota */}
      {cfg && <div className={`h-1 w-full ${cfg.topBar}`} />}

      <div className="p-4">
        {/* Nome + área + badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink text-[15px] leading-tight truncate">{prestador.nome}</h3>
            <p className="text-xs text-ink-muted mt-0.5">{prestador.area_atuacao}</p>
          </div>
          {temNota && <AlertBadge nota={nota} />}
        </div>

        {/* Nota média */}
        <div className="flex items-center gap-2.5 mb-3">
          {temNota ? (
            <>
              <StarDisplay nota={nota} size={15} />
              <span className="font-extrabold text-ink text-base leading-none">{nota.toFixed(1)}</span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Users size={11} />
                {prestador.total_avaliacoes} {prestador.total_avaliacoes === 1 ? 'opinião' : 'opiniões'}
              </span>
            </>
          ) : (
            <span className="text-xs text-ink-muted italic">Sem avaliações — seja o primeiro!</span>
          )}
        </div>

        {/* Observações */}
        {(prestador.obs_positiva || prestador.obs_negativa) && (
          <div className="space-y-1.5 mb-3">
            {prestador.obs_positiva && (
              <div className="flex gap-2 px-3 py-2 bg-ok-dim rounded-xl">
                <span className="text-ok text-xs font-bold shrink-0 mt-0.5">↑</span>
                <p className="text-xs text-ok-text leading-snug line-clamp-2">{prestador.obs_positiva}</p>
              </div>
            )}
            {prestador.obs_negativa && (
              <div className="flex gap-2 px-3 py-2 bg-danger-dim rounded-xl">
                <span className="text-danger text-xs font-bold shrink-0 mt-0.5">↓</span>
                <p className="text-xs text-danger-text leading-snug line-clamp-2">{prestador.obs_negativa}</p>
              </div>
            )}
          </div>
        )}

        {/* Aviso de atenção */}
        {cfg?.tip && (
          <div className="flex items-start gap-2 px-3 py-2 bg-warn-dim rounded-xl mb-3">
            <span className="text-warn text-xs font-bold shrink-0 mt-0.5">⚠</span>
            <p className="text-xs text-warn-text font-medium leading-snug">{cfg.tip}</p>
          </div>
        )}

        {/* Divisor */}
        <div className="border-t border-border my-3" />

        {/* Ações */}
        <div className="flex gap-2">
          <a
            href={whatsappUrl(prestador.telefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1fbb59] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors touch-manipulation shadow-sm"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          {mostrarTel ? (
            <a
              href={`tel:${prestador.telefone}`}
              className="flex items-center gap-1.5 bg-raised border border-border rounded-xl px-3 py-2.5 text-ink text-xs font-semibold hover:bg-border transition-colors touch-manipulation"
            >
              <Phone size={13} className="text-ink-muted shrink-0" />
              {prestador.telefone}
            </a>
          ) : (
            <button
              onClick={() => setMostrarTel(true)}
              className="w-10 flex items-center justify-center bg-raised hover:bg-border border border-border rounded-xl text-ink-muted hover:text-ink transition-colors touch-manipulation"
            >
              <Phone size={15} />
            </button>
          )}
          <button
            onClick={() => onAvaliar(prestador)}
            className="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors touch-manipulation shadow-btn"
          >
            <Star size={14} className="fill-white" />
            Avaliar
          </button>
        </div>
      </div>
    </article>
  )
}
