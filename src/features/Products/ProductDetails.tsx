import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Oval } from 'react-loader-spinner'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetProductByIdQuery,
  useGetProductImagesQuery,
} from '../../data/queries/karandashQueries'
import { saveProductImage, getImageAsBase64 } from '../../data/apis/requests'
import { Certificate } from '../../pdf/Certificate'
import styles from './ProductDetails.module.css'

export const ProductDetails = () => {
  const { id } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('')
  const [imageBase64, setImageBase64] = useState<string>('')
  const [imageWidth, setImageWidth] = useState(180)
  const [imageHeight, setImageHeight] = useState(180)

  const navigate = useNavigate()
  const productQuery = useGetProductByIdQuery(id || '')
  const product = productQuery.data

  const imagesQuery = useGetProductImagesQuery(product?.id || 0)

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
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 50 * 1024 * 1024
    if (totalSize > maxSize) {
      toast.error('Total file size exceeds 50MB limit')
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
      await imagesQuery.refetch()
      toast.success(`${selectedFiles.length} image(s) uploaded successfully`, {
        icon: '✓',
      })
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

  const handleRotate = () => {
    if (!imageBase64) return

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.height
      canvas.height = img.width

      const ctx = canvas.getContext('2d')!
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((90 * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      setImageBase64(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = imageBase64
  }

  const handleImageSelect = async (imageUrl: string) => {
    if (imageUrl === selectedImageUrl) {
      setSelectedImageUrl('')
      setImageBase64('')
      return
    }
    setSelectedImageUrl(imageUrl)
    try {
      const base64 = await getImageAsBase64(imageUrl)
      setImageBase64(base64)
    } catch (error) {
      toast.error('Failed to load image')
      setSelectedImageUrl('')
    }
  }

  const handlePreviewClick = () => {
    if (!imageBase64) {
      toast.error('Please select one image for the certificate')
      return
    }
    setShowPreviewModal(true)
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
            <Oval
              height={30}
              width={30}
              color="#cc0000"
              secondaryColor="#cc0000"
            />
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
            <p>
              Are you sure you want to upload {selectedFiles.length} file(s)?
            </p>
            <div className={styles.fileList}>
              {selectedFiles.map((file, i) => (
                <p key={i} className={styles.fileName}>
                  {file.name}
                </p>
              ))}
            </div>
            <div className={styles.modalButtons}>
              <button
                onClick={handleCancelUpload}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className={styles.confirmButton}
              >
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

        <div className={styles.certificateButtons}>
          <button
            onClick={handlePreviewClick}
            className={`${styles.previewButton} ${!imageBase64 ? styles.disabled : ''}`}
          >
            Preview Certificate
          </button>
          <PDFDownloadLink
            key={`${imageBase64}-${imageWidth}-${imageHeight}`}
            document={
              <Certificate
                artworkImage={imageBase64}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                title={product.title}
                dimensions={product.measurements || 'N/A'}
                year={parseInt(product.productyear) || 0}
                technique={product.arttechnique}
                artist={product.artists?.name || 'Unknown Artist'}
              />
            }
            fileName={`certificate-${product.title}.pdf`}
            className={`${styles.pdfButton} ${!imageBase64 ? styles.disabled : ''}`}
            onClick={(e) => {
              if (!imageBase64) {
                e.preventDefault()
                toast.error('Please select one image for the certificate')
              }
            }}
          >
            {({ loading }) =>
              loading ? 'Generating...' : 'Download Certificate'
            }
          </PDFDownloadLink>
        </div>

        {imagesQuery.data && imagesQuery.data.length > 0 && (
          <div className={styles.imagesSection}>
            <h2>Product Images</h2>
            <p className={styles.imageInstruction}>
              Click on an image to select it for the certificate
            </p>
            <div className={styles.imagesGrid}>
              {imagesQuery.data.map((img: any) => (
                <div
                  key={img.id}
                  className={`${styles.imageCard} ${selectedImageUrl === img.mediaurl ? styles.selected : ''}`}
                  onClick={() => handleImageSelect(img.mediaurl)}
                >
                  <img
                    src={img.mediaurl}
                    alt={`Product ${img.mediadisplayposition}`}
                  />
                  {selectedImageUrl === img.mediaurl && (
                    <div className={styles.selectedBadge}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPreviewModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className={styles.previewModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.previewHeader}>
              <button
                onClick={handleRotate}
                className={styles.rotateButtonModal}
              >
                <i className="fas fa-redo" style={{ fontSize: '0.8rem' }}></i>
                Rotacionar Imagem
              </button>
              <div className={styles.sizeControls}>
                <label>
                  Width:
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Number(e.target.value))}
                    className={styles.sizeInput}
                  />
                </label>
                <label>
                  Height:
                  <input
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(Number(e.target.value))}
                    className={styles.sizeInput}
                  />
                </label>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <PDFViewer
              className={styles.pdfViewer}
              key={`${imageBase64}-${imageWidth}-${imageHeight}`}
            >
              <Certificate
                artworkImage={imageBase64}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                title={product.title}
                dimensions={product.measurements || 'N/A'}
                year={parseInt(product.productyear) || 0}
                technique={product.arttechnique}
                artist={product.artists?.name || 'Unknown Artist'}
              />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  )
}
