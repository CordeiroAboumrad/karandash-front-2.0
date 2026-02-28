import { PDFDownloadLink } from '@react-pdf/renderer'
import { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { searchProducts } from '../../data/apis/requests'
import { ProductSchema } from '../../data/schemas/schemas'
import { Certificate } from '../../pdf/Certificate'
import { AddProductModal } from './AddProductModal'
import styles from './Products.module.css'

export const Products = () => {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [artist, setArtist] = useState('')
  const [name, setName] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [products, setProducts] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await searchProducts(
        artist || undefined,
        name || undefined,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
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
    setPage(0)
  }

  useEffect(() => {
    if (!artist && !name && !minPrice && !maxPrice) {
      fetchProducts()
    }
  }, [artist, name, minPrice, maxPrice])

  const handleSuccess = () => {
    fetchProducts()
  }

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <h2>Produtos</h2>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        <button onClick={handleClearSearch} className={styles.clearButton}>
          Clear
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
                          artist={product?.artists?.name || 'Unknown Artist'}
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
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
