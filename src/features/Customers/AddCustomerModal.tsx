import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { registerCustomer } from '../../data/apis/requests'
import styles from './AddCustomerModal.module.css'
import { Customer } from '../../data/apis/types'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddCustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddCustomerModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Customer>()

  if (!isOpen) return null

  const onSubmit = async (data: Customer) => {
    setIsLoading(true)
    try {
      await registerCustomer(data)
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
        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              {...register('customerName', { required: 'Name is required' })}
            />
            {errors.customerName && (
              <span className={styles.error}>
                {errors.customerName.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <textarea id="address" rows={3} {...register('address')} />
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
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
