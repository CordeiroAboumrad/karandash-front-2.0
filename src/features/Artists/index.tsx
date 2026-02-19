import { useGetArtistsQuery } from '../../data/queries/karandashQueries'
import styles from './Artists.module.css'

export const Artists = () => {
  const artistsQuery = useGetArtistsQuery()

  return (
    <div className={styles.artists}>
      <h2>Artists</h2>

      {artistsQuery.isFetching && <p>Loading...</p>}
      {artistsQuery.isFetched && artistsQuery.data?.length === 0 && (
        <p>No artists found.</p>
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
                    <strong>Date of Birth:</strong> {artist.dateofbirth}
                  </p>
                  <p>
                    <strong>Place of Birth:</strong> {artist.placeofbirth}
                  </p>
                  <p>
                    <strong>History:</strong> {artist.history}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
