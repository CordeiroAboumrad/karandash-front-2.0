import { karandashClient } from "../config/axios";
import { Artist, Customer, Product } from "./types";

export const getArtists = async () => {
  const res = await karandashClient.get("/artists");
  return res.data;
};

export const createArtist = async (artistData: Artist) => {
  const res = await karandashClient.post("/artists", artistData);
  return res.data;
};

export const adjustArtist = async (artistData: Artist) => {
  const res = await karandashClient.put("/artists", artistData);
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await karandashClient.post("/auth/login", { email, password });
  return res.data;
};

export const registerCustomer = async (customerData: Customer) => {
  const res = await karandashClient.post(
    "/customer/input-customer",
    customerData,
  );
  return res.data;
};

export const getCustomer = async (id: string) => {
  const res = await karandashClient.get(`/customers/${id}`);
  return res.data;
};

export const createProduct = async (productData: Product) => {
  const res = await karandashClient.post(
    "/product/create-product",
    productData,
  );
  return res.data;
};

export const getProductByIdBody = async (id: string) => {
  const res = await karandashClient.get("/product/retrieve-product", {
    data: {
      productId: id,
    },
  });
  return res.data;
};

export const getAllProducts = async () => {
  const res = await karandashClient.get("/product/all-products");
  return res.data;
};

export const saveProductImage = async (imageData: FormData) => {
  const res = await karandashClient.post(`/product/save-image`, {
    file: imageData.get("file") as File,
  });
  return res.data;
};

export const getProductImage = async (productId: number) => {
  const res = await karandashClient.get(`/product/retrieve-image/${productId}`);
  return res.data;
};

export const getProductById = async (id: number) => {
  const res = await karandashClient.get(`/productretrieve-first/${id}`);
  return res.data;
};

export const deleteProduct = async (id: number, displayPosition: number) => {
  const res = await karandashClient.delete("/product/delete-product", {
    data: {
      productId: id,
      displayPosition: displayPosition,
    },
  });
  return res.data;
};
