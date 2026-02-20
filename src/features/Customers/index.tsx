import { useState } from 'react'
import { useGetCustomersQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import { AddCustomerModal } from './AddCustomerModal'
import styles from './Customers.module.css'

export const Customers = () => {
  const customersQuery = useGetCustomersQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    customersQuery.refetch()
  }

  return (
    <div className={styles.customers}>
      <div className={styles.header}>
        <h2>Customers</h2>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add Customer
        </button>
      </div>
      {customersQuery.isFetching && (
        <div className={styles.loader}>
          <Oval
            height={50}
            width={50}
            color="#cc0000"
            secondaryColor="#cc0000"
          />
        </div>
      )}
      {customersQuery.isFetched && customersQuery.data?.length === 0 && (
        <p>No customers found.</p>
      )}
      {customersQuery.isFetched &&
        customersQuery.data &&
        customersQuery.data.length > 0 && (
          <div className={styles.customersGrid}>
            {customersQuery.data.map((customer, index) => (
              <div key={index} className={styles.customerCard}>
                <h3>{customer.name}</h3>
                <div className={styles.customerInfo}>
                  <p>
                    <strong>Email:</strong> {customer.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {customer.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
