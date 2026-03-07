import { StyleSheet } from '@react-pdf/renderer'

export const reportStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  galleryInfo: {
    width: '72%',
    lineHeight: 1,
  },
  logo: {
    width: 90,
    objectFit: 'contain',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    border: '1 solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    backgroundColor: '#f3f3f3',
  },
  thNumber: {
    width: '10%',
    padding: 6,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  thArtwork: {
    width: '70%',
    padding: 6,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  thValue: {
    width: '20%',
    padding: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    minHeight: 120,
    alignItems: 'stretch',
  },
  cellNumber: {
    width: '10%',
    borderRight: '1 solid #000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellArtwork: {
    width: '70%',
    borderRight: '1 solid #000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  artworkImageBox: {
    minWidth: 100,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallback: {
    fontSize: 8,
    color: '#666',
  },
  cellValue: {
    width: '20%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    minHeight: 30,
    alignItems: 'center',
  },
  totalLabel: {
    width: '80%',
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'bold',
    borderRight: '1 solid #000',
  },
  totalValue: {
    width: '20%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
