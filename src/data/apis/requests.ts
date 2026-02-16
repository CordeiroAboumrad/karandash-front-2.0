import { karandashClient } from "../config/axios";


export const getAllProducts = async () => {
    const res = await karandashClient.get("/product/all-products");
    return res.data;
};

export const getProductImage = async (productId: string) => {
    const res = await karandashClient.get(`/product/retrieve-image/${productId}`);
    return res.data;
};

export const getArtists = async () => {
    const res = await karandashClient.get('/artists');
    return res.data;
}
