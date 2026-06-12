import { useState, useEffect } from 'react'
import { X, Phone, Search, AlertCircle, CheckCircle } from 'lucide-react'
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

  async function handleBuscar() {
    if (!telefone.trim()) return
    setBuscando(true)
    setErro('')
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
    if (!novoNome.trim() || !novaArea) {
      setErro('Preencha nome e área de atuação')
      return
    }
    setSalvando(true)
    setErro('')
    const { data, error } = await cadastrarPrestador({
      nome: novoNome.trim(),
      telefone: telefone.trim(),
      area_atuacao: novaArea,
    })
    if (error) {
      setErro(error.message.includes('unique') ? 'Telefone já cadastrado.' : error.message)
      setSalvando(false)
      return
    }
    setPrestador(data)
    setEtapa('avaliar')
    setSalvando(false)
  }

  async function handleSalvarAvaliacao() {
    if (nota === 0) { setErro('Selecione uma nota'); return }
    if (nota <= 3 && !observacao.trim()) {
      setErro('Para notas baixas, o comentário é obrigatório')
      return
    }
    setSalvando(true)
    setErro('')
    const { error } = await salvarAvaliacao({
      prestador_id: prestador.id,
      morador_id: perfil.id,
      nota,
      observacao: observacao.trim() || null,
    })
    setSalvando(false)
    if (error) { setErro(error.message); return }
    setSucesso(true)
    setTimeout(() => { onSucesso?.(); onClose() }, 1500)
  }

  const maskTel = (v) => {
    let d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length > 10) d = d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    else if (d.length > 6) d = d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
    else if (d.length > 2) d = d.replace(/(\d{2})(\d+)/, '($1) $2')
    return d
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {etapa === 'buscar' && 'Avaliar Prestador'}
            {etapa === 'cadastrar' && 'Novo Prestador'}
            {etapa === 'avaliar' && 'Sua Avaliação'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {sucesso && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <CheckCircle size={20} />
              <span className="font-semibold">Avaliação salva com sucesso!</span>
            </div>
          )}

          {erro && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              {erro}
            </div>
          )}

          {/* ETAPA: BUSCAR */}
          {etapa === 'buscar' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Informe o telefone do prestador. Se já estiver cadastrado, você avaliará diretamente. Se não, poderá cadastrá-lo.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Prestador
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={telefone}
                    onChange={e => setTelefone(maskTel(e.target.value))}
                    placeholder="(15) 99999-9999"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
                    onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                  />
                  <button
                    onClick={handleBuscar}
                    disabled={buscando || !telefone.trim()}
                    className="bg-brand-600 text-white px-4 rounded-xl disabled:opacity-50 transition-colors hover:bg-brand-700"
                  >
                    {buscando ? <span className="animate-spin">⏳</span> : <Search size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA: CADASTRAR */}
          {etapa === 'cadastrar' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                Prestador não encontrado. Preencha os dados para cadastrá-lo.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input value={telefone} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação *</label>
                <select
                  value={novaArea}
                  onChange={e => setNovaArea(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <button
                onClick={handleCadastrarEAvaliar}
                disabled={salvando}
                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {salvando ? 'Cadastrando...' : 'Cadastrar e Avaliar'}
              </button>
            </div>
          )}

          {/* ETAPA: AVALIAR */}
          {etapa === 'avaliar' && prestador && (
            <div className="space-y-5">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="font-bold text-gray-900">{prestador.nome}</p>
                <p className="text-sm text-gray-500">{prestador.area_atuacao}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{prestador.telefone}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sua nota (0 = Não Recomendado)
                </label>
                <div className="space-y-2">
                  <StarPicker value={nota} onChange={setNota} />
                  {nota > 0 && (
                    <p className="text-sm text-gray-500">
                      {nota === 1 && '😡 Péssimo'}
                      {nota === 2 && '😞 Ruim'}
                      {nota === 3 && '😐 Regular'}
                      {nota === 4 && '😊 Bom'}
                      {nota === 5 && '🌟 Excelente!'}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setNota(0)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${nota === 0 ? 'bg-red-100 border-red-300 text-red-700 font-semibold' : 'border-gray-200 text-gray-500 hover:bg-red-50'}`}
                  >
                    ✕ Nota 0 — Não Recomendado
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentário {nota > 0 && nota <= 3 ? <span className="text-red-500">*</span> : '(opcional)'}
                </label>
                <textarea
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                  placeholder="Descreva sua experiência..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <button
                onClick={handleSalvarAvaliacao}
                disabled={salvando || sucesso}
                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar Avaliação'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
