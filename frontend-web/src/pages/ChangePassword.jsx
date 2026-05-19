import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import SectionBase from "../components/sections/SectionBase";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.newPassword.length < 8 || form.newPassword.length > 72) {
      setError("La nueva contraseña debe tener entre 8 y 72 caracteres.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      className="auth-field__toggle"
      onClick={onToggle}
      tabIndex="-1"
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      )}
    </button>
  );

  return (
    <div className="profile-page">
      <SectionBase 
        title="Cambiar Contraseña" 
        eyebrow="Seguridad" 
        description="Introduce tu contraseña actual y la nueva para actualizar tus credenciales."
      >
        <form className={`profile-card container-narrow ${loading ? "form-loading" : ""}`} onSubmit={handleSubmit}>
          <div className="profile-card__content">
            {error && <div className="profile-card__error-display">{error}</div>}
            
            <div className="profile-info__group">
              <label className="profile-info__label" htmlFor="currentPassword">Contraseña actual</label>
              <div className="profile-field-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  className="profile-input-field"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
              </div>
            </div>
            
            <div className="profile-info__group">
              <label className="profile-info__label" htmlFor="newPassword">Nueva contraseña</label>
              <div className="profile-field-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className="profile-input-field"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
              </div>
            </div>
            
            <div className="profile-info__group">
              <label className="profile-info__label" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
              <div className="profile-field-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="profile-input-field"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            <div className="profile-actions profile-actions--form">
              <button type="button" onClick={() => navigate(-1)} className="button button--secondary">
                Volver
              </button>
              <button type="submit" className="button button--primary" disabled={loading}>
                {loading ? (
                  <span className="loading-wrapper">
                    <span className="spinner-mini"></span>
                    Actualizando...
                  </span>
                ) : (
                  "Actualizar Contraseña"
                )}
              </button>
            </div>
          </div>
        </form>
      </SectionBase>
    </div>
  );
}
