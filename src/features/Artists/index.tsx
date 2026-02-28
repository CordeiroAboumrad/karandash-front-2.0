import { useState } from 'react'
import { useGetArtistsQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import { AddArtistModal } from './AddArtistModal'
import { ArtistSchema } from '../../data/schemas/schemas'
import styles from './Artists.module.css'

export const Artists = () => {
  const artistsQuery = useGetArtistsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editArtist, setEditArtist] = useState<ArtistSchema | undefined>(
    undefined
  )
  const [historyModal, setHistoryModal] = useState<string | null>(null)

  const handleSuccess = () => {
    artistsQuery.refetch()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditArtist(undefined)
  }

  return (
    <div className={styles.artists}>
      <div className={styles.header}>
        <h2>Artistas</h2>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Artista
        </button>
      </div>

      {artistsQuery.isFetching && (
        <div className={styles.loader}>
          <Oval
            height={50}
            width={50}
            color="#cc0000"
            secondaryColor="#cc0000"
          />
        </div>
      )}
      {artistsQuery.isFetched && artistsQuery.data?.length === 0 && (
        <p>nenhum artista encontrado.</p>
      )}
      {artistsQuery.isFetched &&
        artistsQuery.data &&
        artistsQuery.data.length > 0 && (
          <div className={styles.artistsGrid}>
            {artistsQuery.data.map((artist, index) => (
              <div key={index} className={styles.artistCard}>
                <div className={styles.cardContent}>
                  <h3>{artist?.name}</h3>
                  <div className={styles.artistInfo}>
                    <p>
                      <strong>Data de Nascimento:</strong> {artist?.dateofbirth}
                    </p>
                    <p>
                      <strong>Local de Nascimento:</strong>{' '}
                      {artist?.placeofbirth}
                    </p>
                    <div className={styles.historyContainer}>
                      <div className={styles.historyHeader}>
                        <button
                          onClick={() => setHistoryModal(artist?.history || '')}
                          className={styles.magnifierButton}
                          title="Ver história completa"
                        >
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <strong>História:</strong>
                      </div>
                    </div>
                    <p className={styles.historyText}>{artist?.history}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditArtist(artist)
                    setIsModalOpen(true)
                  }}
                  className={styles.editButton}
                >
                  <i className="fa-solid fa-pen"></i> Editar
                </button>
              </div>
            ))}
          </div>
        )}

      <AddArtistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editData={editArtist}
      />

      {historyModal && (
        <div className={styles.modal} onClick={() => setHistoryModal(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>História Completa</h3>
              <button
                onClick={() => setHistoryModal(null)}
                className={styles.closeButton}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{historyModal}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
