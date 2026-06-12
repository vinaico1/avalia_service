import { useState, useMemo, useRef } from 'react'
import { Search, SlidersHorizontal, X, Plus, LogOut, TreePine } from 'lucide-react'
import { PrestadorCard } from '../components/prestadores/PrestadorCard'
import { AvaliacaoModal } from '../components/prestadores/AvaliacaoModal'
import { usePrestadores, useAreasAtuacao } from '../hooks/usePrestadores'
import { useAuth } from '../contexts/AuthContext'

function Skeleton() {
  return (
    <div className="bg-card border border-border rounded-3xl p-4 animate-pulse space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-raised rounded-xl w-2/3" />
          <div className="h-3 bg-raised rounded-xl w-1/3" />
        </div>
        <div className="h-5 bg-raised rounded-full w-24" />
      </div>
      <div className="h-3 bg-raised rounded-xl w-1/2" />
      <div className="h-10 bg-raised rounded-2xl" />
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

  const primeiroNome = perfil?.nome?.split(' ')[0] ?? ''

  return (
    <div className="min-h-screen bg-app flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border safe-top sticky top-0 z-30">
        <div className="px-4 pt-4 pb-3">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <TreePine size={13} className="text-lime" />
                <span className="text-xs text-ink-muted font-medium">Ninho Verde 1</span>
              </div>
              <h1 className="text-xl font-extrabold text-ink leading-tight">
                {primeiroNome ? `Olá, ${primeiroNome} 👋` : 'Prestadores'}
              </h1>
            </div>
            <button
              onClick={signOut}
              className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-raised text-ink-muted hover:text-danger hover:border-danger/30 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                value={buscaInput}
                onChange={e => handleBuscaChange(e.target.value)}
                placeholder="Buscar prestador ou serviço..."
                className="w-full pl-10 pr-9 py-3 bg-raised border border-border rounded-2xl text-sm focus:outline-none focus:border-lime/40 transition-colors"
              />
              {buscaInput && (
                <button
                  onClick={() => { setBuscaInput(''); setBusca('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMostrarFiltros(v => !v)}
              className={`w-11 flex items-center justify-center rounded-2xl border transition-colors relative ${
                mostrarFiltros || areaFiltro
                  ? 'bg-lime border-lime text-app'
                  : 'bg-raised border-border text-ink-muted'
              }`}
            >
              <SlidersHorizontal size={16} />
              {areaFiltro && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-lime rounded-full border-2 border-card" />
              )}
            </button>
          </div>

          {/* Filtro de áreas */}
          {mostrarFiltros && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
              <button
                onClick={() => setAreaFiltro('')}
                className={`snap-start shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  areaFiltro === ''
                    ? 'bg-lime text-app border-lime'
                    : 'bg-raised border-border text-ink-muted'
                }`}
              >
                Todas
              </button>
              {areas.map(a => (
                <button
                  key={a}
                  onClick={() => setAreaFiltro(a === areaFiltro ? '' : a)}
                  className={`snap-start shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    areaFiltro === a
                      ? 'bg-lime text-app border-lime'
                      : 'bg-raised border-border text-ink-muted'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-28">
        {/* Stat bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-ink-muted">
            {loading ? 'Carregando...' : (
              <><span className="text-ink font-bold">{prestadores.length}</span> prestadores</>
            )}
          </span>
          {(busca || areaFiltro) && (
            <button
              onClick={() => { setBusca(''); setBuscaInput(''); setAreaFiltro('') }}
              className="text-lime text-xs font-semibold flex items-center gap-1"
            >
              <X size={11} /> Limpar filtros
            </button>
          )}
        </div>

        {loading && [...Array(5)].map((_, i) => <Skeleton key={i} />)}

        {!loading && prestadores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-raised border border-border rounded-3xl flex items-center justify-center mb-4">
              <Search size={24} className="text-ink-muted" />
            </div>
            <p className="text-ink font-bold">Nenhum prestador encontrado</p>
            <p className="text-ink-muted text-sm mt-1">Tente outros termos ou adicione um novo</p>
          </div>
        )}

        {!loading && prestadores.map(p => (
          <PrestadorCard key={p.id} prestador={p} onAvaliar={() => abrirModal(p)} />
        ))}
      </main>

      {/* FAB */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe px-4 pb-5 z-20 pointer-events-none">
        <div className="max-w-lg mx-auto flex justify-center">
          <button
            onClick={() => abrirModal()}
            className="pointer-events-auto flex items-center gap-2 bg-lime hover:bg-lime-dark text-app font-bold px-6 py-4 rounded-2xl shadow-lime transition-colors"
          >
            <Plus size={18} />
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
