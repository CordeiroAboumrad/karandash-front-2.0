import { Document, Image, Page, Text, View } from '@react-pdf/renderer'
import karandashLogo from '../assets/karandash.png'
import { formatCurrency } from '../utils/formatCurrency'
import { reportStyles as styles } from './Report.styles'

export type ReportProduct = {
  id: string | number
  title?: string
  image: string
  value: number | string
  imageWidth?: number
  imageHeight?: number
}

type ProductsReportProps = {
  products: ReportProduct[]
}

const parseCurrencyToNumber = (value: number | string): number => {
  if (typeof value === 'number') {
    return value
  }

  const onlyDigits = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const parsed = Number(onlyDigits)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeImageUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) {
    return ''
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://')
  }

  return trimmed
}

export const ProductsReport = ({ products }: ProductsReportProps) => {
  const totalValue = products.reduce(
    (sum, product) => sum + parseCurrencyToNumber(product.value),
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.galleryInfo}>
            <Text>Galeria Karandash de Arte Popular e Contemporanea</Text>
            <Text>CNPJ: 09.342.353/0001-44</Text>
            <Text>Ladeira dos Martirios, 89, Centro</Text>
            <Text>CEP: 57020-095, Maceió - Alagoas</Text>
            <Text>Fone: (82) 98203-1709</Text>
            <Text>Email: mameliavs@hotmail.com</Text>
            <Text>Instagram: @galeriakarandash</Text>
          </View>
          <Image style={styles.logo} src={karandashLogo} />
        </View>

        <Text style={styles.title}>Identificação das Obras</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thNumber}>#</Text>
            <Text style={styles.thArtwork}>Obra</Text>
            <Text style={styles.thValue}>Valor</Text>
          </View>

          {products.map((product, index) => (
            <View key={String(product.id)} style={styles.row}>
              <View style={styles.cellNumber}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.cellArtwork}>
                <View
                  style={[
                    styles.artworkImageBox,
                    {
                      width: Math.max(100, Number(product.imageWidth ?? 100)),
                      height: Math.max(100, Number(product.imageHeight ?? 100)),
                    },
                  ]}
                >
                  {normalizeImageUrl(product.image) ? (
                    <Image
                      src={normalizeImageUrl(product.image)}
                      style={{
                        width: Math.max(100, Number(product.imageWidth ?? 100)),
                        height: Math.max(100, Number(product.imageHeight ?? 100)),
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <Text style={styles.imageFallback}>Sem imagem</Text>
                  )}
                </View>
              </View>
              <View style={styles.cellValue}>
                <Text>
                  {formatCurrency(Number(product.value))}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
