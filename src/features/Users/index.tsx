import { useEffect, useMemo, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import {
  changeUser,
  createAdmin,
  createUser,
  deleteUser,
  getAllUsers,
} from '../../data/apis/requests'
import { User } from '../../data/apis/types'
import styles from './Users.module.css'
import { UserCreateUpdate } from '../../data/schemas/schemas'

type UserFormState = {
  firstName: string
  lastName: string
  primaryEmail: string
  username: string
  password: string
  isAdmin: boolean
}

const emptyForm: UserFormState = {
  firstName: '',
  lastName: '',
  primaryEmail: '',
  username: '',
  password: '',
  isAdmin: false,
}

const getRoleLabel = (user: User): string => {
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles.join(', ')
  }

  if (user.role) {
    return user.role
  }

  return 'USER'
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState<UserFormState>(emptyForm)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      alert('Houve um problema ao carregar os usuários.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return users
    }

    return users.filter((user) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase()
      return (
        fullName.includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.primaryemail.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, users])

  const openCreateModal = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setForm({
      firstName: user.firstname,
      lastName: user.lastname,
      primaryEmail: user.primaryemail,
      username: user.username,
      password: '',
      isAdmin: false,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
  }

  const handleSave: NonNullable<
    React.ComponentProps<'form'>['onSubmit']
  > = async (event) => {
    event.preventDefault()

    if (
      !form.firstName ||
      !form.lastName ||
      !form.primaryEmail ||
      !form.username ||
      !form.password
    ) {
      alert('Preencha todos os campos obrigatórios.')
      return
    }

    const payload: UserCreateUpdate = {
      firstname: form.firstName,
      lastname: form.lastName,
      primaryemail: form.primaryEmail,
      username: form.username,
      password: form.password,
    }

    setIsSaving(true)
    try {
      if (editingUser) {
        await changeUser(payload)
      } else if (form.isAdmin) {
        await createAdmin(payload)
      } else {
        await createUser(payload)
      }

      closeModal()
      await fetchUsers()
    } catch (error) {
      console.error(error)
      alert('Houve um problema ao salvar o usuário.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    const shouldDelete = window.confirm(
      `Deletar usuário "${user.username}"? Esta ação não pode ser desfeita.`
    )

    if (!shouldDelete) {
      return
    }

    setIsLoading(true)
    try {
      await deleteUser(user.id)
      await fetchUsers()
    } catch (error) {
      console.error(error)
      alert('Houve um problema ao excluir o usuário.')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <h2>Gerenciamento de Usuários</h2>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Procure por nome, nome de usuário, email ou ID"
          className={styles.searchInput}
        />
        <button onClick={openCreateModal} className={styles.addButton}>
          + Usuário
        </button>
      </div>

      {isLoading && (
        <div className={styles.loader}>
          <Oval
            height={50}
            width={50}
            color="#cc0000"
            secondaryColor="#cc0000"
          />
        </div>
      )}

      {!isLoading && filteredUsers.length === 0 && (
        <p>Nenhum usuário encontrado.</p>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{`${user.firstname} ${user.lastname}`}</td>
                  <td>{user.username}</td>
                  <td>{user.primaryemail}</td>
                  <td>{getRoleLabel(user)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => openEditModal(user)}
                        className={styles.editButton}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className={styles.deleteButton}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="primaryEmail">Email</label>
                  <input
                    id="primaryEmail"
                    type="email"
                    value={form.primaryEmail}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        primaryEmail: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    {editingUser ? 'New Password' : 'Password'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {!editingUser && (
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.isAdmin}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isAdmin: e.target.checked,
                      }))
                    }
                  />
                  Create as admin
                </label>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
