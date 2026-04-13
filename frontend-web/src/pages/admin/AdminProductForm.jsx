import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

/**
 * AdminProductForm - Formulario para añadir o editar productos.
 */
function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        categoryId: ""
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Error al cargar categorías", err);
        }
    };

    const fetchProduct = async () => {
        try {
            const product = await productService.getProductById(id);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                    categoryId: product.categoryId || ""
                });
            }
        } catch (err) {
            setError("No se pudo cargar la información del producto.");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "stock" || name === "categoryId" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await productService.updateProduct(id, formData);
            } else {
                await productService.createProduct(formData);
            }
            navigate("/admin/products");
        } catch (err) {
            setError(err.message || "Error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="admin-loading">Cargando datos del producto...</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin/products" className="back-link">← Cancelar y Volver</Link>
                    <h1>{isEditMode ? "Editar Producto" : "Nuevo Producto"}</h1>
                </div>
            </header>

            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form">
                    {error && <div className="admin-error-msg">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Nombre del Producto</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Barra de pan rústica"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio (€)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock">Stock Inicial</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryId">Categoría</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">URL de la Imagen</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Describe el producto, ingredientes, etc."
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="button button--primary" disabled={loading}>
                            {loading ? "Guardando..." : isEditMode ? "Actualizar Producto" : "Crear Producto"}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .admin-form-container {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    max-width: 800px;
                    margin: 0 auto;
                    border: 1px solid #e5e7eb;
                }
                .admin-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.9rem;
                }
                input, select, textarea {
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #5B21B6;
                    box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);
                }
                .form-actions {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }
                .admin-error-msg {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}

export default AdminProductForm;
