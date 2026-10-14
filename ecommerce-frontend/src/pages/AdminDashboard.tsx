import { useState } from "react";
import ProductList from "../components/ProductList";
import BackgroundJobMonitor from "../components/BackgroundJobMonitor";
import { addProduct } from "../api/productApi";

function AdminDashboard() {

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [rating, setRating] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        try {
            await addProduct({
                productName,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                rating: Number(rating),
                status: Number(stock) > 0
                    ? "AVAILABLE"
                    : "OUT_OF_STOCK"
            });

            setMessage("Product inserted successfully");

            setProductName("");
            setCategory("");
            setDescription("");
            setPrice("");
            setStock("");
            setImageUrl("");
            setRating("");

        } catch {
            setMessage("Product insertion failed");
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <div className="admin-section">
                <h3>Insert Product</h3>

                <form className="product-form" onSubmit={handleSubmit}>
                    <input
                        placeholder="Product Name"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        required
                    />

                    <input
                        placeholder="Category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(event) => setStock(event.target.value)}
                        required
                    />

                    <input
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        required
                    />

                    <input
                        type="number"
                        step="0.1"
                        placeholder="Rating"
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                        required
                    />

                    <button type="submit">Insert Product</button>
                </form>

                {message && (
                    <p className="form-message">{message}</p>
                )}
            </div>

            <h3>View Products</h3>
            <ProductList isAdmin={true} />

            {/* CO5: Live background job status */}
            <BackgroundJobMonitor />
        </div>
    );
}

export default AdminDashboard;