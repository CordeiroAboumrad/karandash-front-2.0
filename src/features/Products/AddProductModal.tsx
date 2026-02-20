import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { createProduct } from '../../data/apis/requests'
import styles from './AddProductModal.module.css'
import { Product } from '../../data/apis/types'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Product>()

  if (!isOpen) return null

  const onSubmit = async (data: Product) => {
    setIsLoading(true)
    try {
      await createProduct(data)
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
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Company</label>
            <input id="company" type="text" {...register('company')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Type</label>
            <input id="type" type="text" {...register('type')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <input id="status" type="text" {...register('status')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="arttechnique">Art Technique</label>
            <input
              id="arttechnique"
              type="text"
              {...register('artTechnique')}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="productyear">Year</label>
            <input id="productyear" type="text" {...register('productYear')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="value">Value</label>
            <input
              id="value"
              type="number"
              step="0.01"
              {...register('value', { valueAsNumber: true })}
            />
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
                '+ Produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
