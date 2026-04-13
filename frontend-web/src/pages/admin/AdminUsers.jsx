import { useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";

/**
 * AdminUsers - Búsqueda y gestión de cuentas de usuario.
 * Permite buscar por email y activar/desactivar cuentas.
 */
function AdminUsers() {
    const [searchEmail, setSearchEmail] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmail) return;

        setLoading(true);
        setError(null);
        setFoundUser(null);

        try {
            const user = await userService.getUserByEmail(searchEmail);
            if (user) {
                setFoundUser(user);
            } else {
                setError("No se encontró ningún usuario con ese email.");
            }
        } catch (err) {
            setError("Error al buscar el usuario. Asegúrate de que el email sea exacto.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!foundUser) return;
        
        const newStatus = !foundUser.enabled;
        try {
            await userService.patchUser(foundUser.id, newStatus);
            setFoundUser({ ...foundUser, enabled: newStatus });
            alert(`Usuario ${newStatus ? "activado" : "desactivado"} con éxito.`);
        } catch (err) {
            alert("Error al cambiar el estado del usuario.");
            console.error(err);
        }
    };

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <Link to="/admin" className="back-link">← Volver al Panel</Link>
                    <h1>Gestión de Usuarios</h1>
                </div>
            </header>

            <div className="admin-search-container">
                <div className="search-box">
                    <h3>Buscar Usuario</h3>
                    <form onSubmit={handleSearch} className="quick-form">
                        <input
                            type="email"
                            placeholder="Introduce el email exacto..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="button button--primary" disabled={loading}>
                            {loading ? "Buscando..." : "Buscar"}
                        </button>
                    </form>
                </div>

                {error && <div className="admin-error-msg" style={{marginTop: '1rem'}}>{error}</div>}

                {foundUser && (
                    <div className="admin-user-card" style={{marginTop: '2rem'}}>
                        <div className="user-card__header">
                            <div className="user-avatar">
                                {foundUser.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <h3>{foundUser.email}</h3>
                                <span className="role-tag">{foundUser.role}</span>
                            </div>
                        </div>
                        
                        <div className="user-card__body">
                            <div className="info-row">
                                <span>ID de Usuario:</span>
                                <strong>{foundUser.id}</strong>
                            </div>
                            <div className="info-row">
                                <span>Estado Actual:</span>
                                <span className={`status-pill ${foundUser.enabled ? 'active' : 'inactive'}`}>
                                    {foundUser.enabled ? "Habilitado" : "Deshabilitado"}
                                </span>
                            </div>
                        </div>

                        <div className="user-card__footer">
                            <button 
                                onClick={handleToggleStatus}
                                className={`button ${foundUser.enabled ? 'button--danger' : 'button--success'}`}
                                style={{width: '100%'}}
                            >
                                {foundUser.enabled ? "Desactivar Cuenta" : "Activar Cuenta"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .admin-search-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .search-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .admin-user-card {
                    background: white;
                    border-radius: 1rem;
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .user-card__header {
                    padding: 1.5rem;
                    background: #f9fafb;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .user-avatar {
                    width: 60px;
                    height: 60px;
                    background: var(--color-primary, #5B21B6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .user-info h3 { margin: 0; font-size: 1.25rem; color: #111827; }
                .role-tag {
                    display: inline-block;
                    margin-top: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 0.1rem 0.5rem;
                    border-radius: 4px;
                }
                .user-card__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .info-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
                .user-card__footer { padding: 1.5rem; border-top: 1px solid #f3f4f6; }
                
                .button--danger { background: #ef4444; color: white; }
                .button--success { background: #10b981; color: white; }
            `}</style>
        </div>
    );
}

export default AdminUsers;
