import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você procura não existe.</p>
      <button onClick={() => navigate('/')} className={styles.homeButton}>
        Ir para o início
      </button>
    </div>
  )
}
