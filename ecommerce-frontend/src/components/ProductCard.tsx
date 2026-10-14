import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/product";
import { useCartStore } from "../store/cartStore";
import { deleteProduct, updateProduct } from "../api/productApi";

interface ProductCardProps {
    product: Product;
    isAdmin?: boolean;
}

function ProductCard({ product, isAdmin = false }: ProductCardProps) {
    const queryClient = useQueryClient();
    const addToCart = useCartStore((state) => state.addToCart);

    const [editing, setEditing] = useState(false);
    const [productName, setProductName] = useState(product.productName);
    const [category, setCategory] = useState(product.category);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    const [imageUrl, setImageUrl] = useState(product.imageUrl);
    const [rating, setRating] = useState(String(product.rating));
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${product.productName}?`)) return;
        try {
            await deleteProduct(product.productId);
            queryClient.invalidateQueries({ queryKey: ["products"] });
        } catch {
            alert("Product deletion failed");
        }
    };

    const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await updateProduct(product.productId, {
                productName,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                rating: Number(rating),
                status: Number(stock) > 0 ? "AVAILABLE" : "OUT_OF_STOCK",
            });
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["products"] });
        } catch {
            setMessage("Product update failed");
        }
    };

    return (
        <div className="product-card">
            {!editing ? (
                <>
                    <img src={product.imageUrl} alt={product.productName} />
                    <h3>{product.productName}</h3>
                    <p>Category: {product.category}</p>
                    <p>{product.description}</p>
                    <p>₹{product.price}</p>
                    <p>Rating: ⭐ {product.rating}</p>
                    <p>
                        {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"}
                    </p>

                    {!isAdmin && (
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                    )}

                    {isAdmin && (
                        <div className="admin-product-buttons">
                            <button onClick={() => setEditing(true)}>Update</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </>
            ) : (
                <form className="product-form" onSubmit={handleUpdate}>
                    <h3>Update Product</h3>
                    <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product Name"
                        required
                    />
                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        required
                    />
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Stock"
                        required
                    />
                    <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL"
                        required
                    />
                    <input
                        type="number"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="Rating"
                        required
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                    {message && <p className="error-message">{message}</p>}
                </form>
            )}
        </div>
    );
}

export default ProductCard;