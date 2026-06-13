import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DIACRITICS = /\p{Mn}/gu

function sem_acento(str) {
  return String(str ?? '').normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim()
}

export function usePrestadores(filtros = {}) {
  const [prestadores, setPrestadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrestadores = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('prestadores_com_media')
      .select('*')
      .order('nota_media', { ascending: false, nullsFirst: false })
      .order('total_avaliacoes', { ascending: false })
      .order('nome', { ascending: true })

    if (filtros.area) {
      query = query.eq('area_atuacao', filtros.area)
    }

    const { data, error } = await query
    if (error) { setError(error.message); setLoading(false); return }

    let results = data || []
    if (filtros.busca) {
      const q = sem_acento(filtros.busca)
      results = results.filter(p =>
        sem_acento(p.nome).includes(q) || sem_acento(p.area_atuacao).includes(q)
      )
    }

    setPrestadores(results)
    setLoading(false)
  }, [filtros.area, filtros.busca])

  useEffect(() => { fetchPrestadores() }, [fetchPrestadores])

  return { prestadores, loading, error, refetch: fetchPrestadores }
}

export function useMinhasAvaliacoes(moradorId) {
  const [avaliados, setAvaliados] = useState(new Set())
  const [rev, setRev] = useState(0)

  useEffect(() => {
    if (!moradorId) return
    supabase
      .from('avaliacoes')
      .select('prestador_id')
      .eq('morador_id', moradorId)
      .then(({ data }) => {
        if (data) setAvaliados(new Set(data.map(a => a.prestador_id)))
      })
  }, [moradorId, rev])

  return { avaliados, refetchAvaliacoes: () => setRev(r => r + 1) }
}

export function useAreasAtuacao() {
  const [areas, setAreas] = useState([])

  useEffect(() => {
    supabase
      .from('prestadores')
      .select('area_atuacao')
      .then(({ data }) => {
        if (data) {
          const unicas = [...new Set(data.map(d => d.area_atuacao))].sort()
          setAreas(unicas)
        }
      })
  }, [])

  return areas
}

export async function buscarPrestadorPorTelefone(telefone) {
  const tel = telefone.replace(/\D/g, '')
  const { data } = await supabase
    .from('prestadores_com_media')
    .select('*')
    .eq('telefone_limpo', tel)
    .maybeSingle()
  return data
}

export async function cadastrarPrestador({ nome, telefone, area_atuacao }) {
  const { data, error } = await supabase
    .from('prestadores')
    .insert({ nome, telefone, area_atuacao })
    .select()
    .single()
  return { data, error }
}

export async function salvarAvaliacao({ prestador_id, morador_id, nota, observacao }) {
  const { data, error } = await supabase
    .from('avaliacoes')
    .upsert(
      { prestador_id, morador_id, nota, observacao },
      { onConflict: 'morador_id,prestador_id' }
    )
    .select()
    .single()
  return { data, error }
}

export async function buscarMinhaAvaliacao(prestador_id, morador_id) {
  const { data } = await supabase
    .from('avaliacoes')
    .select('nota, observacao')
    .eq('prestador_id', prestador_id)
    .eq('morador_id', morador_id)
    .maybeSingle()
  return data
}
