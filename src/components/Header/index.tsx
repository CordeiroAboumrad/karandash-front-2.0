import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RegularRoutes } from '../../router/routes'
import styles from './Header.module.css'

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('bearerToken')
    navigate(RegularRoutes.LOGIN)
  }

  return (
    <header className={styles.kHeader}>
      <text>Sistema de Gerenciamento Karandash</text>
      <nav className={styles.nav}>
        <Link
          to={RegularRoutes.ARTISTS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.ARTISTS ? styles.active : ''
          }`}
        >
          Artists
        </Link>
        <Link
          to={RegularRoutes.CUSTOMERS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.CUSTOMERS ? styles.active : ''
          }`}
        >
          Customers
        </Link>
        <Link
          to={RegularRoutes.PRODUCTS}
          className={`${styles.navLink} ${
            location.pathname === RegularRoutes.PRODUCTS ? styles.active : ''
          }`}
        >
          Products
        </Link>
        <button onClick={handleLogout} className={styles.navLink}>
          Logout
        </button>
      </nav>
    </header>
  )
}
