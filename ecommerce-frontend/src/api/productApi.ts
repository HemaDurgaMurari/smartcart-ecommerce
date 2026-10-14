import axios from "axios";
import type { Product } from "../types/product";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(API_URL);
    return response.data;
};

export const addProduct = async (
    product: Omit<Product, "productId">
): Promise<Product> => {
    const response = await axios.post<Product>(API_URL, product, getAuthHeaders());
    return response.data;
};

export const updateProduct = async (
    productId: number,
    product: Omit<Product, "productId">
): Promise<Product> => {
    const response = await axios.put<Product>(
        `${API_URL}/${productId}`,
        product,
        getAuthHeaders()
    );
    return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${productId}`, getAuthHeaders());
};