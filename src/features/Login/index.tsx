import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Oval } from 'react-loader-spinner'
import karandashLogo from '../../assets/karandash.png'
import { login } from '../../data/apis/requests'
import { LoginForm } from '../../data/schemas/schemas'
import { RegularRoutes } from '../../router/routes'
import styles from './Login.module.css'

export const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = methods.handleSubmit(async (data) => {
    const email = data.email
    const password = data.password
    if (!email || !password) return
    setIsLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('bearerToken', res.sessionId)
      sessionStorage.setItem('isAuthenticated', 'true')
      navigate(RegularRoutes.HOME)
    } catch (error) {
      // Error handled by apiErrorHandler
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <a
          href="http://www.acessoainformacao.gov.br/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={karandashLogo} alt="link acesso informacao" />
        </a>
      </div>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                {...methods.register('email')}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...methods.register('password')}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? (
                <Oval height={20} width={20} color="#cc0000" secondaryColor="#cc0000" />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
