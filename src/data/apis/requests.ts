import { karandashClient } from '../config/axios'
import {
  ArtistsSchema,
  CustomersSchema,
  ProductsSchema,
} from '../schemas/schemas'
import { Artist, Customer, Product, User } from './types'

export const login = async (email: string, password: string) => {
  const res = await karandashClient.post('/auth/login', { email, password })
  return res.data
}

export const getAllArtists = async (): Promise<ArtistsSchema> => {
  const res = await karandashClient.get('/artists')
  return res.data
}

export const createArtist = async (artistData: Artist) => {
  const res = await karandashClient.post('/artists', artistData)
  return res.data
}

export const adjustArtist = async (artistData: Artist) => {
  const res = await karandashClient.put('/artists', artistData)
  return res.data
}

export const registerCustomer = async (customerData: Customer) => {
  const res = await karandashClient.post(
    '/customer/input-customer',
    customerData
  )
  return res.data
}

export const getCustomer = async (id: string) => {
  const res = await karandashClient.get(`/customers/${id}`)
  return res.data
}

export const getAllCustomers = async (): Promise<CustomersSchema> => {
  const res = await karandashClient.get('/customers')
  return res.data
}

export const createProduct = async (productData: Product) => {
  const res = await karandashClient.post('/product/create-product', productData)
  return res.data
}

export const getProductById = async (id: string) => {
  const res = await karandashClient.get(`/product/retrieve-product/${id}`)
  return res.data
}

export const getAllProducts = async (
  page: number = 1,
  size: number = 10
): Promise<ProductsSchema> => {
  const res = await karandashClient.get('/product/all-products', {
    params: { page, size },
  })
  return res.data
}

export const searchProducts = async (
  artist?: string,
  name?: string,
  minPrice?: number,
  maxPrice?: number,
  page: number = 0,
  size: number = 10
): Promise<ProductsSchema> => {
  const res = await karandashClient.get('/product/search', {
    params: { artist, name, minPrice, maxPrice, page, size },
  })
  return res.data
}

export const saveProductImage = async (productId: number, files: File[]) => {
  const formData = new FormData()
  formData.append('productId', productId.toString())
  files.forEach((file) => formData.append('files', file))
  const res = await karandashClient.post('/product/save-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const getProductImages = async (productId: number) => {
  const res = await karandashClient.get(`/product/images/${productId}`)
  return res.data
}

export const getImageAsBase64 = async (imageUrl: string) => {
  const res = await karandashClient.post('/product/image-proxy', { imageUrl })
  return res.data.base64
}

export const deleteProduct = async (id: number, displayPosition: number) => {
  const res = await karandashClient.delete('/product/delete-product', {
    data: {
      productId: id,
      displayPosition: displayPosition,
    },
  })
  return res.data
}

export const getRole = async (roleName: string) => {}

export const createUser = async (user: User) => {
  const res = await karandashClient.post('/user', user)
  return res.data
}

export const changeUser = async (user: User) => {
  const res = await karandashClient.patch('/user', user)
  return res.data
}

export const deleteUser = async (userId: string) => {
  const res = await karandashClient.delete('/user', {
    data: {
      userId: userId,
    },
  })
  return res.data
}

export const createAdmin = async (user: User) => {
  const res = await karandashClient.post('/user/create-admin', user)
  return res.data
}

export const getUserById = async (userId: string) => {
  const res = await karandashClient.get(`/user/${userId}`)
  return res.data
}

export const getUserByUsername = async (username: string) => {
  const res = await karandashClient.get(`/user/username/${username}`)
  return res.data
}
