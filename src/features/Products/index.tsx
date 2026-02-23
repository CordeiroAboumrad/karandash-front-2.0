import { PDFDownloadLink } from '@react-pdf/renderer'
import { useState } from 'react'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useGetAllProductsQuery } from '../../data/queries/karandashQueries'
import { ProductSchema } from '../../data/schemas/schemas'
import { Certificate } from '../../pdf/Certificate'
import { AddProductModal } from './AddProductModal'
import styles from './Products.module.css'

export const Products = () => {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const productsQuery = useGetAllProductsQuery(page, size)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleSuccess = () => {
    productsQuery.refetch()
  }

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <h2>Produtos</h2>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Produto
        </button>
      </div>
      {productsQuery.isFetching && (
        <div className={styles.loader}>
          <Oval
            height={50}
            width={50}
            color="#cc0000"
            secondaryColor="#cc0000"
          />
        </div>
      )}
      {productsQuery.isFetched && productsQuery.data?.content?.length === 0 && (
        <p>No products found.</p>
      )}
      {productsQuery.isFetched &&
        productsQuery.data?.content &&
        productsQuery.data.content.length > 0 && (
          <>
            <div className={styles.productsGrid}>
              {productsQuery.data.content.map(
                (product: ProductSchema, index: number) => (
                  <div key={index} className={styles.productCard}>
                    <h3>{product.title}</h3>
                    <div className={styles.productInfo}>
                      <p>
                        <strong>Description:</strong> {product.description}
                      </p>
                      <p>
                        <strong>Company:</strong> {product.company}
                      </p>
                      <p>
                        <strong>Type:</strong> {product.type}
                      </p>
                      <p>
                        <strong>Status:</strong> {product.status}
                      </p>
                      <p>
                        <strong>Technique:</strong> {product.artTechnique}
                      </p>
                      <p>
                        <strong>Year:</strong> {product.productYear}
                      </p>
                      <p>
                        <strong>Value:</strong> ${product.value}
                      </p>
                      <p>
                        <strong>Sold:</strong>{' '}
                        {product.status == 'sold' ? 'Yes' : 'No'}
                      </p>
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className={styles.detailsButton}
                        >
                          View Details
                        </button>
                        <PDFDownloadLink
                          document={
                            <Certificate
                              artworkImage=""
                              title={product.title}
                              dimensions={product.measurements || 'N/A'}
                              year={parseInt(product.productYear) || 0}
                              technique={product.artTechnique}
                              artist={
                                product?.artists?.name || 'Unknown Artist'
                              }
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
                    </div>
                  </div>
                )
              )}
            </div>

            <div className={styles.pagination}>
              <div className={styles.paginationControls}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={styles.pageButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page + 1} of {productsQuery.data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= productsQuery.data.totalPages - 1}
                  className={styles.pageButton}
                >
                  Next
                </button>
              </div>
              <div className={styles.sizeSelector}>
                <label>Items per page:</label>
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value))
                    setPage(0)
                  }}
                  className={styles.sizeSelect}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </>
        )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
