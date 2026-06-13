import { useState } from 'react'
import { Lock, Eye, EyeOff, ArrowRight, TreePine } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit() {
    if (!senha || !confirmar) { setErro('Preencha os dois campos'); return }
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres'); return }
    if (senha !== confirmar) { setErro('As senhas não coincidem'); return }
    setErro(''); setCarregando(true)
    const { error } = await updatePassword(senha)
    setCarregando(false)
    if (error) setErro(error.message)
    // Em caso de sucesso, USER_UPDATED dispara no AuthContext
    // → recoveryMode = false → rota normal assume o controle
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
          <h1 className="text-3xl font-extrabold text-white leading-tight">Nova senha</h1>
          <p className="text-brand-100 text-sm mt-2">
            Escolha uma senha segura para sua conta.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-sheet p-6 space-y-4">

          {erro && (
            <div className="p-3 bg-danger-dim rounded-xl text-danger-text text-sm">⚠ {erro}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Nova senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Repita a nova senha"
                className="w-full pl-10 pr-4 py-3.5 bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          {senha && confirmar && senha === confirmar && (
            <div className="flex items-center gap-2 text-ok-text text-sm px-1">
              <span className="w-4 h-4 rounded-full bg-ok-dim flex items-center justify-center text-ok text-xs font-bold">✓</span>
              Senhas coincidem
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={carregando}
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-btn"
          >
            {carregando
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Salvar nova senha <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
      <div className="h-8" />
    </div>
  )
}
