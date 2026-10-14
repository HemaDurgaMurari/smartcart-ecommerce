import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface OrderResponse {
    orderId: number;
    totalAmount: number;
    status: string;
}

export interface PaymentResponse {
    keyId: string;
    orderId: number;
    razorpayOrderId: string;
    amount: number;
    currency: string;
}

export interface VerifyPaymentData {
    orderId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const createOrder = async (
    items: { productId: number; quantity: number }[]
): Promise<OrderResponse> => {
    const response = await axios.post<OrderResponse>(
        `${API_URL}/orders`,
        { items },
        getAuthHeaders()
    );
    return response.data;
};

export const createPayment = async (
    orderId: number
): Promise<PaymentResponse> => {
    const response = await axios.post<PaymentResponse>(
        `${API_URL}/payment/create/${orderId}`,
        {},
        getAuthHeaders()
    );
    return response.data;
};

export const verifyPayment = async (data: VerifyPaymentData) => {
    const response = await axios.post(
        `${API_URL}/payment/verify`,
        data,
        getAuthHeaders()
    );
    return response.data;
};