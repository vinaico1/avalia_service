import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Auth from './pages/Auth'
import CompleteProfile from './pages/CompleteProfile'
import Home from './pages/Home'

function AppRoutes() {
  const { loading, isAuthenticated, cadastroCompleto } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-brand-200 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
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
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
