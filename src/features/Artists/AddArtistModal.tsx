import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { createArtist } from '../../data/apis/requests'
import styles from './AddArtistModal.module.css'
import { Artist } from '../../data/apis/types'

interface AddArtistModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddArtistModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddArtistModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Artist>()

  if (!isOpen) return null

  const onSubmit = async (data: Artist) => {
    setIsLoading(true)
    try {
      await createArtist(data)
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      // Error handled by apiErrorHandler
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Add New Artist</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              {...register('artistName', { required: 'Name is required' })}
            />
            {errors.artistName && (
              <span className={styles.error}>{errors.artistName.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateofbirth">Data de Nascimento</label>
            <input id="dateofbirth" type="date" {...register('dateOfBirth')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="placeofbirth">Place of Birth</label>
            <input
              id="placeofbirth"
              type="text"
              {...register('placeOfBirth')}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="history">History</label>
            <textarea id="history" rows={4} {...register('history')} />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#fff"
                  secondaryColor="#fff"
                />
              ) : (
                'Add Artist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
