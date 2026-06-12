import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export function getAlertConfig(nota, totalOpinioes = 0) {
  if (nota === null || nota === undefined) return null
  const n = parseFloat(nota)

  if (n === 0) return {
    label: 'Não Recomendado',
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-800',
    iconColor: 'text-red-500',
  }

  if (n >= 1 && n <= 3) return {
    label: 'Atenção ao Contratar',
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-500',
    tip: 'Exija contrato com cláusula de multa',
  }

  if (n >= 4) return {
    label: 'Bem Recomendado',
    icon: CheckCircle2,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
    iconColor: 'text-green-500',
  }

  return null
}

export function AlertBadge({ nota, totalOpinioes }) {
  const cfg = getAlertConfig(nota, totalOpinioes)
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}
