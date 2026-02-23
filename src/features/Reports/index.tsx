import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import {
  useGetArtistsQuery,
  useGetCustomersQuery,
  useGetAllProductsQuery,
} from '../../data/queries/karandashQueries'
import { Certificate } from '../../pdf/Certificate'
import { Oval } from 'react-loader-spinner'
import styles from './Reports.module.css'
import { ProductSchema } from '../../data/schemas/schemas'

export const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<
    'artistas' | 'clientes' | 'produtos'
  >('produtos')

  const artistsQuery = useGetArtistsQuery()
  const customersQuery = useGetCustomersQuery()
  const productsQuery = useGetAllProductsQuery()

  const isLoading =
    artistsQuery.isFetching ||
    customersQuery.isFetching ||
    productsQuery.isFetching

  const filteredProducts =
    productsQuery.data?.content?.filter((product) =>
      product?.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const filteredArtists =
    artistsQuery.data?.filter((artist) =>
      artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const filteredCustomers =
    customersQuery.data?.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  return (
    <div className={styles.reports}>
      <h2>Reports</h2>

      <div className={styles.searchSection}>
        <div className={styles.searchControls}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className={styles.select}
          >
            <option value="products">Products</option>
            <option value="artists">Artists</option>
            <option value="customers">Customers</option>
          </select>

          <input
            type="text"
            placeholder={`Procurar ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
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

      {!isLoading && searchType === 'produtos' && (
        <div className={styles.resultsGrid}>
          {filteredProducts.map((product: ProductSchema, index: number) => (
            <div key={index} className={styles.resultCard}>
              <h3>{product.title}</h3>
              <p>
                <strong>Company:</strong> {product.company}
              </p>
              <p>
                <strong>Year:</strong> {product.productYear}
              </p>
              <p>
                <strong>Value:</strong> ${product.value}
              </p>
              <PDFDownloadLink
                document={
                  <Certificate
                    artworkImage=""
                    title={product.title}
                    dimensions={product.measurements || 'N/A'}
                    year={parseInt(product.productYear) || 0}
                    technique={product.artTechnique}
                    artist={product.artists?.name || 'Unknown Artist'}
                  />
                }
                fileName={`certificate-${product.title}.pdf`}
                className={styles.pdfButton}
              >
                {({ loading }) =>
                  loading ? 'Generating...' : 'Download Certificate'
                }
              </PDFDownloadLink>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchType === 'artistas' && (
        <div className={styles.resultsGrid}>
          {filteredArtists.map((artist, index) => (
            <div key={index} className={styles.resultCard}>
              <h3>{artist?.name}</h3>
              <p>
                <strong>Date of Birth:</strong> {artist?.dateofbirth}
              </p>
              <p>
                <strong>Place of Birth:</strong> {artist?.placeofbirth}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchType === 'clientes' && (
        <div className={styles.resultsGrid}>
          {filteredCustomers.map((customer, index) => (
            <div key={index} className={styles.resultCard}>
              <h3>{customer.name}</h3>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
