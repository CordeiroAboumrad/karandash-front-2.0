import { useGetArtistsQuery } from '../../data/queries/karandashQueries'
import styles from './Artists.module.css'

export const Artists = () => {
  const query = useGetArtistsQuery()

  return (
    <div className={styles.artists}>
      <h2>Artists</h2>

      {query.isFetching && <p>Loading...</p>}
      {query.isFetched && query.data?.length === 0 && <p>No artists found.</p>}
      {query.isFetched && query.data && query.data.length > 0 && (
        <p>{`Found ${query.data.length} artists.`}</p>
      )}
    </div>
  )
}
