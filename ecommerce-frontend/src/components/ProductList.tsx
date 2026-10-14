import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

interface ProductListProps {
    isAdmin?: boolean;
}

function ProductList({ isAdmin = false }: ProductListProps) {
    const { data: products, isLoading, isError } = useProducts();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (isError || !products) {
        return <p className="error-message">Failed to load products.</p>;
    }

    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.productName
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory =
            category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search products"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductList;