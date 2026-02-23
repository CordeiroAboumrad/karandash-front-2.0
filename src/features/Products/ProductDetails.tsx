import { useParams, useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'
import {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
} from '../../data/queries/karandashQueries'
import { Certificate } from '../../pdf/Certificate'
import { Oval } from 'react-loader-spinner'
import styles from './ProductDetails.module.css'

export const ProductDetails = () => {
  const { id } = useParams()
  console.log(id)

  const navigate = useNavigate()
  const productQuery = useGetProductByIdQuery(id || '')

  const product = productQuery.data

  if (productQuery.isFetching) {
    return (
      <div className={styles.loader}>
        <Oval height={50} width={50} color="#cc0000" secondaryColor="#cc0000" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.productDetails}>
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Back
        </button>
      </div>
    )
  }

  return (
    <div className={styles.productDetails}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back
      </button>

      <div className={styles.detailsCard}>
        <h1>{product.title}</h1>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <strong>Description:</strong>
            <span>{product.description}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Company:</strong>
            <span>{product.company}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Type:</strong>
            <span>{product.type}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Status:</strong>
            <span>{product.status}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Keywords:</strong>
            <span>{product.keywords}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Artist:</strong>
            <span>{product.artists?.name || 'Unknown'}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Art Technique:</strong>
            <span>{product.arttechnique}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Acquisition Cost:</strong>
            <span>${product.acquisitioncost}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Value:</strong>
            <span>${product.value}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Year:</strong>
            <span>{product.productyear}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Measurements:</strong>
            <span>{product.measurements}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Sold:</strong>
            <span>{product.sold ? 'Yes' : 'No'}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Created At:</strong>
            <span>{new Date(product.createdat).toLocaleDateString()}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Updated At:</strong>
            <span>{new Date(product.updatedat).toLocaleDateString()}</span>
          </div>
        </div>

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
  )
}
