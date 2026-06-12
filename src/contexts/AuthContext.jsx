import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadPerfil(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadPerfil(session.user.id)
      else setPerfil(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadPerfil(userId) {
    const { data } = await supabase
      .from('perfis_moradores')
      .select('*')
      .eq('id', userId)
      .single()
    setPerfil(data)
  }

  async function signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signInWithApple() {
    return supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signInWithEmail(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUpWithEmail(email, password) {
    return supabase.auth.signUp({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function completarPerfil(dados) {
    const { error } = await supabase
      .from('perfis_moradores')
      .upsert({
        id: session.user.id,
        nome: dados.nome,
        telefone: dados.telefone,
        quadra: dados.quadra,
        lote: dados.lote,
        cadastro_completo: true,
      })
    if (!error) await loadPerfil(session.user.id)
    return { error }
  }

  const value = {
    session,
    perfil,
    loading: session === undefined,
    isAuthenticated: !!session,
    cadastroCompleto: perfil?.cadastro_completo === true,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    completarPerfil,
    refreshPerfil: () => session && loadPerfil(session.user.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
