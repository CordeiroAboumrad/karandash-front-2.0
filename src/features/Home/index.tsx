import { useNavigate } from 'react-router-dom'
import { isSuperUser } from '../../data/auth/roles'
import { RegularRoutes } from '../../router/routes'
import styles from './Home.module.css'

export const Home = () => {
  const navigate = useNavigate()
  const canManageUsers = isSuperUser()

  return (
    <div className={styles.home}>
      <h1>Sistema de Gerenciamento Karandash</h1>
      <div className={styles.sectionsGrid}>
        <div className={styles.section}>
          <h2>Artistas</h2>
          <button
            onClick={() => navigate(RegularRoutes.ARTISTS)}
            className={styles.viewButton}
          >
            Ver Artistas
          </button>
        </div>

        <div className={styles.section}>
          <h2>Clientes</h2>
          <button
            onClick={() => navigate(RegularRoutes.CUSTOMERS)}
            className={styles.viewButton}
          >
            Ver Clientes
          </button>
        </div>

        <div className={styles.section}>
          <h2>Produtos</h2>
          <button
            onClick={() => navigate(RegularRoutes.PRODUCTS)}
            className={styles.viewButton}
          >
            Ver Produtos
          </button>
        </div>

        {canManageUsers && (
          <div className={styles.section}>
            <h2>Usuários</h2>
            <button
              onClick={() => navigate(RegularRoutes.USERS)}
              className={styles.viewButton}
            >
              Gerenciar Usuários
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
