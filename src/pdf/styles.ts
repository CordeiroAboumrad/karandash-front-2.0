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
    marginBottom: 25,
  },

  artwork: {
    width: 180,
    alignSelf: 'center',
    marginVertical: 20,
  },

  signatures: {
    marginTop: 30,
    alignItems: 'center',
    gap: 20,
  },

  signature: {
    textAlign: 'center',
    fontSize: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    fontSize: 9,
    textAlign: 'center',
  },
});