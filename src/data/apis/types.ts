export interface Artist {
  artistName: string
  dateOfBirth: string
  placeOfBirth: string
  history: string
}

export interface Customer {
  customerName: string
  address: string
  email: string
}

export interface Product {
  description: string
  title: string
  company: string
  status: string
  type: string
  keywords: string
  artTechnique: string
  acquisitionCost: number
  value: number
  productYear: string
  measurements: string
  sold: boolean
  artistId?: number
}

export interface User {
  id: string
  firstName: string
  lastName: string
  primaryEmail: string
  username: string
  password?: string
  role?: string
  roles?: string[]
}
