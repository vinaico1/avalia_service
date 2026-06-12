import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export function getAlertConfig(nota) {
  if (nota === null || nota === undefined) return null
  const n = parseFloat(nota)
  if (n === 0) return {
    label: 'Não Recomendado',
    icon: XCircle,
    cardBorder: 'border-danger/30',
    cardGlow:   'shadow-[0_0_0_1px_rgba(255,68,85,0.2)]',
    badge:      'bg-danger/15 text-danger border border-danger/20',
    dot:        'bg-danger',
  }
  if (n <= 3) return {
    label: 'Atenção ao Contratar',
    icon: AlertTriangle,
    cardBorder: 'border-warn/30',
    cardGlow:   'shadow-[0_0_0_1px_rgba(255,176,32,0.15)]',
    badge:      'bg-warn/15 text-warn border border-warn/20',
    dot:        'bg-warn',
    tip: 'Exija contrato com cláusula de multa',
  }
  return {
    label: 'Bem Recomendado',
    icon: CheckCircle2,
    cardBorder: 'border-ok/20',
    cardGlow:   '',
    badge:      'bg-ok/15 text-ok border border-ok/20',
    dot:        'bg-ok',
  }
}

export function AlertBadge({ nota }) {
  const cfg = getAlertConfig(nota)
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}
