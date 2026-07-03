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
    width: '8%',
    padding: 6,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  thArtwork: {
    width: '52%',
    padding: 6,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  thMeasurements: {
    width: '22%',
    padding: 6,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  thValue: {
    width: '18%',
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
    width: '8%',
    borderRight: '1 solid #000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellArtwork: {
    width: '52%',
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
    width: '18%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellMeasurements: {
    width: '22%',
    borderRight: '1 solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    minHeight: 30,
    alignItems: 'center',
  },
  totalLabel: {
    width: '82%',
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'bold',
    borderRight: '1 solid #000',
  },
  totalValue: {
    width: '18%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
