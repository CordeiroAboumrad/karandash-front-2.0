import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { deleteProduct, searchProducts } from '../../data/apis/requests'
import { ProductSchema } from '../../data/schemas/schemas'
import { AddProductModal } from './AddProductModal'
import styles from './Products.module.css'

export const Products = () => {
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
  const navigate = useNavigate()

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
      alert('Could not delete product. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          <option value="notSold">Não Vendidos</option>
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
        <p>No products found.</p>
      )}
      {!isLoading && products?.content && products.content.length > 0 && (
        <>
          <div className={styles.productsGrid}>
            {products.content.map((product: ProductSchema, index: number) => (
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
                          title="Ver descrição completa"
                        >
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <strong>Description:</strong>
                      </div>
                    </div>
                    <p className={styles.descriptionText}>
                      {product.description}
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
                    onClick={() => handleDeleteProduct(product)}
                    className={styles.deleteButton}
                  >
                    <i className="fa-solid fa-trash"></i> Excluir
                  </button>
                </div>
              </div>
            ))}
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
                Page {page + 1} of {products.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= products.totalPages - 1}
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
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editData={editProduct}
      />

      {descriptionModal && (
        <div className={styles.modal} onClick={() => setDescriptionModal(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Descrição Completa</h3>
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
