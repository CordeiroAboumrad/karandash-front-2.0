import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useGetAllProductsQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import { AddProductModal } from './AddProductModal'
import { Certificate } from '../../pdf/Certificate'
import styles from './Products.module.css'

export const Products = () => {
  const productsQuery = useGetAllProductsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      {productsQuery.isFetched && productsQuery.data?.length === 0 && (
        <p>No products found.</p>
      )}
      {productsQuery.isFetched &&
        productsQuery.data &&
        productsQuery.data.length > 0 && (
          <div className={styles.productsGrid}>
            {productsQuery.data.map((product, index) => (
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
                    <strong>Technique:</strong> {product.arttechnique}
                  </p>
                  <p>
                    <strong>Year:</strong> {product.productyear}
                  </p>
                  <p>
                    <strong>Value:</strong> ${product.value}
                  </p>
                  <p>
                    <strong>Sold:</strong> {product.sold ? 'Yes' : 'No'}
                  </p>
                  <PDFDownloadLink
                    document={
                      <Certificate
                        artworkImage=""
                        title={product.title}
                        dimensions={product.measurements || 'N/A'}
                        year={parseInt(product.productyear) || 0}
                        technique={product.arttechnique}
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
              </div>
            ))}
          </div>
        )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
