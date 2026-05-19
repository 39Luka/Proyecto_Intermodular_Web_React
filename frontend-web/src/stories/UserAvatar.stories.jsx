import { MemoryRouter } from "react-router-dom";
import UserAvatar from "../components/layout/UserAvatar";
import { AuthContext } from "../context/AuthContext";
import { userService } from "../services/userService";

export default {
    title: "Layout/UserAvatar",
    component: UserAvatar,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem", background: "#f5f5f5" }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "Avatar del usuario con iniciales o imagen de perfil cargada desde el servicio.",
            },
        },
    },
};

const createMockProvider = (user) => (Story) => (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading: false }}>
        <Story />
    </AuthContext.Provider>
);

/** Con iniciales del correo */
export const ConIniciales = {
    decorators: [
        createMockProvider({ email: "luka.modric@realmadrid.com" }),
    ],
    beforeEach: () => {
        userService.getCurrentUser = () => Promise.resolve({ profileImageBase64: null });
    },
};

/** Con imagen de perfil cargada (base64) */
export const ConImagen = {
    decorators: [
        createMockProvider({ email: "luka.modric@realmadrid.com" }),
    ],
    beforeEach: () => {
        // Logo de croissant como base64 de marcador de posición pequeño para probar la carga de imagen
        const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        userService.getCurrentUser = () => Promise.resolve({ profileImageBase64: sampleBase64 });
    },
};
