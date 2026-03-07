import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { createProduct, updateProduct } from '../../data/apis/requests'
import { useGetArtistsQuery } from '../../data/queries/karandashQueries'
import styles from './AddProductModal.module.css'
import { Product } from '../../data/apis/types'
import { ProductSchema } from '../../data/schemas/schemas'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editData?: ProductSchema | undefined
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: AddProductModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  useLockBodyScroll(isOpen)
  const artistsQuery = useGetArtistsQuery()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Product>()

  useEffect(() => {
    if (editData) {
      setValue('title', editData.title)
      setValue('description', editData.description.toString())
      setValue('company', editData.company)
      setValue('type', editData.type)
      setValue('status', editData.status)
      setValue('artTechnique', editData.arttechnique)
      setValue('productYear', editData.productyear)
      setValue('value', editData.value)
      setValue('measurements', editData.measurements)
      setValue('sold', editData.sold)
      setValue('artistId', editData.artistid ?? undefined)
    } else {
      reset()
    }
  }, [editData, setValue, reset])

  if (!isOpen) return null

  const onSubmit = async (data: Product) => {
    setIsLoading(true)
    try {
      if (editData) {
        await updateProduct(editData.id, data)
      } else {
        await createProduct(data)
      }
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      // Error handled by apiErrorHandler
    } finally {
      setIsLoading(false)
    }
  }

  type ArtistOption = NonNullable<NonNullable<typeof artistsQuery.data>[number]>
  const artists: ArtistOption[] = (artistsQuery.data ?? []).filter(
    (artist): artist is ArtistOption => artist != null
  )

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{editData ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Empresa</label>
            <input id="company" type="text" {...register('company')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Tipo</label>
            <input id="type" type="text" {...register('type')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <input id="status" type="text" {...register('status')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="artistId">Artista</label>
            <select
              id="artistId"
              {...register('artistId', {
                setValueAs: (value) => (value === '' ? undefined : Number(value)),
              })}
            >
              <option value="">
                {artistsQuery.isFetching ? 'Carregando artistas...' : 'Selecione um artista'}
              </option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="arttechnique">Técnica de Arte</label>
            <input
              id="arttechnique"
              type="text"
              {...register('artTechnique')}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="measurements">Medidas</label>
            <input
              id="measurements"
              type="text"
              {...register('measurements')}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Vendido?</span>

              <label className={styles.switch}>
                <input type="checkbox" {...register('sold')} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="productyear">Ano</label>
            <input id="productyear" type="text" {...register('productYear')} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="value">Valor</label>
            <input
              id="value"
              type="number"
              step="0.01"
              {...register('value', { valueAsNumber: true })}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#fff"
                  secondaryColor="#fff"
                />
              ) : editData ? (
                'Atualizar Produto'
              ) : (
                '+ Produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
