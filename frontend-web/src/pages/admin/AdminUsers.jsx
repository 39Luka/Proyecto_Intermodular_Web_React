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
    const [foundUsers, setFoundUsers] = useState([]);
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
            const response = await userService.getUserByEmail(searchEmail.trim());
            // Manejar tanto si el backend devuelve una lista paginada, un array, o un solo objeto
            const usersList = response?.content ? response.content : (Array.isArray(response) ? response : (response?.id ? [response] : []));
            setFoundUsers(usersList);
            if (usersList.length === 0) {
                setError("No se encontraron usuarios.");
            }
        } catch (err) {
            setFoundUsers([]);
            setError(err.message || "No se pudo buscar el usuario.");
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(userToToggle) {
        try {
            await userService.patchUser(userToToggle.id, !userToToggle.enabled);
            setFoundUsers(prevUsers => prevUsers.map(u => 
                u.id === userToToggle.id ? { ...u, enabled: !u.enabled } : u
            ));
            setMessage(`Estado del usuario ${userToToggle.email} actualizado.`);
        } catch (err) {
            setError(err.message || "No se pudo cambiar el estado.");
        }
    }

    const [showPassword, setShowPassword] = useState(false);

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
            setFoundUsers([createdUser]);
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
                            type="text"
                            value={searchEmail}
                            onChange={(event) => setSearchEmail(event.target.value)}
                            placeholder="Buscar por email..."
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
                                type="text"
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
                        <div className="admin-password-wrapper">
                            <input
                                id="new-user-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="admin-input--password"
                                value={createForm.password}
                                onChange={handleCreateChange}
                                required
                            />
                            <button
                                type="button"
                                className="auth-field__toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="admin-actions">
                        <button type="submit" className="button button--primary" disabled={saving}>
                            {saving ? "Creando..." : "Crear usuario"}
                        </button>
                    </div>
                </form>
            </div>

            {foundUsers.length > 0 && (
                <div className="admin-stack" aria-live="polite">
                    <h2>Usuarios encontrados ({foundUsers.length})</h2>
                    {foundUsers.map(user => (
                        <article key={user.id} className="admin-form-card mb-1">
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Rol:</strong> {user.role}</p>
                            <p>
                                <strong>Estado:</strong>{" "}
                                <span className={`status-pill ${user.enabled ? "active" : "inactive"}`}>
                                    {user.enabled ? "Habilitado" : "Deshabilitado"}
                                </span>
                            </p>

                            <div className="admin-actions mt-1">
                                <button type="button" className="button button--text" onClick={() => handleToggleStatus(user)}>
                                    {user.enabled ? "Desactivar" : "Activar"} cuenta
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default AdminUsers;
