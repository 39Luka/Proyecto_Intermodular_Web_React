import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { formatPrice } from "../../utils/formatters";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            setError("");
            const { products } = await productService.getAllProducts();
            setProducts(products);
        } catch (err) {
            setError(err.message || "No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleActive(product) {
        const action = product.active ? "desactivar" : "activar";
        const confirmed = window.confirm(`Se va a ${action} "${product.name}". ¿Quieres continuar?`);
        if (!confirmed) return;

        try {
            await productService.patchProduct(product.id, !product.active);
            setProducts((prev) => prev.map((item) => item.id === product.id ? { ...item, active: !item.active } : item));
            setMessage(`Producto ${product.active ? "desactivado" : "activado"} correctamente.`);
        } catch (err) {
            setError(err.message || "No se pudo cambiar el estado del producto.");
        }
    }

    if (loading) return <div className="admin-loading">Cargando catálogo...</div>;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-products-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-products-title">Gestión de productos</h1>
                </div>
                <Link to="/admin/products/new" className="button button--primary">Nuevo producto</Link>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <caption className="sr-only">Tabla de productos del catálogo</caption>
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <th scope="row">{product.name}</th>
                                <td>{product.category?.name || "Sin categoría"}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <div className="admin-actions">
                                        <Link to={`/admin/products/edit/${product.id}`} className="button button--text">
                                            Editar
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(product)}
                                            className="button button--text"
                                            aria-label={`${product.active ? "Desactivar" : "Activar"} ${product.name}`}
                                        >
                                            {product.active ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminProducts;
