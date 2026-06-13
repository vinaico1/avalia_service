import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TreePine, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')

  async function handleEmail() {
    if (!email || !senha) { setErro('Preencha e-mail e senha'); return }
    setErro(''); setCarregando(true)
    const fn = modo === 'login' ? signInWithEmail : signUpWithEmail
    const { error } = await fn(email, senha)
    setCarregando(false)
    if (error) {
      if (error.message.includes('Invalid login')) setErro('E-mail ou senha incorretos')
      else if (error.message.includes('already registered')) setErro('E-mail já cadastrado')
      else setErro(error.message)
    } else if (modo === 'cadastro') {
      setMsg('Verifique seu e-mail para confirmar o cadastro!')
    }
  }

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Header verde */}
      <div className="bg-brand-600 px-6 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-700 rounded-full opacity-40" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-500 rounded-full opacity-20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-5">
            <TreePine size={14} className="text-white" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">NINHO VERDE 1</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Avalie os prestadores<br />do condomínio
          </h1>
          <p className="text-brand-100 text-sm mt-2">
            Compartilhe experiências e encontre os melhores profissionais.
          </p>
        </div>
      </div>

      {/* Card flutuante */}
      <div className="flex-1 px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-sheet p-6">

          {/* Tabs */}
          <div className="flex gap-1 bg-raised rounded-2xl p-1 mb-6">
            {['login','cadastro'].map(m => (
              <button
                key={m}
                onClick={() => { setModo(m); setErro(''); setMsg('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  modo === m
                    ? 'bg-brand-600 text-white shadow-btn'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {erro && (
            <div className="flex items-start gap-2 p-3 bg-danger-dim rounded-xl text-danger-text text-sm mb-4">
              <span className="shrink-0">⚠</span> {erro}
            </div>
          )}
          {msg && (
            <div className="p-3 bg-ok-dim rounded-xl text-ok-text text-sm mb-4">✓ {msg}</div>
          )}

          <div className="space-y-3 mb-5">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Senha"
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                className="w-full pl-10 pr-11 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {modo === 'login' && (
            <Link
              to="/esqueci-senha"
              className="flex items-center justify-center gap-2 w-full border border-border bg-raised hover:bg-border text-ink-muted hover:text-ink text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <KeyRound size={15} />
              Recuperar senha
            </Link>
          )}

          <button
            onClick={handleEmail}
            disabled={carregando}
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-btn"
          >
            {carregando
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>{modo === 'login' ? 'Entrar' : 'Criar conta'} <ArrowRight size={18} /></>
            }
          </button>

          {/* Social — em breve */}
          <div className="mt-5 space-y-3 opacity-40 pointer-events-none select-none">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-ink-muted text-xs font-medium">em breve</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-ink-muted text-sm bg-raised">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-ink-muted text-sm bg-raised">
                <svg className="w-4 h-4 fill-ink-muted" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-6">
        <p className="text-[11px] text-ink-muted leading-relaxed text-center">
          ⚠️ Este é um projeto independente criado por morador do condomínio, sem vínculo com a administração do Ninho Verde 1. As avaliações refletem exclusivamente a opinião dos usuários que contrataram os serviços. Prestadores que desejarem atualizar ou remover seus dados poderão solicitar diretamente pelo aplicativo.
        </p>
      </div>
    </div>
  )
}
