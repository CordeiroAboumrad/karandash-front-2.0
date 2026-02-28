import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { createArtist, adjustArtist } from '../../data/apis/requests'
import styles from './AddArtistModal.module.css'
import { Artist } from '../../data/apis/types'
import { ArtistSchema } from '../../data/schemas/schemas'

interface AddArtistModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editData?: ArtistSchema | null
}

export const AddArtistModal = ({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: AddArtistModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Artist>()

  useEffect(() => {
    if (editData) {
      setValue('artistName', editData?.name)
      setValue('dateOfBirth', editData?.dateofbirth)
      setValue('placeOfBirth', editData?.placeofbirth)
      setValue('history', editData?.history)
    } else {
      reset()
    }
  }, [editData, setValue, reset])

  if (!isOpen) return null

  const onSubmit = async (data: Artist) => {
    setIsLoading(true)
    try {
      if (editData) {
        await adjustArtist(editData.id, data)
      } else {
        await createArtist(data)
      }
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
        <h2>{editData ? 'Edit Artist' : 'Add New Artist'}</h2>
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
              ) : editData ? (
                'Atualizar Artista'
              ) : (
                '+ Artista'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
