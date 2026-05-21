import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SystemProvider } from '@/contexts/SystemContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyOtpPage } from '@/pages/VerifyOtpPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { ErpPage } from '@/pages/ErpPage'
import { PosPage } from '@/pages/PosPage'
import { CrmPage } from '@/pages/CrmPage'
import { AdminPage } from '@/pages/AdminPage'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <SystemProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/erp"
              element={
                <ProtectedRoute requireSystem allowedSystem="erp">
                  <ErpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos"
              element={
                <ProtectedRoute requireSystem allowedSystem="pos">
                  <PosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute requireSystem allowedSystem="crm">
                  <CrmPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SystemProvider>
      </AuthProvider>
    </HashRouter>
  )
}
