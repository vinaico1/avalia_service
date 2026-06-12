import { useState } from 'react'
import { Home, Phone, AlertCircle, MapPin } from 'lucide-react'
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
    if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
    if (d.length > 2) return d.replace(/(\d{2})(\d+)/, '($1) $2')
    return d
  }

  async function handleSalvar() {
    if (!nome.trim() || !telefone.trim() || !quadra.trim() || !lote.trim()) {
      setErro('Todos os campos são obrigatórios')
      return
    }
    setSalvando(true)
    setErro('')
    const { error } = await completarPerfil({ nome: nome.trim(), telefone, quadra: quadra.toUpperCase().trim(), lote: lote.toUpperCase().trim() })
    setSalvando(false)
    if (error) {
      if (error.message.includes('unique') || error.message.includes('duplicate')) {
        setErro('Esta combinação de Quadra + Lote já está cadastrada. Contate o administrador.')
      } else {
        setErro(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-4">
        <div className="bg-white/20 p-4 rounded-2xl mb-4">
          <Home size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white text-center">Quase lá!</h1>
        <p className="text-brand-200 text-center mt-1 text-sm px-4">
          Informe os dados da sua residência para continuar
        </p>
      </div>

      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-safe pb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Completar Cadastro</h2>
        <p className="text-sm text-gray-500 mb-6">
          Estes dados identificam sua residência no condomínio.
        </p>

        {erro && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {erro}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(maskTel(e.target.value))}
                placeholder="(15) 99999-9999"
                className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quadra *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={quadra}
                  onChange={e => setQuadra(e.target.value)}
                  placeholder="Ex: A"
                  maxLength={5}
                  className="w-full pl-9 pr-3 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lote *</label>
              <input
                value={lote}
                onChange={e => setLote(e.target.value)}
                placeholder="Ex: 12"
                maxLength={6}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-blue-700">
              A combinação Quadra + Lote identifica sua residência e deve ser única. Moradores da mesma casa devem usar a mesma combinação.
            </p>
          </div>

          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-60 text-base"
          >
            {salvando ? 'Salvando...' : 'Concluir Cadastro'}
          </button>
        </div>
      </div>
    </div>
  )
}
