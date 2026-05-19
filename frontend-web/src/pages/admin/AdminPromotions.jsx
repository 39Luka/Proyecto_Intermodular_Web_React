import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { promotionService } from "../../services/promotionService";
import { formatDate } from "../../utils/formatters";
import Pagination from "../../components/ui/Pagination";

const initialForm = {
    productId: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
};

function AdminPromotions() {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 8;

    const filteredPromotions = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return promotions;
        return promotions.filter((p) => 
            p.description?.toLowerCase().includes(term) || 
            p.productName?.toLowerCase().includes(term) ||
            String(p.productId).includes(term)
        );
    }, [promotions, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredPromotions.length / pageSize));

    const paginatedPromotions = useMemo(() => {
        const start = page * pageSize;
        return filteredPromotions.slice(start, start + pageSize);
    }, [filteredPromotions, page, pageSize]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");
            const [promotionsData, productsResult] = await Promise.all([
                promotionService.getAllPromotions(),
                productService.getAllProducts(),
            ]);
            setPromotions(promotionsData);
            setProducts(productsResult.products);
        } catch (err) {
            setError(err.message || "No se pudieron cargar las promociones.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleCreate(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const payload = {
                productId: Number(form.productId),
                description: form.description.trim(),
                discountPercentage: Number(form.discountPercentage),
                startDate: form.startDate,
                endDate: form.endDate,
            };

            const created = await promotionService.createPercentagePromotion(payload);
            setPromotions((prev) => [created, ...prev]);
            setForm(initialForm);
            setMessage("Promoción creada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo crear la promoción.");
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleActive(promotion) {
        try {
            await promotionService.patchPromotion(promotion.id, !promotion.active);
            setPromotions((prev) =>
                prev.map((item) => (
                    item.id === promotion.id ? { ...item, active: !promotion.active } : item
                ))
            );
            setMessage("Estado de promoción actualizado.");
        } catch (err) {
            setError(err.message || "No se pudo actualizar la promoción.");
        }
    }

    const showInitialLoading = loading && promotions.length === 0;

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-promotions-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-promotions-title">Gestión de promociones</h1>
                </div>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <form className="admin-form-card admin-stack" onSubmit={handleCreate}>
                <h2>Nueva promoción</h2>
                <div className="admin-form-grid">
                    <div className="admin-form-field">
                        <label htmlFor="productId">Producto</label>
                        <select id="productId" name="productId" value={form.productId} onChange={handleChange} required>
                            <option value="">Selecciona un producto</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="discountPercentage">Descuento (%)</label>
                        <input
                            id="discountPercentage"
                            name="discountPercentage"
                            type="number"
                            min="1"
                            max="100"
                            value={form.discountPercentage}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="startDate">Fecha inicio</label>
                        <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="endDate">Fecha fin</label>
                        <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
                    </div>
                </div>

                <div className="admin-form-field">
                    <label htmlFor="description">Descripción</label>
                    <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} required />
                </div>

                <div className="admin-actions">
                    <button type="submit" className="button button--primary" disabled={saving}>
                        {saving ? "Guardando..." : "Crear promoción"}
                    </button>
                </div>
            </form>

            <div className="admin-search-container">
                <input
                    type="text"
                    placeholder="Buscar por descripción o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                    aria-label="Filtrar promociones"
                />
            </div>

            {showInitialLoading ? (
                <div className="section-loader-wrap section-loader-wrap--compact">
                    <div className="section-spinner" aria-label="Cargando..."></div>
                    <p className="section-loader-text">Cargando promociones...</p>
                    <p className="section-loader-subtext">Un momento por favor.</p>
                </div>
            ) : (
                <div className={`admin-table-wrapper ${loading ? "admin-table--loading" : ""}`}>
                    <table className="admin-table">
                        <caption className="sr-only">Tabla de promociones</caption>
                        <thead>
                            <tr>
                                <th scope="col">Descripción</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Descuento</th>
                                <th scope="col">Vigencia</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPromotions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-2">
                                        No se encontraron promociones.
                                    </td>
                                </tr>
                            ) : (
                                paginatedPromotions.map((promotion) => (
                                    <tr key={promotion.id}>
                                        <th scope="row">{promotion.description}</th>
                                        <td>{promotion.productName || promotion.detailLeft || `#${promotion.productId}`}</td>
                                        <td>{promotion.discountPercentage}%</td>
                                        <td>
                                            {promotion.startDate ? <time dateTime={promotion.startDate}>{formatDate(promotion.startDate)}</time> : "N/A"}
                                            {" - "}
                                            {promotion.endDate ? <time dateTime={promotion.endDate}>{formatDate(promotion.endDate)}</time> : "N/A"}
                                        </td>
                                        <td>
                                            <span className={`status-pill ${promotion.active ? "active" : "inactive"}`}>
                                                {promotion.active ? "Activa" : "Inactiva"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="button button--text"
                                                onClick={() => handleToggleActive(promotion)}
                                            >
                                                {promotion.active ? "Desactivar" : "Activar"}
                                            </button>
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

export default AdminPromotions;
