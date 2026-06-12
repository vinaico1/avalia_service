import { useState, useMemo, useRef } from 'react'
import { Search, SlidersHorizontal, X, Plus, LogOut, TreePine } from 'lucide-react'
import { PrestadorCard } from '../components/prestadores/PrestadorCard'
import { AvaliacaoModal } from '../components/prestadores/AvaliacaoModal'
import { usePrestadores, useAreasAtuacao, useMinhasAvaliacoes } from '../hooks/usePrestadores'
import { useAuth } from '../contexts/AuthContext'

function Skeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-4 animate-pulse space-y-3">
      <div className="h-1 bg-gray-100 rounded-full w-full -mt-4 -mx-4 mb-4" style={{width:'calc(100% + 2rem)'}} />
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-raised rounded-lg w-3/4" />
          <div className="h-3 bg-raised rounded-lg w-1/3" />
        </div>
        <div className="h-6 bg-raised rounded-full w-28" />
      </div>
      <div className="h-3 bg-raised rounded-lg w-1/2" />
      <div className="border-t border-border pt-3">
        <div className="h-10 bg-raised rounded-xl" />
      </div>
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
  const { avaliados, refetchAvaliacoes } = useMinhasAvaliacoes(perfil?.id)

  function handleBuscaChange(v) {
    setBuscaInput(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setBusca(v), 300)
  }

  const primeiroNome = perfil?.nome?.split(' ')[0] ?? ''

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border safe-top sticky top-0 z-30 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-btn">
                <TreePine size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-ink-muted font-semibold uppercase tracking-wider leading-none">Ninho Verde 1</p>
                <p className="text-sm font-bold text-ink leading-tight">
                  {primeiroNome ? `Olá, ${primeiroNome}!` : 'Prestadores'}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-raised text-ink-muted hover:text-danger transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Busca */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                value={buscaInput}
                onChange={e => handleBuscaChange(e.target.value)}
                placeholder="Buscar prestador ou serviço..."
                className="w-full pl-10 pr-9 py-2.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              {buscaInput && (
                <button onClick={() => { setBuscaInput(''); setBusca('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMostrarFiltros(v => !v)}
              className={`w-10 flex items-center justify-center rounded-xl border transition-colors relative ${
                mostrarFiltros || areaFiltro
                  ? 'bg-brand-600 border-brand-600 text-white shadow-btn'
                  : 'bg-raised border-border text-ink-muted'
              }`}
            >
              <SlidersHorizontal size={16} />
              {areaFiltro && !mostrarFiltros && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-600 rounded-full border-2 border-card" />
              )}
            </button>
          </div>

          {/* Filtros */}
          {mostrarFiltros && (
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-2 scrollbar-thin-x">
              <button onClick={() => setAreaFiltro('')}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  areaFiltro === '' ? 'bg-brand-600 text-white border-brand-600' : 'bg-raised border-border text-ink-muted'
                }`}>
                Todas
              </button>
              {areas.map(a => (
                <button key={a} onClick={() => setAreaFiltro(a === areaFiltro ? '' : a)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    areaFiltro === a ? 'bg-brand-600 text-white border-brand-600' : 'bg-raised border-border text-ink-muted'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-28">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            {loading ? 'Carregando...' : (
              <><span className="text-ink font-bold">{prestadores.length}</span> prestadores</>
            )}
          </span>
          {(busca || areaFiltro) && (
            <button onClick={() => { setBusca(''); setBuscaInput(''); setAreaFiltro('') }}
              className="text-brand-600 text-xs font-semibold flex items-center gap-1">
              <X size={11} /> Limpar filtros
            </button>
          )}
        </div>

        {loading && [...Array(5)].map((_, i) => <Skeleton key={i} />)}

        {!loading && prestadores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-4 shadow-card">
              <Search size={24} className="text-ink-muted" />
            </div>
            <p className="text-ink font-bold">Nenhum prestador encontrado</p>
            <p className="text-ink-muted text-sm mt-1">Tente outros termos ou adicione um novo</p>
          </div>
        )}

        {!loading && prestadores.map(p => (
          <PrestadorCard
            key={p.id}
            prestador={p}
            jaAvaliou={avaliados.has(p.id)}
            onAvaliar={() => { setPrestadorSelecionado(p); setModalAberto(true) }}
          />
        ))}
      </main>

      {/* FAB */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe px-4 pb-5 z-20 pointer-events-none">
        <div className="max-w-[430px] mx-auto flex justify-center">
          <button
            onClick={() => { setPrestadorSelecionado(null); setModalAberto(true) }}
            className="pointer-events-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold px-6 py-4 rounded-2xl shadow-btn transition-colors"
          >
            <Plus size={18} />
            Avaliar Prestador
          </button>
        </div>
      </div>

      {modalAberto && (
        <AvaliacaoModal
          prestadorInicial={prestadorSelecionado}
          onClose={() => { setModalAberto(false); setPrestadorSelecionado(null) }}
          onSucesso={() => { refetch(); refetchAvaliacoes() }}
        />
      )}
    </div>
  )
}
