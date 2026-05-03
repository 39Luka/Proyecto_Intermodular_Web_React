import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
            setError(err.message || "No se pudieron cargar las categorias.");
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
            setMessage("Categoria creada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo crear la categoria.");
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
            setMessage("Categoria actualizada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo actualizar la categoria.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="admin-loading">Cargando categorias...</div>;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-categories-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-categories-title">Gestion de categorias</h1>
                </div>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <form className="admin-form-card admin-stack" onSubmit={handleCreate}>
                <h2>Nueva categoria</h2>
                <div className="admin-actions">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(event) => setNewCategoryName(event.target.value)}
                        placeholder="Nombre de categoria"
                        aria-label="Nombre de nueva categoria"
                        required
                    />
                    <button type="submit" className="button button--primary" disabled={saving}>
                        {saving ? "Guardando..." : "Crear"}
                    </button>
                </div>
            </form>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <caption className="sr-only">Tabla de categorias</caption>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    {editingCategoryId === category.id ? (
                                        <input
                                            value={editingName}
                                            onChange={(event) => setEditingName(event.target.value)}
                                            aria-label={`Editar nombre de categoria ${category.id}`}
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
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminCategories;
