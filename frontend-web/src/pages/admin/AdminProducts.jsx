import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";

/**
 * AdminProducts - Gestión avanzada de productos.
 * Muestra una tabla con los productos existentes y permite realizar acciones de gestión.
 */
function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError("Error al cargar los productos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await productService.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            alert("Producto eliminado con éxito.");
        } catch (err) {
            alert("Error al eliminar el producto. Puede que esté asociado a una compra existente.");
            console.error(err);
        }
    };

    if (loading) return <div className="admin-loading">Cargando catálogo...</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div className="admin-page-header__left">
                    <Link to="/admin" className="back-link">← Volver al Panel</Link>
                    <h1>Gestión de Productos</h1>
                </div>
                <Link to="/admin/products/new" className="button button--primary">+ Nuevo Producto</Link>
            </header>

            {error && <div className="admin-error-msg">{error}</div>}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="td-image">
                                    <img src={product.imageUrl} alt={product.name} />
                                </td>
                                <td className="td-name"><strong>{product.name}</strong></td>
                                <td className="td-desc">{product.description}</td>
                                <td className="td-price">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                                <td className="td-stock">
                                    <span className={`stock-badge ${product.stock < 10 ? 'stock-low' : ''}`}>
                                        {product.stock} uds.
                                    </span>
                                </td>
                                <td className="td-actions">
                                    <Link to={`/admin/products/edit/${product.id}`} className="action-btn edit">Editar</Link>
                                    <button onClick={() => handleDelete(product.id, product.name)} className="action-btn delete">Borrar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .admin-page {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .back-link {
                    display: block;
                    text-decoration: none;
                    color: #6b7280;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .admin-page-header h1 {
                    margin: 0;
                    color: #111827;
                }
                .admin-table-wrapper {
                    background: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .admin-table th {
                    background: #f9fafb;
                    padding: 1rem;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .admin-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: middle;
                    font-size: 0.95rem;
                }
                .td-image img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 0.375rem;
                }
                .td-name {
                    color: #111827;
                }
                .td-desc {
                    color: #6b7280;
                    max-width: 300px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .stock-badge {
                    background: #dcfce7;
                    color: #166534;
                    padding: 0.25rem 0.6rem;
                    border-radius: 9999px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .stock-low {
                    background: #fee2e2;
                    color: #991b1b;
                }
                .td-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-btn {
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.375rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .action-btn.edit {
                    background: #f3f4f6;
                    color: #374151;
                }
                .action-btn.edit:hover {
                    background: #e5e7eb;
                }
                .action-btn.delete {
                    background: #fee2e2;
                    color: #b91c1c;
                }
                .action-btn.delete:hover {
                    background: #fecaca;
                }
                .admin-error-msg {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                }
            `}</style>
        </div>
    );
}

export default AdminProducts;
