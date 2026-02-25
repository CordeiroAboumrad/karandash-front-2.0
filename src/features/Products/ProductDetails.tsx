import { PDFDownloadLink } from '@react-pdf/renderer'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Oval } from 'react-loader-spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProductByIdQuery } from '../../data/queries/karandashQueries'
import { saveProductImage } from '../../data/apis/requests'
import { Certificate } from '../../pdf/Certificate'
import styles from './ProductDetails.module.css'

export const ProductDetails = () => {
  const { id } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  console.log(id)

  const navigate = useNavigate()
  const productQuery = useGetProductByIdQuery(id || '')

  const product = productQuery.data

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed at a time')
      e.target.value = ''
      return
    }
    setSelectedFiles(files)
    setShowModal(true)
    e.target.value = ''
  }

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0 || !product) return

    setShowModal(false)
    setIsUploading(true)
    try {
      await saveProductImage(product.id, selectedFiles)
      toast.success(`${selectedFiles.length} image(s) uploaded successfully`, { icon: '✓' })
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      setSelectedFiles([])
    }
  }

  const handleCancelUpload = () => {
    setShowModal(false)
    setSelectedFiles([])
  }

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
      <div className={styles.buttonRow}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
        {isUploading ? (
          <div className={styles.uploadingLoader}>
            <Oval height={30} width={30} color="#cc0000" secondaryColor="#cc0000" />
          </div>
        ) : (
          <button onClick={handleUploadClick} className={styles.uploadButton}>
            Upload Image
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Upload</h3>
            <p>Are you sure you want to upload {selectedFiles.length} file(s)?</p>
            <div className={styles.fileList}>
              {selectedFiles.map((file, i) => (
                <p key={i} className={styles.fileName}>{file.name}</p>
              ))}
            </div>
            <div className={styles.modalButtons}>
              <button onClick={handleCancelUpload} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleConfirmUpload} className={styles.confirmButton}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
