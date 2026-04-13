import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";

/**
 * AdminCategories - Gestión de categorías de productos.
 */
function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Error al cargar categorías", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        
        setSaving(true);
        try {
            const data = await categoryService.createCategory(newCategoryName);
            setCategories(prev => [...prev, data]);
            setNewCategoryName("");
            alert("Categoría creada con éxito.");
        } catch (err) {
            alert("Error al crear la categoría.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Cargando categorías...</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">← Volver al Panel</Link>
                    <h1>Gestión de Categorías</h1>
                </div>
            </header>

            <div className="admin-category-layout">
                {/* Formulario de creación rápida */}
                <div className="admin-form-card">
                    <h3>Nueva Categoría</h3>
                    <form onSubmit={handleCreate} className="quick-form">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nombre de la categoría..."
                            required
                        />
                        <button type="submit" className="button button--primary" disabled={saving}>
                            {saving ? "Creando..." : "Añadir"}
                        </button>
                    </form>
                </div>

                {/* Listado de categorías */}
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>{cat.id}</td>
                                    <td><strong>{cat.name}</strong></td>
                                    <td className="td-actions">
                                        {/* Podríamos añadir editar aquí también */}
                                        <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>Opciones avanzadas próximamente</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .admin-category-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                    align-items: start;
                }
                .admin-form-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                }
                .admin-form-card h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    color: #374151;
                }
                .quick-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .quick-form input {
                    padding: 0.6rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                }
                @media (max-width: 768px) {
                    .admin-category-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default AdminCategories;
