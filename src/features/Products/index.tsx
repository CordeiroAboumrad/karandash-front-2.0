import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { deleteProduct, getProductImages, searchProducts } from '../../data/apis/requests'
import { ProductSchema } from '../../data/schemas/schemas'
import { addToRelatoriosList, useRelatoriosList } from '../Reports/relatoriosListStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { AddProductModal } from './AddProductModal'
import styles from './Products.module.css'

type ProductImage = {
  id: string | number
  mediaurl: string
  mediadisplayposition: number
}

export const Products = () => {
  const relatoriosList = useRelatoriosList()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [artist, setArtist] = useState('')
  const [name, setName] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [soldFilter, setSoldFilter] = useState<'all' | 'sold' | 'notSold'>(
    'all'
  )
  const [products, setProducts] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductSchema | undefined>(
    undefined
  )
  const [descriptionModal, setDescriptionModal] = useState<string | null>(null)
  const [relatorioProduct, setRelatorioProduct] = useState<ProductSchema | null>(
    null
  )
  const [relatorioImages, setRelatorioImages] = useState<ProductImage[]>([])
  const [selectedRelatorioImage, setSelectedRelatorioImage] = useState<string | null>(
    null
  )
  const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false)
  const [isLoadingRelatorioImages, setIsLoadingRelatorioImages] = useState(false)
  const navigate = useNavigate()

  const isProductInRelatorio = (productId: string) =>
    relatoriosList.some((item) => item.productId === productId)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await searchProducts(
        artist || undefined,
        name || undefined,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        soldFilter === 'all' ? undefined : soldFilter === 'sold',
        page,
        size
      )
      setProducts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, size])

  const handleSearch = () => {
    setPage(0)
    fetchProducts()
  }

  const handleClearSearch = () => {
    setArtist('')
    setName('')
    setMinPrice('')
    setMaxPrice('')
    setSoldFilter('all')
    setPage(0)
  }

  const handleSuccess = () => {
    fetchProducts()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditProduct(undefined)
  }

  const handleDeleteProduct = async (product: ProductSchema) => {
    const shouldDelete = window.confirm(
      `Delete product "${product.title}"? This action cannot be undone.`
    )

    if (!shouldDelete) {
      return
    }

    setIsLoading(true)
    try {
      await deleteProduct(product.id)
      await fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error('Could not delete product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenRelatorioModal = async (product: ProductSchema) => {
    setRelatorioProduct(product)
    setRelatorioImages([])
    setSelectedRelatorioImage(null)
    setIsRelatorioModalOpen(true)
    setIsLoadingRelatorioImages(true)

    try {
      const data = await getProductImages(product.id)
      setRelatorioImages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast.error('Nao foi possivel carregar as imagens do produto.')
    } finally {
      setIsLoadingRelatorioImages(false)
    }
  }

  const handleCloseRelatorioModal = () => {
    setIsRelatorioModalOpen(false)
    setRelatorioProduct(null)
    setRelatorioImages([])
    setSelectedRelatorioImage(null)
    setIsLoadingRelatorioImages(false)
  }

  const handleAddToRelatorio = () => {
    if (!relatorioProduct || !selectedRelatorioImage) {
      toast.error('Selecione uma unica imagem para adicionar ao relatorio.')
      return
    }

    addToRelatoriosList({
      productId: relatorioProduct.id,
      title: relatorioProduct.title,
      description: String(relatorioProduct.description ?? ''),
      company: relatorioProduct.company,
      type: relatorioProduct.type,
      status: relatorioProduct.status,
      technique: relatorioProduct.artTechnique,
      year: relatorioProduct.productYear,
      value: relatorioProduct.value,
      imageUrl: selectedRelatorioImage,
      addedAt: new Date().toISOString(),
    })

    toast.success('Produto adicionado ao relatorio com sucesso.')
    handleCloseRelatorioModal()
  }

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <h2>Produtos</h2>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="Preço Mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="Preço Máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={soldFilter}
          onChange={(e) =>
            setSoldFilter(e.target.value as 'all' | 'sold' | 'notSold')
          }
          className={styles.searchSelect}
        >
          <option value="all">Todos</option>
          <option value="sold">Vendidos</option>
          <option value="notSold">Nao Vendidos</option>
        </select>
        <button onClick={handleSearch} className={styles.searchButton}>
          Procurar
        </button>
        <button onClick={handleClearSearch} className={styles.clearButton}>
          Limpar
        </button>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Produto
        </button>
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
      {!isLoading && products?.content?.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}
      {!isLoading && products?.content && products.content.length > 0 && (
        <>
          <div className={styles.productsGrid}>
            {products.content.map((product: ProductSchema, index: number) => {
              const alreadyInRelatorio = isProductInRelatorio(product.id)

              return (
                <div key={index} className={styles.productCard}>
                  <div className={styles.cardContent}>
                    <h3>{product.title}</h3>
                    <div className={styles.productInfo}>
                      <div className={styles.descriptionContainer}>
                        <div className={styles.descriptionHeader}>
                          <button
                            onClick={() =>
                              setDescriptionModal(
                                product.description.toString() || ''
                              )
                            }
                            className={styles.magnifierButton}
                            title="Ver descricao completa"
                          >
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </button>
                          <strong>Descrição:</strong>
                        </div>
                      </div>
                      <p className={styles.descriptionText}>
                        {product.description}
                      </p>
                      <p>
                        <strong>Artista:</strong> {product.artists?.name || 'Desconhecido'}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {product.type}
                      </p>
                      <p>
                        <strong>Status:</strong> {product.status}
                      </p>
                      <p>
                        <strong>Técnica:</strong> {product.artTechnique}
                      </p>
                      <p>
                        <strong>Ano:</strong> {product.productYear}
                      </p>
                      <p>
                        <strong>Valor:</strong> {formatCurrency(Number(product.value))}
                      </p>
                      <p>
                        <strong>Vendido:</strong>{' '}
                        {product.status == 'sold' ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className={styles.detailsButton}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => {
                        setEditProduct(product)
                        setIsModalOpen(true)
                      }}
                      className={styles.editButton}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>
                    <button
                      onClick={() => handleOpenRelatorioModal(product)}
                      className={styles.reportButton}
                      disabled={alreadyInRelatorio}
                    >
                      {alreadyInRelatorio ? 'Já no Relatorio' : '+ Relatorio'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className={styles.deleteButton}
                    >
                      <i className="fa-solid fa-trash"></i> Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationControls}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={styles.pageButton}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>
                Página {page + 1} de {products.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= products.totalPages - 1}
                className={styles.pageButton}
              >
                Próxima
              </button>
            </div>
            <div className={styles.sizeSelector}>
              <label>Itens por página:</label>
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
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editData={editProduct}
      />

      {isRelatorioModalOpen && (
        <div className={styles.modal} onClick={handleCloseRelatorioModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Selecionar imagem para Relatorio</h3>
              <button
                onClick={handleCloseRelatorioModal}
                className={styles.closeButton}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              {isLoadingRelatorioImages && (
                <div className={styles.loader}>
                  <Oval
                    height={32}
                    width={32}
                    color="#cc0000"
                    secondaryColor="#cc0000"
                  />
                </div>
              )}

              {!isLoadingRelatorioImages && relatorioImages.length === 0 && (
                <p className={styles.emptyImageMessage}>
                  Este produto nao possui imagens associadas. Nao e possivel
                  adicionar ao relatorio.
                </p>
              )}

              {!isLoadingRelatorioImages && relatorioImages.length > 0 && (
                <div className={styles.imagePickerGrid}>
                  {relatorioImages.map((image) => (
                    <button
                      key={`${image.id}-${image.mediadisplayposition}`}
                      type="button"
                      className={`${styles.imagePickerCard} ${selectedRelatorioImage === image.mediaurl
                        ? styles.imagePickerCardSelected
                        : ''
                        }`}
                      onClick={() => setSelectedRelatorioImage(image.mediaurl)}
                    >
                      <img
                        src={image.mediaurl}
                        alt={`Imagem ${image.mediadisplayposition}`}
                        className={styles.imagePickerImage}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelModalButton}
                onClick={handleCloseRelatorioModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.confirmModalButton}
                onClick={handleAddToRelatorio}
                disabled={!selectedRelatorioImage}
              >
                Adicionar ao Relatorio
              </button>
            </div>
          </div>
        </div>
      )}

      {descriptionModal && (
        <div className={styles.modal} onClick={() => setDescriptionModal(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Descricao Completa</h3>
              <button
                onClick={() => setDescriptionModal(null)}
                className={styles.closeButton}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{descriptionModal}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
