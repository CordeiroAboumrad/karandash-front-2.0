import { Navigate } from 'react-router-dom'

const isAuthenticated = () => {
  return localStorage.getItem('bearerToken') !== null
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
