import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} className={styles.homeButton}>
        Go to Home
      </button>
    </div>
  )
}
