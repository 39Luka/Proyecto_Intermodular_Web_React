import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import SectionBase from "../components/sections/SectionBase";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfile(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        setUploading(true);
        await userService.uploadAvatar({ profileImageBase64: base64 });
        await fetchProfile();
        window.dispatchEvent(new Event("avatar-updated"));
      } catch (err) {
        alert("Error al subir la imagen: " + err.message);
      } finally {
        setUploading(false);
      }
    };
  };

  if (loading && !profile) return (
    <div className="section-loader-wrap section-loader-wrap--compact">
      <div className="section-spinner" aria-label="Cargando..."></div>
      <p className="section-loader-text">Cargando tu perfil...</p>
      <p className="section-loader-subtext">Un momento por favor mientras conectamos con el obrador.</p>
    </div>
  );
  
  if (error) return (
    <div className="empty-state-wrap">
      <div className="empty-state empty-state--accent">
        <p className="empty-state__title">No pudimos cargar tu perfil</p>
        <p className="empty-state__description">{error}</p>
        <button className="button button--primary empty-state__action" onClick={fetchProfile}>Reintentar</button>
      </div>
    </div>
  );

  const initials = profile?.email
    ? profile.email.split("@")[0].charAt(0).toUpperCase()
    : "U";

  const avatarSrc = profile?.profileImageBase64 
    ? `data:image/png;base64,${profile.profileImageBase64}` 
    : null;

  return (
    <div className="profile-page">


      <SectionBase 
        title="Mi Perfil" 
        eyebrow="Configuración" 
        description="Gestiona tu cuenta y seguridad de forma sencilla."
      >
        <div className="profile-container">
          {/* Hero section with avatar and name */}
          <div className="profile-hero-section">
            <div className="profile-hero__avatar-wrapper">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="profile-hero__avatar" />
              ) : (
                <div className="profile-hero__avatar">{initials}</div>
              )}
            </div>
            <h2 className="profile-hero__name">{profile?.email?.split('@')[0]}</h2>
            <p className="profile-hero__email">{profile?.email}</p>
          </div>

          {/* Main settings card */}
          <div className="profile-settings-container">
            <div className="profile-settings-card">
              <h3 className="profile-settings-card__title">Ajustes de cuenta</h3>
              
              <div className="profile-settings-group">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="button button--accent profile-settings-btn"
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Cambiar imagen"}
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="display-none" 
                  aria-hidden="true"
                  tabIndex="-1"
                />

                <Link to="/change-password" title="Cambiar contraseña" className="button button--accent profile-settings-btn">
                  Actualizar contraseña
                </Link>
              </div>

              <div className="profile-settings-divider"></div>

              <div className="profile-settings-group">
                <button 
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }} 
                  className="button--logout-mobile"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionBase>
    </div>
  );
}
