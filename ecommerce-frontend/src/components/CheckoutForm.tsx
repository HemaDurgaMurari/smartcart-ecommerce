import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    checkoutSchema,
    type CheckoutFormData,
} from "../schemas/checkoutSchema";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import {
    createOrder,
    createPayment,
    verifyPayment,
} from "../api/paymentApi";

interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: unknown) => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
    }
}

function CheckoutForm() {
    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);
    const user = useAuthStore((state) => state.user);

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormData) => {
        if (!user) {
            alert("Please sign in to place an order.");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add products first.");
            return;
        }

        try {
            // 1. Create order in our backend
            const order = await createOrder(
                cartItems.map((item) => ({
                    productId: item.product.productId,
                    quantity: item.quantity,
                }))
            );

            // 2. Create Razorpay order
            const payment = await createPayment(order.orderId);

            // 3. Open Razorpay Checkout
            const options = {
                key: payment.keyId,
                amount: payment.amount,
                currency: payment.currency,
                name: "SmartCart",
                description: "E-Commerce Order",
                order_id: payment.razorpayOrderId,
                prefill: {
                    name: data.name,
                    contact: data.phone,
                },
                notes: {
                    address: data.address,
                },
                handler: async (response: RazorpaySuccessResponse) => {
                    try {
                        // 4. Verify payment on backend
                        await verifyPayment({
                            orderId: order.orderId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        // 5. Payment successful
                        clearCart();
                        reset();
                        alert("Payment successful! Order ID: " + order.orderId);
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Payment verification failed");
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log("Payment window closed");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (response) => {
                console.error("Payment failed:", response);
                alert("Payment failed");
            });

            razorpay.open();
        } catch (error) {
            console.error("Order/payment error:", error);
            alert("Unable to start payment");
        }
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input type="text" {...register("name")} />
                    {errors.name && (
                        <p className="error-message">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label>Phone</label>
                    <input type="tel" {...register("phone")} />
                    {errors.phone && (
                        <p className="error-message">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label>Address</label>
                    <textarea {...register("address")} />
                    {errors.address && (
                        <p className="error-message">{errors.address.message}</p>
                    )}
                </div>

                <h3>Order Total: ₹{total}</h3>

                <button type="submit">Pay Order</button>
            </form>
        </div>
    );
}

export default CheckoutForm;