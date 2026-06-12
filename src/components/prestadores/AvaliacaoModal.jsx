import { useState, useEffect } from 'react'
import { X, Phone, Search, CheckCircle } from 'lucide-react'
import { StarPicker } from '../ui/StarRating'
import {
  buscarPrestadorPorTelefone,
  cadastrarPrestador,
  salvarAvaliacao,
  buscarMinhaAvaliacao,
} from '../../hooks/usePrestadores'
import { useAuth } from '../../contexts/AuthContext'

const AREAS = [
  'Água/Gás/Gelo','Alarme/Câmeras','Alimentos/Bebidas','Aquecedor Solar',
  'Ar Condicionado','Arquitetura','Caçambas/Entulho','Calhas/Telhados',
  'Construtor/Empreiteiro','Corretagem','Cortinas/Persianas','Decks/Pergolados',
  'Dedetização','Eletricista','Encanador/Pedreiro','Engenharia','Esquadrias/Vidros',
  'Estética/Cabeleireira','Faxineira','Gesseiro','Instalação Porcelanato',
  'Internet','Jardinagem/Piscina','Lavanderia','Marcenaria/Planejados',
  'Mármores/Granitos','Montador de Móveis','Pedreiro','Pintor','Piscineiro',
  'Refrigeração','Segurança/Portões','Outros',
]

const LABEL_NOTA = { 0:'', 1:'😡 Péssimo', 2:'😞 Ruim', 3:'😐 Regular', 4:'😊 Bom', 5:'🌟 Excelente!' }

