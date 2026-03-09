import { PDFViewer, pdf } from '@react-pdf/renderer'
import { useEffect, useRef, useState } from 'react'
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
import { formatCurrency } from '../../utils/formatCurrency'

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
  const isAndroidDevice =
    typeof window !== 'undefined' && /Android/i.test(window.navigator.userAgent)

  const navigate = useNavigate()
  const productQuery = useGetProductByIdQuery(id || '')
  const product = productQuery.data

  const imagesQuery = useGetProductImagesQuery(product?.id || '')

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (files.length > 5) {
      toast.error('Máximo de 5 itens permitidos ao mesmo tempo')
      e.target.value = ''
      return
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 50 * 1024 * 1024
    if (totalSize > maxSize) {
      toast.error('Tamanho total de arquivos supera o limite de 50MB')
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
      toast.success(`${selectedFiles.length} ${selectedFiles.length === 1 ? 'imagem carregada' : 'imagens carregadas'} com sucesso`, {
        icon: '✓',
      })
    } catch (error) {
      toast.error('Falha ao realizar upload das imagens')
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
      toast.error('Falha ao carregar a imagem')
      setSelectedImageUrl('')
    }
  }

  const handlePreviewClick = () => {
    if (!imageBase64) {
      toast.error('Selecione uma imagem para visualizar o certificado')
      return
    }
    if (isAndroidDevice) {
      toast('No Android, use o botao "Baixar Certificado".')
      return
    }
    setShowPreviewModal(true)
  }

  const handleDownloadCertificate = async () => {
    if (!imageBase64 || !certificateDocument || !product) {
      toast.error('Selecione uma imagem para baixar o certificado')
      return
    }

    try {
      const blob = await pdf(certificateDocument).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeTitle = product.title.replace(/[\\/:*?"<>|]/g, '-')

      link.href = url
      link.download = `certificado-${safeTitle}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Nao foi possivel gerar o certificado')
    }
  }

  const certificateDocument = product ? (
    <Certificate
      artworkImage={imageBase64}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      title={product.title}
      dimensions={product.measurements || 'Não informado'}
      year={parseInt(product.productyear) || 0}
      technique={product.arttechnique}
      artist={product.artists?.name}
      artistGender={product.artists?.gender}
    />
  ) : null

  useEffect(() => {
    if (!showPreviewModal) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPreviewModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreviewModal])

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
        <h2>Produto não encontrado</h2>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className={styles.productDetails}>
      <div className={styles.buttonRow}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Voltar
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
            Enviar Imagem
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
            <h3>Confirmar Envio</h3>
            <p>
              Tem certeza de que gostaria de realizar o upload de {selectedFiles.length} {selectedFiles.length === 1 ? 'arquivo' : 'arquivos'}?
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
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                className={styles.confirmButton}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.detailsCard}>
        <h1>{product.title}</h1>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <strong>Descrição:</strong>
            <span>{product.description}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Empresa:</strong>
            <span>{product.company}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Tipo:</strong>
            <span>{product.type}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Status:</strong>
            <span>{product.status}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Palavras-chave:</strong>
            <span>{product.keywords}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Artista:</strong>
            <span>{product.artists?.name || 'Desconhecido'}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Técnica Artística:</strong>
            <span>{product.arttechnique}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Custo de Aquisição:</strong>
            <span>${product.acquisitioncost}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Valor:</strong>
            <span>{!product.value ? 'Não informado' : `$${formatCurrency(Number(product.value))}`}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Ano:</strong>
            <span>{product.productyear}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Medidas:</strong>
            <span>{product.measurements}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Vendido?</strong>
            <span>{product.sold ? 'Sim' : 'Não'}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Criado em:</strong>
            <span>{new Date(product.createdat).toLocaleDateString()}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Atualizado em:</strong>
            <span>{product.updatedat ? new Date(product.updatedat).toLocaleDateString() : 'Não informado'}</span>
          </div>
        </div>

        <div className={styles.certificateButtons}>
          {!isAndroidDevice && <button
            onClick={handlePreviewClick}
            className={`${styles.previewButton} ${!imageBase64 ? styles.disabled : ''}`}
            title={
              !imageBase64
                ? 'Selecione uma imagem primeiro para visualizar o certificado.'
                : isAndroidDevice
                  ? 'No Android, baixe o certificado.'
                  : undefined
            }
            disabled={!imageBase64}
          >
            Pré-visualização do Certificado
          </button>}
          {isAndroidDevice && (
            <button
              type="button"
              className={`${styles.pdfButton} ${!imageBase64 ? styles.disabled : ''}`}
              onClick={handleDownloadCertificate}
              disabled={!imageBase64}
            >
              Baixar Certificado
            </button>
          )}
        </div>

        {imagesQuery.data && imagesQuery.data.length > 0 && (
          <div className={styles.imagesSection}>
            <h2>Imagens do Produto</h2>
            <p className={styles.imageInstruction}>
              Selecione uma imagem para o certificado
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
                    alt={`Produto ${img.mediadisplayposition}`}
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
                  Largura:
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Number(e.target.value))}
                    className={styles.sizeInput}
                  />
                </label>
                <label>
                  Altura:
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
            {certificateDocument && (
              <PDFViewer
                className={styles.pdfViewer}
                key={`${imageBase64}-${imageWidth}-${imageHeight}`}
              >
                {certificateDocument}
              </PDFViewer>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
