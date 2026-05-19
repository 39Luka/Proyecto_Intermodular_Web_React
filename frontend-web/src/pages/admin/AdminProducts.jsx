import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { formatPrice } from "../../utils/formatters";
import Pagination from "../../components/ui/Pagination";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchProducts(nameFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    async function fetchProducts(searchName = null) {
        try {
            setLoading(true);
            setError("");
            const { products, totalPages: total } = await productService.getAllProducts(null, page, pageSize, searchName);
            setProducts(products);
            setTotalPages(total);
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

    if (loading && products.length === 0) return (
        <div className="section-loader-wrap section-loader-wrap--compact">
            <div className="section-spinner" aria-label="Cargando..."></div>
            <p className="section-loader-text">Cargando catálogo...</p>
            <p className="section-loader-subtext">Un momento por favor.</p>
        </div>
    );

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

            <form 
                onSubmit={(e) => { e.preventDefault(); setPage(0); fetchProducts(nameFilter); }} 
                className="admin-filter-form flex gap-1 mb-1"
            >
                <input
                    type="search"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Buscar producto por nombre..."
                    className="form-input"
                    aria-label="Buscar producto por nombre"
                />
                <button type="submit" className="button button--secondary">Buscar</button>
                {nameFilter && (
                    <button type="button" onClick={() => { setNameFilter(""); setPage(0); fetchProducts(null); }} className="button button--text">
                        Limpiar
                    </button>
                )}
            </form>

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
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-2">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </section>
    );
}

export default AdminProducts;
