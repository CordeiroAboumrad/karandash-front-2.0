import { useGetCustomersQuery } from '../../data/queries/karandashQueries'
import styles from './Customers.module.css'

export const Customers = () => {
  const customersQuery = useGetCustomersQuery()

  return (
    <div className={styles.customers}>
      <h2>Customers</h2>

      {customersQuery.isFetching && <p>Loading...</p>}
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
    </div>
  )
}
