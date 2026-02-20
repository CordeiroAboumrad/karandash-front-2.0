import { useGetCustomersQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import styles from './Customers.module.css'

export const Customers = () => {
  const customersQuery = useGetCustomersQuery()

  return (
    <div className={styles.customers}>
      <h2>Customers</h2>

      {customersQuery.isFetching && (
        <Oval height={50} width={50} color="#cc0000" secondaryColor="#cc0000" />
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
    </div>
  )
}
