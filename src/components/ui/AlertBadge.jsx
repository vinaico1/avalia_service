import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export function getAlertConfig(nota) {
  if (nota === null || nota === undefined) return null
  const n = parseFloat(nota)
  if (n === 0) return {
    label: 'Não Recomendado',
    icon: XCircle,
    cardBorder: 'border-danger/40',
    cardBg: '',
    badge: 'bg-danger-dim text-danger-text',
    tip: null,
    topBar: 'bg-danger',
  }
  if (n <= 3) return {
    label: 'Atenção ao Contratar',
    icon: AlertTriangle,
    cardBorder: 'border-warn/40',
    cardBg: '',
    badge: 'bg-warn-dim text-warn-text',
    tip: 'Exija contrato com cláusula de multa',
    topBar: 'bg-warn',
  }
  return {
    label: 'Bem Recomendado',
    icon: CheckCircle2,
    cardBorder: 'border-ok/30',
    cardBg: '',
    badge: 'bg-ok-dim text-ok-text',
    tip: null,
    topBar: 'bg-ok',
  }
}

export function AlertBadge({ nota }) {
  const cfg = getAlertConfig(nota)
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}
