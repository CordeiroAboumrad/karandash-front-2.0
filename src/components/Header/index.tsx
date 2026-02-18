import { Link } from 'react-router-dom'
import { RegularRoutes } from '../../router/routes'
import styles from './Header.module.css'

export const Header = () => {
  return <header className={styles.kHeader}>
    <text>Sistema de Gerenciamento Karandash</text>
    <nav className={styles.nav}>
      <Link to={RegularRoutes.ARTISTS} className={styles.navLink}>Artists</Link>
      <Link to={RegularRoutes.CUSTOMERS} className={styles.navLink}>Customers</Link>
    </nav>
  </header>;
};
