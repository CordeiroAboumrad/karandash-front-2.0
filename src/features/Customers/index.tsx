import { useGetCustomersQuery } from "../../data/queries/karandashQueries";
import styles from "./Customers.module.css";

export const Customers = () => {
  const query = useGetCustomersQuery();

  return (
    <div className={styles.customers}>
      <h2>Customers</h2>

      {query.isFetching && <p>Loading...</p>}
      {query.isFetched && query.data?.length === 0 && <p>No customers found.</p>}
      {query.isFetched && query.data?.length && query.data.length > 0 && (
        <p>Found {query.data.length} customers.</p>
      )}
    </div>
  );
};
