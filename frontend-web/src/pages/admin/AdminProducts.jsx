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
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message || "No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(product) {
        const confirmed = window.confirm(`Se eliminara "${product.name}". Quieres continuar?`);
        if (!confirmed) return;

        try {
            await productService.deleteProduct(product.id);
            setProducts((prev) => prev.filter((item) => item.id !== product.id));
            setMessage("Producto eliminado correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo eliminar el producto.");
        }
    }

    if (loading) return <div className="admin-loading">Cargando catalogo...</div>;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-products-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-products-title">Gestion de productos</h1>
                </div>
                <Link to="/admin/products/new" className="button button--primary">Nuevo producto</Link>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <caption className="sr-only">Tabla de productos del catalogo</caption>
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <th scope="row">{product.name}</th>
                                <td>{product.category?.name || "Sin categoria"}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <div className="admin-actions">
                                        <Link to={`/admin/products/edit/${product.id}`} className="button button--text">
                                            Editar
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product)}
                                            className="button button--text"
                                            aria-label={`Eliminar ${product.name}`}
                                        >
                                            Eliminar
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
