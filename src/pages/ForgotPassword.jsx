import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft, TreePine } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit() {
    if (!email.trim()) { setErro('Informe seu e-mail'); return }
    setErro(''); setCarregando(true)
    const { error } = await resetPassword(email.trim())
    setCarregando(false)
    if (error) setErro(error.message)
    else setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <div className="bg-brand-600 px-6 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-700 rounded-full opacity-40" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-500 rounded-full opacity-20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-5">
            <TreePine size={14} className="text-white" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">NINHO VERDE 1</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">Esqueci minha<br />senha</h1>
          <p className="text-brand-100 text-sm mt-2">
            Enviaremos um link para redefinir sua senha.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-sheet p-6 space-y-5">

          {enviado ? (
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 bg-ok-dim rounded-2xl flex items-center justify-center mx-auto">
                <Mail size={26} className="text-ok" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-ink">E-mail enviado!</p>
                <p className="text-sm text-ink-muted">
                  Verifique sua caixa de entrada em <span className="font-semibold text-ink">{email}</span> e clique no link para redefinir sua senha.
                </p>
              </div>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors shadow-btn"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            <>
              {erro && (
                <div className="p-3 bg-danger-dim rounded-xl text-danger-text text-sm">⚠ {erro}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  E-mail cadastrado
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={carregando}
                className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-btn"
              >
                {carregando
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Enviar link <ArrowRight size={18} /></>}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
              >
                <ArrowLeft size={15} /> Voltar ao login
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="h-8" />
    </div>
  )
}
