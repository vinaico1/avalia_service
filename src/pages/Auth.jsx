import { useState } from 'react'
import { TreePine, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth()
  const [modo, setModo] = useState('login') // 'login' | 'cadastro'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(null)
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')

  async function handleEmail() {
    if (!email || !senha) { setErro('Preencha e-mail e senha'); return }
    setErro(''); setCarregando('email')
    const fn = modo === 'login' ? signInWithEmail : signUpWithEmail
    const { error } = await fn(email, senha)
    setCarregando(null)
    if (error) {
      if (error.message.includes('Invalid login')) setErro('E-mail ou senha incorretos')
      else if (error.message.includes('already registered')) setErro('E-mail já cadastrado')
      else setErro(error.message)
    } else if (modo === 'cadastro') {
      setMsg('Verifique seu e-mail para confirmar o cadastro!')
    }
  }

  async function handleGoogle() {
    setErro(''); setCarregando('google')
    const { error } = await signInWithGoogle()
    if (error) {
      if (error.message?.includes('provider is not enabled') || error.status === 400) {
        setErro('Google não está ativado ainda. Use e-mail e senha por enquanto.')
      } else {
        setErro(error.message)
      }
      setCarregando(null)
    }
  }

  async function handleApple() {
    setErro(''); setCarregando('apple')
    const { error } = await signInWithApple()
    if (error) {
      if (error.message?.includes('provider is not enabled') || error.status === 400) {
        setErro('Apple Sign-In não está ativado ainda. Use e-mail e senha por enquanto.')
      } else {
        setErro(error.message)
      }
      setCarregando(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-700 to-brand-900">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-3 rounded-2xl">
            <TreePine size={36} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white text-center leading-tight">
          Ninho Verde 1
        </h1>
        <p className="text-brand-200 text-center mt-1 text-sm">
          Avaliação de Prestadores de Serviço
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-safe pb-10 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {modo === 'login' ? 'Bem-vindo!' : 'Criar conta'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {modo === 'login' ? 'Acesse com sua conta de morador' : 'Registre-se para avaliar prestadores'}
        </p>

        {erro && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {erro}
          </div>
        )}
        {msg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
            ✅ {msg}
          </div>
        )}

        {/* Social buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogle}
            disabled={!!carregando}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3.5 font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {carregando === 'google' ? 'Aguarde...' : 'Continuar com Google'}
          </button>

          <button
            onClick={handleApple}
            disabled={!!carregando}
            className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-xl py-3.5 font-semibold hover:bg-gray-900 active:bg-gray-800 transition-colors disabled:opacity-60"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {carregando === 'apple' ? 'Aguarde...' : 'Continuar com Apple'}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">ou com e-mail</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email/senha */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Senha"
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              className="w-full pl-10 pr-11 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleEmail}
          disabled={!!carregando}
          className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 mb-4"
        >
          {carregando === 'email' ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {modo === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
          <button
            onClick={() => { setModo(m => m === 'login' ? 'cadastro' : 'login'); setErro(''); setMsg('') }}
            className="text-brand-600 font-semibold hover:underline"
          >
            {modo === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
