import { useQuery } from "@tanstack/react-query";
import { getAllCustomers, getAllArtists } from "../apis/requests";

export const useGetArtistsQuery = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: () => getAllArtists(),
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomersQuery = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => getAllCustomers(),
    refetchOnWindowFocus: false,
  });
};
