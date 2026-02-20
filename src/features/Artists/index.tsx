import { useState } from 'react'
import { useGetArtistsQuery } from '../../data/queries/karandashQueries'
import { Oval } from 'react-loader-spinner'
import { AddArtistModal } from './AddArtistModal'
import styles from './Artists.module.css'

export const Artists = () => {
  const artistsQuery = useGetArtistsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    artistsQuery.refetch()
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
                <h3>{artist.name}</h3>
                <div className={styles.artistInfo}>
                  <p>
                    <strong>Data de Nascimento:</strong> {artist.dateofbirth}
                  </p>
                  <p>
                    <strong>Local de Nascimento:</strong> {artist.placeofbirth}
                  </p>
                  <p>
                    <strong>História:</strong> {artist.history}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      <AddArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
