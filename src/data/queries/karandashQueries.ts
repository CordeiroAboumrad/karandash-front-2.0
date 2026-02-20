import { useQuery } from '@tanstack/react-query'
import {
  getAllCustomers,
  getAllArtists,
  getAllProducts,
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

export const useGetAllProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts(),
    refetchOnWindowFocus: false,
  })
}
