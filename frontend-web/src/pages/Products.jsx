import { useState, useEffect } from "react";
import CardVertical from "../components/cards/CardVertical";
import ProductSection from "../components/sections/ProductSection";
import { useProducts } from "../hooks/useProducts";
import { categoryService } from "../services/categoryService";

function Products() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { products, loading, error } = useProducts(selectedCategory);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);

    if (loading && !products.length) return <div className="status-message">Cargando productos...</div>;
    if (error) return <div className="status-message status-message--error">Error: {error}</div>;

    return (
        <div className="app-container">
            <div className="category-filters flex gap-1 overflow-x-auto p-1 mb-1">
                <button 
                    className={`button whitespace-nowrap ${!selectedCategory ? "" : "button--text"}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    Todos
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        className={`button whitespace-nowrap ${selectedCategory === cat.id ? "" : "button--text"}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            
            <ProductSection title="Nuestro Catálogo" products={products} CardComponent={CardVertical} />
        </div>
    )
}

export default Products;