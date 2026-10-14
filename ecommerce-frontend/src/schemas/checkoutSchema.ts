import { z } from "zod";

export const checkoutSchema = z.object({
    name: z
        .string()
        .min(3, "Name must contain at least 3 characters"),

    phone: z
        .string()
        .regex(
            /^[0-9]{10}$/,
            "Phone number must contain 10 digits"
        ),

    address: z
        .string()
        .min(
            10,
            "Address must contain at least 10 characters"
        )
});

export type CheckoutFormData =
    z.infer<typeof checkoutSchema>;