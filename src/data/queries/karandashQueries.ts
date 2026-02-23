import { useQuery } from '@tanstack/react-query'
import {
  getAllCustomers,
  getAllArtists,
  getAllProducts,
  getProductById,
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

export const useGetAllProductsQuery = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['products', page, size],
    queryFn: () => getAllProducts(page, size),
    refetchOnWindowFocus: false,
  })
}

export const useGetProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    refetchOnWindowFocus: false,
  })
}
