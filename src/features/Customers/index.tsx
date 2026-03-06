import { useState } from 'react'
import { useGetCustomersQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import { AddCustomerModal } from './AddCustomerModal'
import { CustomerSchema } from '../../data/schemas/schemas'
import { deleteCustomer } from '../../data/apis/requests'
import styles from './Customers.module.css'

export const Customers = () => {
  const customersQuery = useGetCustomersQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<CustomerSchema | undefined>(
    undefined
  )
  const [addressModal, setAddressModal] = useState<string | null>(null)
  const [isDeletingCustomerId, setIsDeletingCustomerId] = useState<
    number | null
  >(null)

  const handleSuccess = () => {
    customersQuery.refetch()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditCustomer(undefined)
  }

  const handleDeleteCustomer = async (customer: CustomerSchema) => {
    const shouldDelete = window.confirm(
      `Excluir cliente "${customer.name}"? Esta ação não pode ser desfeita.`
    )

    if (!shouldDelete) {
      return
    }

    setIsDeletingCustomerId(customer.id)
    try {
      await deleteCustomer(customer.id)
      await customersQuery.refetch()
    } catch (error) {
      console.error(error)
      alert('Houve um problema ao excluir o cliente.')
    } finally {
      setIsDeletingCustomerId(null)
    }
  }

  return (
    <div className={styles.customers}>
      <div className={styles.header}>
        <h2>Clientes</h2>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Cliente
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
        <p>Nenhum cliente encontrado.</p>
      )}
      {customersQuery.isFetched &&
        customersQuery.data &&
        customersQuery.data.length > 0 && (
          <div className={styles.customersGrid}>
            {customersQuery.data.map((customer, index) => (
              <div key={index} className={styles.customerCard}>
                <div className={styles.cardContent}>
                  <h3>{customer.name}</h3>
                  <div className={styles.customerInfo}>
                    <p>
                      <strong>Email:</strong> {customer.email}
                    </p>
                    <div className={styles.addressContainer}>
                      <div className={styles.addressHeader}>
                        <button
                          onClick={() => setAddressModal(customer.address || '')}
                          className={styles.magnifierButton}
                          title="Ver endereço completo"
                        >
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <strong>Endereço:</strong>
                      </div>
                    </div>
                    <p className={styles.addressText}>{customer.address}</p>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => {
                      setEditCustomer(customer)
                      setIsModalOpen(true)
                    }}
                    className={styles.editButton}
                  >
                    <i className="fa-solid fa-pen"></i> Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer)}
                    className={styles.deleteButton}
                    disabled={isDeletingCustomerId === customer.id}
                  >
                    <i className="fa-solid fa-trash"></i> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editData={editCustomer}
      />

      {addressModal && (
        <div className={styles.modal} onClick={() => setAddressModal(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Endereço Completo</h3>
              <button
                onClick={() => setAddressModal(null)}
                className={styles.closeButton}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{addressModal}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
