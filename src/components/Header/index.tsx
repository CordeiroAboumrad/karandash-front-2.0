import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isSuperUser } from '../../data/auth/roles'
import { RegularRoutes } from '../../router/routes'
import styles from './Header.module.css'

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const canManageUsers = isSuperUser()

  const handleLogout = () => {
    localStorage.removeItem('bearerToken')
    localStorage.removeItem('userRoles')
    navigate(RegularRoutes.LOGIN)
  }

  return (
    <header className={styles.kHeader}>
      <div className={styles.headerTitle}>
        Sistema de Gerenciamento Karandash
      </div>
      <nav className={styles.nav}>
        <Link
          to={RegularRoutes.ARTISTS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.ARTISTS ? styles.active : ''
          }`}
        >
          Artistas
        </Link>
        <Link
          to={RegularRoutes.CUSTOMERS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.CUSTOMERS ? styles.active : ''
          }`}
        >
          Clientes
        </Link>
        <Link
          to={RegularRoutes.PRODUCTS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.PRODUCTS ? styles.active : ''
          }`}
        >
          Produtos
        </Link>
        {canManageUsers && (
          <Link
            to={RegularRoutes.USERS}
            className={`${styles.navLink} ${
              location.pathname === RegularRoutes.USERS ? styles.active : ''
            }`}
          >
            Usuários
          </Link>
        )}
        <button onClick={handleLogout} className={styles.navLink}>
          Logout
        </button>
      </nav>
    </header>
  )
}
