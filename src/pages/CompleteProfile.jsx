import { useState } from 'react'
import { Phone, User, ArrowRight, Home, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const TERMOS = [
  'As avaliações, comentários e notas publicadas são de inteira responsabilidade de seus autores.',
  'O usuário compromete-se a publicar apenas informações verdadeiras, baseadas em experiências reais de contratação, abstendo-se de realizar acusações, ofensas, calúnias, difamações ou qualquer conteúdo que possa violar direitos de terceiros.',
  'É proibida a publicação de conteúdo discriminatório, ofensivo, ilegal ou que contenha informações falsas.',
  'O administrador da plataforma não realiza verificação prévia das avaliações e não se responsabiliza pelas opiniões emitidas pelos usuários.',
  'A plataforma atua exclusivamente como um ambiente colaborativo para compartilhamento de experiências entre moradores, não realizando indicação, recomendação, certificação ou garantia da qualidade dos serviços prestados.',
  'O usuário concorda que avaliações consideradas ofensivas, ilegais ou que violem este termo poderão ser removidas sem aviso prévio.',
  'Os prestadores de serviço cadastrados poderão solicitar atualização, correção ou remoção de seus dados mediante contato com o administrador da plataforma.',
  'Os dados pessoais coletados serão utilizados exclusivamente para identificação dos usuários e funcionamento da plataforma, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).',
  'Ao concluir o cadastro, o usuário declara ter lido, compreendido e aceitado integralmente este Termo de Uso e Responsabilidade.',
]

function dataHoje() {
  return new Date().toLocaleDateString('pt-BR')
}

export default function CompleteProfile() {
  const { session, completarPerfil } = useAuth()
  const [nome, setNome] = useState(session?.user?.user_metadata?.full_name || '')
  const [telefone, setTelefone] = useState('')
  const [quadra, setQuadra] = useState('')
  const [lote, setLote] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)
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
    if (!aceitouTermos) {
      setErro('Você precisa aceitar os Termos de Uso para continuar'); return
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

      <div className="flex-1 px-4 -mt-6 relative z-10 pb-8">
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

          {/* Termo de uso */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-raised border-b border-border">
              <ShieldCheck size={15} className="text-brand-600 shrink-0" />
              <p className="text-xs font-bold text-ink uppercase tracking-wider">Termo de Uso e Responsabilidade</p>
            </div>
            <div className="h-44 overflow-y-auto scrollbar-thin-y px-4 py-3 space-y-2.5 bg-card">
              {TERMOS.map((t, i) => (
                <p key={i} className="text-xs text-ink-muted leading-relaxed">
                  <span className="font-semibold text-ink">{i + 1}.</span> {t}
                </p>
              ))}
              <p className="text-xs text-ink-muted pt-1">
                <span className="font-semibold text-ink">Data do aceite:</span> {dataHoje()}
              </p>
            </div>
          </div>

          {/* Checkbox aceite */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={e => setAceitouTermos(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                aceitouTermos
                  ? 'bg-brand-600 border-brand-600'
                  : 'bg-raised border-border group-hover:border-brand-400'
              }`}>
                {aceitouTermos && (
                  <svg viewBox="0 0 12 10" className="w-3 h-3 fill-none stroke-white stroke-2">
                    <polyline points="1,5 4,9 11,1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-ink leading-snug">
              Aceito os <span className="font-semibold text-brand-600">Termos de Uso e Responsabilidade</span>
            </span>
          </label>

          <button onClick={handleSalvar} disabled={salvando || !aceitouTermos}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-btn">
            {salvando
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Concluir Cadastro <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
