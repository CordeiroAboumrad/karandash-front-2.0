import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Oval } from 'react-loader-spinner'
import karandashLogo from '../../assets/karandash.png'
import { login, redefineCredentials } from '../../data/apis/requests'
import { storeRolesFromLogin } from '../../data/auth/roles'
import {
  LoginForm,
  UserCredentialRedefinition,
} from '../../data/schemas/schemas'
import { RegularRoutes } from '../../router/routes'
import styles from './Login.module.css'

export const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isRedefining, setIsRedefining] = useState(false)
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const redefineMethods = useForm<UserCredentialRedefinition>({
    defaultValues: {
      currentEmail: '',
      currentPassword: '',
      newEmail: '',
      newPassword: '',
    },
  })

  const handleSubmit = methods.handleSubmit(async (data) => {
    const email = data.email
    const password = data.password
    if (!email || !password) return
    setLoginError(null)
    setIsLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('bearerToken', res.sessionId)
      storeRolesFromLogin(res)
      sessionStorage.setItem('isAuthenticated', 'true')
      navigate(RegularRoutes.HOME)
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setLoginError('Email ou senha incorretos.')
      } else {
        setLoginError('Nao foi possivel fazer login. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  })

  const handleRedefineCredentials = redefineMethods.handleSubmit(
    async (data) => {
      if (!data.currentEmail || !data.currentPassword || !data.newPassword) {
        return
      }

      setIsRedefining(true)
      try {
        const payload = {
          ...data,
          ...(data.newEmail ? { newEmail: data.newEmail } : {}),
        }
        await redefineCredentials(payload)
        alert('Credenciais atualizadas com sucesso.')
        redefineMethods.reset()
        setIsCredentialModalOpen(false)
      } catch (error) {
        // Error handled by apiErrorHandler
      } finally {
        setIsRedefining(false)
      }
    }
  )

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
                {...methods.register('email', {
                  onChange: () => setLoginError(null),
                })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                {...methods.register('password', {
                  onChange: () => setLoginError(null),
                })}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#cc0000"
                  secondaryColor="#cc0000"
                />
              ) : (
                'Login'
              )}
            </button>
            {loginError && <p className={styles.errorMessage}>{loginError}</p>}
          </form>
        </FormProvider>
        <button
          type="button"
          className={styles.credentialsTrigger}
          onClick={() => setIsCredentialModalOpen(true)}
        >
          Mudar Credenciais
        </button>
      </div>

      {isCredentialModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsCredentialModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className={styles.subTitle}>Mudar Credenciais</h3>
            <p>Campos com * são obrigatórios.</p>
            <FormProvider {...redefineMethods}>
              <form
                onSubmit={handleRedefineCredentials}
                className={styles.form}
              >
                <div className={styles.formGroup}>
                  <label htmlFor="currentEmail">Email Atual *</label>
                  <input
                    id="currentEmail"
                    type="email"
                    {...redefineMethods.register('currentEmail')}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Senha Atual *</label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...redefineMethods.register('currentPassword')}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newEmail">Novo Email</label>
                  <input
                    id="newEmail"
                    type="email"
                    {...redefineMethods.register('newEmail')}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nova Senha *</label>
                  <input
                    id="newPassword"
                    type="password"
                    {...redefineMethods.register('newPassword')}
                    required
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setIsCredentialModalOpen(false)}
                    disabled={isRedefining}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.loginButton}
                    disabled={isRedefining}
                  >
                    {isRedefining ? (
                      <Oval
                        height={20}
                        width={20}
                        color="#cc0000"
                        secondaryColor="#cc0000"
                      />
                    ) : (
                      'Atualizar Credenciais'
                    )}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  )
}
