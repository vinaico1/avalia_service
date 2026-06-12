import { useState } from 'react'
import { MapPin, Phone, User, ArrowRight } from 'lucide-react'
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
    if (error) {
      setErro(error.message.includes('unique') || error.message.includes('duplicate')
        ? 'Esta Quadra + Lote já está cadastrada. Contate o administrador.'
        : error.message)
    }
  }

  return (
    <div className="min-h-screen bg-app flex flex-col relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col justify-end px-6 pb-10 pt-16 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-lime/10 border border-lime/20 rounded-2xl flex items-center justify-center mb-5">
            <MapPin size={24} className="text-lime" />
          </div>
          <h1 className="text-3xl font-extrabold text-ink leading-tight">
            Onde fica<br />
            <span className="text-lime">sua residência?</span>
          </h1>
          <p className="text-ink-muted text-sm mt-2 leading-relaxed">
            Esses dados identificam você no condomínio.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-card space-y-4">
          {erro && (
            <div className="p-3 bg-danger-dim border border-danger/20 rounded-xl text-danger text-sm">
              ⚠ {erro}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Nome completo</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-2xl text-sm focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/30 transition-colors"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Telefone</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(maskTel(e.target.value))}
                placeholder="(15) 99999-9999"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-2xl text-sm focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/30 transition-colors"
              />
            </div>
          </div>

          {/* Quadra + Lote */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Quadra</label>
              <input
                value={quadra}
                onChange={e => setQuadra(e.target.value)}
                placeholder="A"
                maxLength={5}
                className="w-full px-4 py-3.5 bg-raised border border-border rounded-2xl text-sm text-center font-bold uppercase focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Lote</label>
              <input
                value={lote}
                onChange={e => setLote(e.target.value)}
                placeholder="12"
                maxLength={6}
                className="w-full px-4 py-3.5 bg-raised border border-border rounded-2xl text-sm text-center font-bold uppercase focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/30 transition-colors"
              />
            </div>
          </div>

          <div className="px-1">
            <p className="text-ink-muted text-xs leading-relaxed">
              Cada residência só pode ter um cadastro. Moradores da mesma casa usam a mesma combinação.
            </p>
          </div>

          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="w-full bg-lime hover:bg-lime-dark text-app font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lime mt-2"
          >
            {salvando ? (
              <span className="w-5 h-5 border-2 border-app/30 border-t-app rounded-full animate-spin" />
            ) : (
              <> Concluir Cadastro <ArrowRight size={18} /> </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
