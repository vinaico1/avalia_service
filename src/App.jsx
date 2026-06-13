import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Auth from './pages/Auth'
import CompleteProfile from './pages/CompleteProfile'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function AppRoutes() {
  const { loading, isAuthenticated, cadastroCompleto, recoveryMode } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/70 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (recoveryMode) {
    return (
      <Routes>
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/redefinir-senha" replace />} />
      </Routes>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (!cadastroCompleto) {
    return (
      <Routes>
        <Route path="/completar-cadastro" element={<CompleteProfile />} />
        <Route path="*" element={<Navigate to="/completar-cadastro" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative w-full bg-page min-h-screen sm:max-w-[430px] sm:mx-auto sm:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_64px_rgba(0,0,0,0.18)]">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
