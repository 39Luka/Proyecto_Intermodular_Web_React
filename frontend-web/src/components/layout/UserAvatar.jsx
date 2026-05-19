import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";

/**
 * Avatar circular del usuario con iniciales o imagen de perfil.
 *
 * Muestra las iniciales del usuario (obtenidas de su email) o su imagen
 * de perfil en base64 si está configurada. Al hacer clic, navega a la página
 * del perfil de usuario.
 * Escucha el evento global `"avatar-updated"` para refrescar la imagen en tiempo real.
 *
 * @component
 * @returns {JSX.Element|null} Botón con la imagen del avatar o las iniciales del usuario.
 *
 * @example
 * <UserAvatar />
 */
export default function UserAvatar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  // Escuchar actualizaciones globales del avatar
  useEffect(() => {
    const handleUpdate = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener("avatar-updated", handleUpdate);
    return () => window.removeEventListener("avatar-updated", handleUpdate);
  }, []);

  // Cargar la imagen del avatar (si existe) al montar o al refrescar
  useEffect(() => {
    if (user) {
      userService
        .getCurrentUser()
        .then((data) => {
          if (data && data.profileImageBase64) {
            setAvatarUrl(`data:image/png;base64,${data.profileImageBase64}`);
          } else {
            setAvatarUrl(null);
          }
        })
        .catch(() => {}); // Error silenciado
    }
  }, [user, refreshTrigger]);

  if (!user) return null;

  const initials = user.email
    ? user.email
        .split("@")
        .shift()
        .split(".")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "U";

  return (
    <div className="user-avatar">
      <div className="user-avatar__wrapper">
        <button
          className="user-avatar__button"
          onClick={() => navigate("/profile")}
          aria-label="Ir al perfil"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="user-avatar__image" />
          ) : (
            <span className="user-avatar__initials">{initials}</span>
          )}
        </button>
      </div>
    </div>
  );
}

