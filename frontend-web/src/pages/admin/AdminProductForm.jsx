import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";

const initialForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
};

function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState("");

    const loadCategories = useCallback(async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || "No se pudieron cargar las categorías.");
        }
    }, []);

    const loadProduct = useCallback(async () => {
        try {
            setFetching(true);
            const product = await productService.getProductById(id);
            if (!product) {
                setError("Producto no encontrado.");
                return;
            }

            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price ?? "",
                stock: product.stock ?? "",
                imageUrl: product.imageUrl || "",
                categoryId: product.categoryId || product.category?.id || "",
            });
        } catch (err) {
            setError(err.message || "No se pudo cargar el producto.");
        } finally {
            setFetching(false);
        }
    }, [id]);

    useEffect(() => {
        loadCategories();
        if (isEditMode) loadProduct();
    }, [isEditMode, loadCategories, loadProduct]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            categoryId: Number(formData.categoryId),
        };

        try {
            if (isEditMode) {
                await productService.updateProduct(id, payload);
            } else {
                await productService.createProduct(payload);
            }
            navigate("/admin/products");
        } catch (err) {
            setError(err.message || "No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) return <div className="admin-loading">Cargando producto...</div>;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-product-form-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin/products" className="back-link">Volver a productos</Link>
                    <h1 id="admin-product-form-title">{isEditMode ? "Editar producto" : "Nuevo producto"}</h1>
                </div>
            </header>

            <form className="admin-form-card admin-stack" onSubmit={handleSubmit} noValidate>
                {error && <p className="admin-error-msg" role="alert">{error}</p>}

                <div className="admin-form-grid">
                    <div className="admin-form-field">
                        <label htmlFor="name">Nombre</label>
                        <input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="categoryId">Categoría</label>
                        <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="price">Precio</label>
                        <input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="stock">Stock</label>
                        <input id="stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>

                <div className="admin-form-field">
                    <label htmlFor="imageUrl">URL de imagen</label>
                    <input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required />
                </div>

                <div className="admin-form-field">
                    <label htmlFor="description">Descripción</label>
                    <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="admin-actions">
                    <button type="submit" className="button button--primary" disabled={loading}>
                        {loading ? "Guardando..." : isEditMode ? "Actualizar producto" : "Crear producto"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AdminProductForm;
