import { useState } from 'react'
import { Phone, User, ArrowRight, Home, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function CompleteProfile() {
  const { session, completarPerfil } = useAuth()
  const [nome, setNome] = useState(session?.user?.user_metadata?.full_name || '')
  const [telefone, setTelefone] = useState('')
  const [quadra, setQuadra] = useState('')
  const [lote, setLote] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const maskTel = (v) => {
    let d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    if (d.length > 6)  return d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
    if (d.length > 2)  return d.replace(/(\d{2})(\d+)/, '($1) $2')
    return d
  }

  async function handleSalvar() {
    if (!nome.trim() || !telefone.trim() || !quadra.trim() || !lote.trim()) {
      setErro('Todos os campos são obrigatórios'); return
    }
    setSalvando(true); setErro('')
    const { error } = await completarPerfil({
      nome: nome.trim(), telefone,
      quadra: quadra.toUpperCase().trim(),
      lote: lote.toUpperCase().trim(),
    })
    setSalvando(false)
    if (error) setErro(
      error.message.includes('unique') || error.message.includes('duplicate')
        ? 'Esta Quadra + Lote já está cadastrada.'
        : error.message
    )
  }

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Header */}
      <div className="bg-brand-600 px-6 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-700 rounded-full opacity-40" />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4">
            <Home size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Quase lá!</h1>
          <p className="text-brand-100 text-sm mt-1">Informe os dados da sua residência.</p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-sheet p-6 space-y-4">
          {erro && (
            <div className="p-3 bg-danger-dim rounded-xl text-danger-text text-sm">⚠ {erro}</div>
          )}

          {/* E-mail de recuperação — somente leitura */}
          <div className="flex items-center gap-3 px-3 py-3 bg-raised border border-border rounded-xl">
            <Mail size={15} className="text-ink-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider leading-none mb-0.5">E-mail de recuperação</p>
              <p className="text-sm text-ink truncate">{session?.user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Nome completo</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Telefone</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type="tel" value={telefone} onChange={e => setTelefone(maskTel(e.target.value))} placeholder="(15) 99999-9999"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Quadra</label>
              <input
                value={quadra}
                onChange={e => setQuadra(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                placeholder="AA"
                maxLength={2}
                className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm text-center font-bold uppercase focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Lote</label>
              <input value={lote} onChange={e => setLote(e.target.value)} placeholder="12" maxLength={6}
                className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm text-center font-bold uppercase focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed px-1">
            Cada residência tem uma combinação única de Quadra + Lote no condomínio.
          </p>

          <button onClick={handleSalvar} disabled={salvando}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-btn">
            {salvando
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Concluir Cadastro <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
      <div className="h-8" />
    </div>
  )
}
