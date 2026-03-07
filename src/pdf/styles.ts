import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 11,
    lineHeight: 1.5,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 120,
    marginBottom: 10,
  },

  company: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  subtext: {
    fontSize: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#9C7A2F',
  },

  paragraph: {
    textAlign: 'justify',
  },

  artworkContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },

  artwork: {
    width: 180,
    height: 180,
    objectFit: 'contain',
  },

  signatures: {
    alignItems: 'center',
    gap: 5,
  },

  signature1: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 10,
  },

  signature2: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 50,
  },

  signatureCpf: {
    textAlign: 'center',
    fontSize: 8,
    marginTop: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 9,
    textAlign: 'center',
  },
  totalRow: {
  flexDirection: "row",
  minHeight: 40
},

totalLabel: {
  width: "80%",
  textAlign: "right",
  paddingRight: 10,
  fontWeight: "bold",
  borderRight: "1 solid #000"
},

totalValue: {
  width: "20%",
  textAlign: "center",
  fontWeight: "bold"
}

});