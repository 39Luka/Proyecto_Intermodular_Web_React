import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import Pagination from "../../components/ui/Pagination";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const filteredCategories = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return categories;
        return categories.filter((c) => c.name.toLowerCase().includes(term));
    }, [categories, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));

    const paginatedCategories = useMemo(() => {
        const start = page * pageSize;
        return filteredCategories.slice(start, start + pageSize);
    }, [filteredCategories, page, pageSize]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            setLoading(true);
            setError("");
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || "No se pudieron cargar las categorías.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(event) {
        event.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            setSaving(true);
            const created = await categoryService.createCategory(newCategoryName.trim());
            setCategories((prev) => [...prev, created]);
            setNewCategoryName("");
            setMessage("Categoría creada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo crear la categoría.");
        } finally {
            setSaving(false);
        }
    }

    function startEditing(category) {
        setEditingCategoryId(category.id);
        setEditingName(category.name);
    }

    async function saveEdition() {
        if (!editingCategoryId || !editingName.trim()) return;

        try {
            setSaving(true);
            await categoryService.updateCategory(editingCategoryId, editingName.trim());
            setCategories((prev) =>
                prev.map((category) =>
                    category.id === editingCategoryId ? { ...category, name: editingName.trim() } : category
                )
            );
            setEditingCategoryId(null);
            setEditingName("");
            setMessage("Categoría actualizada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo actualizar la categoría.");
        } finally {
            setSaving(false);
        }
    }

    const showInitialLoading = loading && categories.length === 0;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-categories-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-categories-title">Gestión de categorías</h1>
                </div>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <form className="admin-form-card admin-stack" onSubmit={handleCreate}>
                <h2>Nueva categoría</h2>
                <div className="admin-actions">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(event) => setNewCategoryName(event.target.value)}
                        placeholder="Nombre de categoría"
                        aria-label="Nombre de nueva categoría"
                        required
                    />
                    <button type="submit" className="button button--primary" disabled={saving}>
                        {saving ? "Guardando..." : "Crear"}
                    </button>
                </div>
            </form>

            <div className="admin-search-container">
                <input
                    type="text"
                    placeholder="Filtrar categorías por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                    aria-label="Filtrar categorías"
                />
            </div>

            {showInitialLoading ? (
                <div className="section-loader-wrap section-loader-wrap--compact">
                    <div className="section-spinner" aria-label="Cargando..."></div>
                    <p className="section-loader-text">Cargando categorías...</p>
                    <p className="section-loader-subtext">Un momento por favor.</p>
                </div>
            ) : (
                <div className={`admin-table-wrapper ${loading ? "admin-table--loading" : ""}`}>
                    <table className="admin-table">
                        <caption className="sr-only">Tabla de categorías</caption>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center p-2">
                                        No se encontraron categorías.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>
                                            {editingCategoryId === category.id ? (
                                                <input
                                                    value={editingName}
                                                    onChange={(event) => setEditingName(event.target.value)}
                                                    aria-label={`Editar nombre de categoría ${category.id}`}
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                {editingCategoryId === category.id ? (
                                                    <>
                                                        <button type="button" className="button button--primary" onClick={saveEdition} disabled={saving}>
                                                            Guardar
                                                        </button>
                                                        <button type="button" className="button button--text" onClick={() => setEditingCategoryId(null)}>
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button type="button" className="button button--text" onClick={() => startEditing(category)}>
                                                        Editar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </section>
    );
}

export default AdminCategories;
