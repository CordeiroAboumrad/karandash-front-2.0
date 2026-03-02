import { Navigate } from 'react-router-dom'
import { isSuperUser } from '../data/auth/roles'
import { RegularRoutes } from './routes'

export const SuperuserRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isSuperUser()) {
    return <Navigate to={RegularRoutes.HOME} replace />
  }

  return <>{children}</>
}
