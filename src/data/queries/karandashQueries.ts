import { useQuery } from '@tanstack/react-query'
import {
  getAllArtists,
  getAllCustomers,
  getProductById,
  getProductImages,
} from '../apis/requests'

export const useGetArtistsQuery = () => {
  return useQuery({
    queryKey: ['artists'],
    queryFn: () => getAllArtists(),
    refetchOnWindowFocus: false,
  })
}

export const useGetCustomersQuery = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => getAllCustomers(),
    refetchOnWindowFocus: false,
  })
}

export const useGetProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  })
}

export const useGetProductImagesQuery = (productId: string) => {
  return useQuery({
    queryKey: ['productImages', productId],
    queryFn: () => getProductImages(productId),
    enabled: Boolean(productId),
    refetchOnWindowFocus: false,
  })
}
