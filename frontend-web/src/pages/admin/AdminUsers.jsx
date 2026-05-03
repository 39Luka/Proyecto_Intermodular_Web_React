import { useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";

const initialCreateForm = {
    email: "",
    password: "",
    role: "USER",
};

function AdminUsers() {
    const [searchEmail, setSearchEmail] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [createForm, setCreateForm] = useState(initialCreateForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSearch(event) {
        event.preventDefault();
        if (!searchEmail.trim()) return;

        try {
            setLoading(true);
            setError("");
            setMessage("");
            const user = await userService.getUserByEmail(searchEmail.trim());
            setFoundUser(user);
        } catch (err) {
            setFoundUser(null);
            setError(err.message || "No se pudo buscar el usuario.");
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus() {
        if (!foundUser) return;

        try {
            await userService.patchUser(foundUser.id, !foundUser.enabled);
            setFoundUser((prev) => ({ ...prev, enabled: !prev.enabled }));
            setMessage("Estado del usuario actualizado.");
        } catch (err) {
            setError(err.message || "No se pudo cambiar el estado.");
        }
    }

    function handleCreateChange(event) {
        const { name, value } = event.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleCreateUser(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");
            const createdUser = await userService.createUser(createForm);
            setFoundUser(createdUser);
            setCreateForm(initialCreateForm);
            setMessage("Usuario creado correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo crear el usuario.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="admin-page admin-stack" aria-labelledby="admin-users-title">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">Volver al panel</Link>
                    <h1 id="admin-users-title">Gestión de usuarios</h1>
                </div>
            </header>

            {error && <p className="admin-error-msg" role="alert">{error}</p>}
            {message && <p className="admin-success-msg" aria-live="polite">{message}</p>}

            <div className="admin-layout-two">
                <form className="admin-form-card admin-stack" onSubmit={handleSearch}>
                    <h2>Buscar por email</h2>
                    <div className="admin-actions">
                        <input
                            type="email"
                            value={searchEmail}
                            onChange={(event) => setSearchEmail(event.target.value)}
                            placeholder="usuario@dominio.com"
                            aria-label="Buscar usuario por email"
                            required
                        />
                        <button type="submit" className="button button--primary" disabled={loading}>
                            {loading ? "Buscando..." : "Buscar"}
                        </button>
                    </div>
                </form>

                <form className="admin-form-card admin-stack" onSubmit={handleCreateUser}>
                    <h2>Crear usuario</h2>
                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label htmlFor="new-user-email">Email</label>
                            <input
                                id="new-user-email"
                                name="email"
                                type="email"
                                value={createForm.email}
                                onChange={handleCreateChange}
                                required
                            />
                        </div>

                        <div className="admin-form-field">
                            <label htmlFor="new-user-role">Rol</label>
                            <select
                                id="new-user-role"
                                name="role"
                                value={createForm.role}
                                onChange={handleCreateChange}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-field">
                        <label htmlFor="new-user-password">Contraseña</label>
                        <input
                            id="new-user-password"
                            name="password"
                            type="password"
                            value={createForm.password}
                            onChange={handleCreateChange}
                            required
                        />
                    </div>

                    <div className="admin-actions">
                        <button type="submit" className="button button--primary" disabled={saving}>
                            {saving ? "Creando..." : "Crear usuario"}
                        </button>
                    </div>
                </form>
            </div>

            {foundUser && (
                <article className="admin-form-card admin-stack" aria-live="polite">
                    <h2>Usuario encontrado</h2>
                    <p><strong>ID:</strong> {foundUser.id}</p>
                    <p><strong>Email:</strong> {foundUser.email}</p>
                    <p><strong>Rol:</strong> {foundUser.role}</p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        <span className={`status-pill ${foundUser.enabled ? "active" : "inactive"}`}>
                            {foundUser.enabled ? "Habilitado" : "Deshabilitado"}
                        </span>
                    </p>

                    <div className="admin-actions">
                        <button type="button" className="button button--text" onClick={handleToggleStatus}>
                            {foundUser.enabled ? "Desactivar" : "Activar"} cuenta
                        </button>
                    </div>
                </article>
            )}
        </section>
    );
}

export default AdminUsers;