export function AvaliacaoModal({ prestadorInicial, onClose, onSucesso }) {
  const { perfil } = useAuth()
  const [etapa, setEtapa] = useState(prestadorInicial ? 'avaliar' : 'buscar')
  const [telefone, setTelefone] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [prestador, setPrestador] = useState(prestadorInicial || null)
  const [novoNome, setNovoNome] = useState('')
  const [novaArea, setNovaArea] = useState('')
  const [nota, setNota] = useState(0)
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (prestadorInicial && perfil) {
      buscarMinhaAvaliacao(prestadorInicial.id, perfil.id).then(av => {
        if (av) { setNota(av.nota); setObservacao(av.observacao || '') }
      })
    }
  }, [prestadorInicial, perfil])

  const maskTel = (v) => {
    let d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    if (d.length > 6)  return d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
    if (d.length > 2)  return d.replace(/(\d{2})(\d+)/, '($1) $2')
    return d
  }

  async function handleBuscar() {
    if (!telefone.trim()) return
    setBuscando(true); setErro('')
    const found = await buscarPrestadorPorTelefone(telefone)
    setBuscando(false)
    if (found) {
      setPrestador(found)
      const av = await buscarMinhaAvaliacao(found.id, perfil.id)
      if (av) { setNota(av.nota); setObservacao(av.observacao || '') }
      setEtapa('avaliar')
    } else {
      setEtapa('cadastrar')
    }
  }

  async function handleCadastrarEAvaliar() {
    if (!novoNome.trim() || !novaArea) { setErro('Preencha nome e área de atuação'); return }
    setSalvando(true); setErro('')
    const { data, error } = await cadastrarPrestador({ nome: novoNome.trim(), telefone: telefone.trim(), area_atuacao: novaArea })
    if (error) { setErro(error.message.includes('unique') ? 'Telefone já cadastrado.' : error.message); setSalvando(false); return }
    setPrestador(data); setEtapa('avaliar'); setSalvando(false)
  }

  async function handleSalvarAvaliacao() {
    if (nota === 0) { setErro('Selecione uma nota'); return }
    if (nota <= 3 && !observacao.trim()) { setErro('Para notas baixas, o comentário é obrigatório'); return }
    setSalvando(true); setErro('')
    const { error } = await salvarAvaliacao({ prestador_id: prestador.id, morador_id: perfil.id, nota, observacao: observacao.trim() || null })
    setSalvando(false)
    if (error) { setErro(error.message); return }
    setSucesso(true)
    setTimeout(() => { onSucesso?.(); onClose() }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-sheet max-h-[90vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-ink-faint rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-ink">
            {etapa === 'buscar' && 'Buscar Prestador'}
            {etapa === 'cadastrar' && 'Novo Prestador'}
            {etapa === 'avaliar' && 'Sua Avaliação'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-border bg-raised text-ink-muted hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {sucesso && (
            <div className="flex items-center gap-3 p-4 bg-ok-dim border border-ok/20 rounded-2xl text-ok-text">
              <CheckCircle size={20} className="text-ok shrink-0" />
              <span className="font-semibold text-sm">Avaliação salva com sucesso!</span>
            </div>
          )}

          {erro && (
            <div className="p-3 bg-danger-dim border border-danger/20 rounded-2xl text-danger-text text-sm">
              ⚠ {erro}
            </div>
          )}

          {/* BUSCAR */}
          {etapa === 'buscar' && (
            <div className="space-y-4">
              <p className="text-sm text-ink-muted">Informe o telefone do prestador para buscar ou cadastrar.</p>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  Telefone do Prestador
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="tel"
                      value={telefone}
                      onChange={e => setTelefone(maskTel(e.target.value))}
                      placeholder="(15) 99999-9999"
                      onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                      className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleBuscar}
                    disabled={buscando || !telefone.trim()}
                    className="w-12 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-btn"
                  >
                    {buscando
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Search size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CADASTRAR */}
          {etapa === 'cadastrar' && (
            <div className="space-y-3">
              <div className="p-3 bg-raised border border-border rounded-xl text-xs text-ink-muted">
                Prestador não encontrado. Preencha os dados para cadastrá-lo.
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Telefone</label>
                <input
                  value={telefone}
                  disabled
                  className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm text-ink-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Nome *</label>
                <input
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Área de Atuação *</label>
                <select
                  value={novaArea}
                  onChange={e => setNovaArea(e.target.value)}
                  className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <button
                onClick={handleCadastrarEAvaliar}
                disabled={salvando}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 shadow-btn"
              >
                {salvando ? 'Cadastrando...' : 'Cadastrar e Avaliar'}
              </button>
            </div>
          )}

          {/* AVALIAR */}
          {etapa === 'avaliar' && prestador && (
            <div className="space-y-5">
              {/* Info do prestador */}
              <div className="p-4 bg-raised border border-border rounded-2xl">
                <p className="font-bold text-ink">{prestador.nome}</p>
                <p className="text-xs text-ink-muted mt-0.5">{prestador.area_atuacao}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Phone size={11} className="text-ink-muted" />
                  <span className="text-xs text-ink-muted">{prestador.telefone}</span>
                </div>
              </div>

              {/* Estrelas */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Sua nota</label>
                <div className="space-y-2">
                  <StarPicker value={nota} onChange={setNota} />
                  {nota > 0 && (
                    <p className="text-sm text-ink-muted">{LABEL_NOTA[nota]}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setNota(0)}
                    className={`mt-1 text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      nota === 0
                        ? 'bg-danger-dim border-danger/30 text-danger-text font-semibold'
                        : 'border-border text-ink-muted hover:border-danger/30 hover:text-danger-text'
                    }`}
                  >
                    ✕ Nota 0 — Não Recomendado
                  </button>
                </div>
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  Comentário{' '}
                  {nota > 0 && nota <= 3
                    ? <span className="text-danger-text normal-case font-normal ml-1">* obrigatório</span>
                    : <span className="text-ink-muted normal-case font-normal ml-1">(opcional)</span>
                  }
                </label>
                <textarea
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                  placeholder="Descreva sua experiência..."
                  rows={3}
                  className="w-full px-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleSalvarAvaliacao}
                disabled={salvando || sucesso}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-btn"
              >
                {salvando
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Salvar Avaliação'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
