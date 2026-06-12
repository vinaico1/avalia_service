import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, X, Plus, LogOut, TreePine, ChevronDown, ChevronUp } from 'lucide-react'
import { PrestadorCard } from '../components/prestadores/PrestadorCard'
import { AvaliacaoModal } from '../components/prestadores/AvaliacaoModal'
import { usePrestadores, useAreasAtuacao } from '../hooks/usePrestadores'
import { useAuth } from '../contexts/AuthContext'

function Skeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  )
}

export default function Home() {
  const { perfil, signOut } = useAuth()
  const [busca, setBusca] = useState('')
  const [buscaInput, setBuscaInput] = useState('')
  const [areaFiltro, setAreaFiltro] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [prestadorSelecionado, setPrestadorSelecionado] = useState(null)
  const areas = useAreasAtuacao()
  const debounceRef = useRef(null)

  const filtros = useMemo(() => ({ busca, area: areaFiltro }), [busca, areaFiltro])
  const { prestadores, loading, refetch } = usePrestadores(filtros)

  function handleBuscaChange(v) {
    setBuscaInput(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setBusca(v), 300)
  }

  function abrirModal(prestador = null) {
    setPrestadorSelecionado(prestador)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setPrestadorSelecionado(null)
  }

  const totalFiltros = (areaFiltro ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-brand-700 text-white safe-top sticky top-0 z-30 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine size={22} />
            <div>
              <h1 className="font-bold text-base leading-tight">Ninho Verde 1</h1>
              <p className="text-brand-200 text-xs leading-none">Prestadores de Serviço</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-200 hidden sm:block">
              {perfil?.nome?.split(' ')[0]}
            </span>
            <button
              onClick={signOut}
              className="p-2 rounded-full hover:bg-brand-600 active:bg-brand-500 transition-colors"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={buscaInput}
              onChange={e => handleBuscaChange(e.target.value)}
              placeholder="Buscar prestador ou serviço..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {buscaInput && (
              <button
                onClick={() => { setBuscaInput(''); setBusca('') }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setMostrarFiltros(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors relative ${mostrarFiltros || totalFiltros > 0 ? 'bg-white text-brand-700' : 'bg-brand-600 text-white'}`}
          >
            <SlidersHorizontal size={15} />
            {totalFiltros > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalFiltros}
              </span>
            )}
          </button>
        </div>

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="px-4 pb-3 border-t border-brand-600 pt-3">
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
              <button
                onClick={() => setAreaFiltro('')}
                className={`snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${areaFiltro === '' ? 'bg-white text-brand-700' : 'bg-brand-600 text-brand-100 border border-brand-500'}`}
              >
                Todas
              </button>
              {areas.slice(0, 30).map(a => (
                <button
                  key={a}
                  onClick={() => setAreaFiltro(a === areaFiltro ? '' : a)}
                  className={`snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${areaFiltro === a ? 'bg-white text-brand-700' : 'bg-brand-600 text-brand-100 border border-brand-500'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-24">
        {/* Stats bar */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {loading ? 'Carregando...' : `${prestadores.length} prestador${prestadores.length !== 1 ? 'es' : ''}`}
            {(busca || areaFiltro) && ' encontrado' + (prestadores.length !== 1 ? 's' : '')}
          </span>
          {(busca || areaFiltro) && (
            <button
              onClick={() => { setBusca(''); setBuscaInput(''); setAreaFiltro('') }}
              className="text-brand-600 text-xs font-medium flex items-center gap-1"
            >
              <X size={12} /> Limpar filtros
            </button>
          )}
        </div>

        {loading && [...Array(4)].map((_, i) => <Skeleton key={i} />)}

        {!loading && prestadores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Nenhum prestador encontrado</p>
            <p className="text-gray-400 text-sm mt-1">Tente outros termos ou adicione um novo</p>
          </div>
        )}

        {!loading && prestadores.map(p => (
          <PrestadorCard
            key={p.id}
            prestador={p}
            onAvaliar={() => abrirModal(p)}
          />
        ))}
      </main>

      {/* FAB - Adicionar/Avaliar */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe pb-4 px-4 pointer-events-none z-20">
        <div className="max-w-lg mx-auto flex justify-end">
          <button
            onClick={() => abrirModal()}
            className="pointer-events-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold px-5 py-3.5 rounded-2xl shadow-lg shadow-brand-900/30 transition-all"
          >
            <Plus size={20} />
            Avaliar Prestador
          </button>
        </div>
      </div>

      {modalAberto && (
        <AvaliacaoModal
          prestadorInicial={prestadorSelecionado}
          onClose={fecharModal}
          onSucesso={refetch}
        />
      )}
    </div>
  )
}
