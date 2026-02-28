import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import karandashLogo from '../assets/karandash.png'

import { styles } from './styles'

type CertificateProps = {
  artworkImage: string
  imageWidth?: number
  imageHeight?: number
  title: string
  dimensions: string
  year: number
  technique: string
  artist: string
}

export function Certificate({
  artworkImage,
  imageWidth = 180,
  imageHeight = 180,
  title,
  dimensions,
  year,
  technique,
  artist,
}: CertificateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={karandashLogo} style={styles.logo} />
          <Text style={styles.company}>Karandash Arte Contemporânea LTDA</Text>
          <Text style={styles.subtext}>CNPJ: 09.342.353/0001-44</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>CERTIFICADO DE AUTENTICIDADE</Text>

        {/* BODY TEXT */}
        <Text style={styles.paragraph}>
          Certificamos que a obra “{title}”, medindo {dimensions}, ano de
          criação {year}, técnica {technique}, adquirida na Karandash Arte
          Contemporânea LTDA, CNPJ: 09.342.353/0001-44, é uma peça única e
          autêntica de autoria do artista {artist}.
        </Text>

        {/* ARTWORK IMAGE */}
        {artworkImage && (
          <View style={styles.artworkContainer}>
            <Image src={artworkImage} style={{ width: imageWidth, height: imageHeight, objectFit: 'contain' }} />
          </View>
        )}

        {/* SIGNATURES */}
        <View style={styles.signatures}>
          <Text style={styles.signature}>
            Dalton Costa Neves – Sócio Gerente{'\n'}
            CPF: 081.511.991-72
          </Text>

          <Text style={styles.signature}>
            Maria Amelia Vieira Soares Costa Neves – Sócia Gerente{'\n'}
            CPF: 227.812.854-04
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Ladeira dos Martírios, 89, Centro – CEP: 57020-095, Maceió – Alagoas
          </Text>
          <Text>Fone: (82) 3317-6693 – (82) 982031709</Text>
          <Text>E-mail: mameliavs@hotmail.com / contato@karandash.com.br</Text>
        </View>
      </Page>
    </Document>
  )
}
