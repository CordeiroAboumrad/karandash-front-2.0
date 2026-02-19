import { Link, useNavigate } from 'react-router-dom'
import { RegularRoutes } from '../../router/routes'
import styles from './Header.module.css'

export const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated')
    localStorage.removeItem('bearerToken')
    navigate(RegularRoutes.LOGIN)
  }

  return <header className={styles.kHeader}>
    <text>Sistema de Gerenciamento Karandash</text>
    <nav className={styles.nav}>
      <Link to={RegularRoutes.ARTISTS} className={styles.navLink}>Artists</Link>
      <Link to={RegularRoutes.CUSTOMERS} className={styles.navLink}>Customers</Link>
      <button onClick={handleLogout} className={styles.navLink}>Logout</button>
    </nav>
  </header>;
};
