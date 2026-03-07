import { useEffect, useMemo, useRef, useState } from 'react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { useNavigate } from 'react-router-dom'
import { getImageAsBase64 } from '../../data/apis/requests'
import { ProductsReport } from '../../pdf/Report'
import { RegularRoutes } from '../../router/routes'
import styles from './Reports.module.css'
import {
  clearRelatoriosList,
  moveRelatorioItem,
  removeFromRelatoriosList,
  useRelatoriosList,
} from './relatoriosListStore'

export const Reports = () => {
  const navigate = useNavigate()
  const relatoriosList = useRelatoriosList()
  const [pdfProductsBase, setPdfProductsBase] = useState<
    { id: string; title: string; image: string; value: number }[]
  >([])
  const [imageSizeByProduct, setImageSizeByProduct] = useState<
    Record<string, { width: number; height: number }>
  >({})
  const [isPreparingPdfImages, setIsPreparingPdfImages] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const imageBase64Cache = useRef<Record<string, string>>({})

  const pdfProducts = pdfProductsBase.map((product) => {
    const size = imageSizeByProduct[product.id] ?? { width: 100, height: 100 }
    return {
      ...product,
      imageWidth: Math.max(100, size.width),
      imageHeight: Math.max(100, size.height),
    }
  })

  const pdfRenderKey = useMemo(
    () =>
      pdfProducts
        .map(
          (item) =>
            `${item.id}:${item.imageWidth ?? 100}x${item.imageHeight ?? 100}:${item.image?.length ?? 0}`
        )
        .join('|'),
    [pdfProducts]
  )

  useEffect(() => {
    setImageSizeByProduct((current) => {
      const next: Record<string, { width: number; height: number }> = {}
      relatoriosList.forEach((item) => {
        const key = item.productId
        next[key] = current[key] ?? { width: 100, height: 100 }
      })
      return next
    })
  }, [relatoriosList])

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

  useEffect(() => {
    let isActive = true

    const buildPdfProducts = async () => {
      if (relatoriosList.length === 0) {
        if (isActive) {
          setPdfProductsBase([])
          setIsPreparingPdfImages(false)
        }
        return
      }

      setIsPreparingPdfImages(true)

      const resolved = await Promise.all(
        relatoriosList.map(async (item) => {
          const cached = imageBase64Cache.current[item.imageUrl]
          if (cached) {
            return {
              id: item.productId,
              title: item.title,
              image: cached,
              value: item.value,
            }
          }

          try {
            const base64 = await getImageAsBase64(item.imageUrl)
            if (base64) {
              imageBase64Cache.current[item.imageUrl] = base64
            }

            return {
              id: item.productId,
              title: item.title,
              image: base64 || item.imageUrl,
              value: item.value,
            }
          } catch {
            return {
              id: item.productId,
              title: item.title,
              image: item.imageUrl,
              value: item.value,
            }
          }
        })
      )

      if (!isActive) {
        return
      }

      setPdfProductsBase(resolved)
      setIsPreparingPdfImages(false)
    }

    buildPdfProducts()

    return () => {
      isActive = false
    }
  }, [relatoriosList])

  const handleRemove = (productId: string) => {
    removeFromRelatoriosList(productId)
  }

  const handleMoveUp = (productId: string) => {
    moveRelatorioItem(productId, 'up')
  }

  const handleMoveDown = (productId: string) => {
    moveRelatorioItem(productId, 'down')
  }

  const handleClear = () => {
    const shouldClear = window.confirm('Limpar todos os itens de Relatorios?')
    if (!shouldClear) {
      return
    }

    clearRelatoriosList()
  }

  const handleSizeChange = (
    productId: string,
    dimension: 'width' | 'height',
    value: number
  ) => {
    const parsedValue = Number.isFinite(value) ? Math.max(0, value) : 0

    setImageSizeByProduct((current) => ({
      ...current,
      [productId]: {
        width:
          dimension === 'width'
            ? parsedValue
            : current[productId]?.width ?? 0,
        height:
          dimension === 'height'
            ? parsedValue
            : current[productId]?.height ?? 0,
      },
    }))
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h2>Relatorios</h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => navigate(RegularRoutes.PRODUCTS)}
          >
            Adicionar itens
          </button>
          {relatoriosList.length > 0 && (
            <>
              {isPreparingPdfImages ? (
                <span className={styles.downloadButton}>Preparando imagens...</span>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.downloadButton}
                    onClick={() => setShowPreviewModal(true)}
                  >
                    Preview Relatorio
                  </button>
                </>
              )}
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
              >
                Limpar Lista
              </button>
            </>
          )}
        </div>
      </div>

      {relatoriosList.length === 0 && (
        <p className={styles.emptyState}>
          Nenhum produto foi adicionado ao relatorio ainda.
        </p>
      )}

      {relatoriosList.length > 0 && (
        <div className={styles.reportsList}>
          {relatoriosList.map((item, index) => (
            <article key={item.productId} className={styles.reportCard}>
              <img src={item.imageUrl} alt={item.title} className={styles.reportImage} />
              <div className={styles.reportContent}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className={styles.fieldRow}>
                  <strong>Empresa:</strong>
                  <span className={styles.fieldValue}>{item.company}</span>
                </div>
                <div className={styles.fieldRow}>
                  <strong>Tipo:</strong>
                  <span className={styles.fieldValue}>{item.type}</span>
                </div>
                <div className={styles.fieldRow}>
                  <strong>Status:</strong>
                  <span className={styles.fieldValue}>{item.status}</span>
                </div>
                <div className={styles.fieldRow}>
                  <strong>Tecnica:</strong>
                  <span className={styles.fieldValue}>{item.technique}</span>
                </div>
                <div className={styles.fieldRow}>
                  <strong>Ano:</strong>
                  <span className={styles.fieldValue}>{item.year}</span>
                </div>
                <div className={styles.fieldRow}>
                  <strong>Valor:</strong>
                  <span className={styles.fieldValue}>${item.value}</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.orderButton}
                  onClick={() => handleMoveUp(item.productId)}
                  disabled={index === 0}
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.orderButton}
                  onClick={() => handleMoveDown(item.productId)}
                  disabled={index === relatoriosList.length - 1}
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.productId)}
                >
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

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
              <h3>Preview do Relatório</h3>
              <div className={styles.previewActions}>
                <PDFDownloadLink
                  key={`preview-${pdfRenderKey}`}
                  document={<ProductsReport products={pdfProducts} />}
                  fileName="lista-obras.pdf"
                  className={styles.downloadButton}
                >
                  {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF')}
                </PDFDownloadLink>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setShowPreviewModal(false)}
                >
                  x
                </button>
              </div>
            </div>

            <div className={styles.sizeControlsList}>
              {pdfProducts.map((item) => (
                <div key={item.id} className={styles.sizeControlRow}>
                  <span className={styles.sizeControlTitle}>{item.title}</span>
                  <label>
                    Largura:
                    <input
                      type="number"
                      min={0}
                      value={imageSizeByProduct[item.id]?.width ?? 0}
                      onChange={(e) =>
                        handleSizeChange(item.id, 'width', Number(e.target.value))
                      }
                      className={styles.sizeInput}
                    />
                  </label>
                  <label>
                    Altura:
                    <input
                      type="number"
                      min={0}
                      value={imageSizeByProduct[item.id]?.height ?? 0}
                      onChange={(e) =>
                        handleSizeChange(item.id, 'height', Number(e.target.value))
                      }
                      className={styles.sizeInput}
                    />
                  </label>
                </div>
              ))}
            </div>

            <PDFViewer className={styles.pdfViewer} key={pdfRenderKey}>
              <ProductsReport products={pdfProducts} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  )
}
