import { MemoryRouter } from "react-router-dom";
import Footer from "../components/layout/Footer";

/**
 * Pie de página global de la aplicación.
 *
 * Tres columnas: marca, enlaces de exploración y datos de contacto.
 */
export default {
    title: "Layout/Footer",
    component: Footer,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "Pie de página con columnas informativas, enlaces de navegación y copyright dinámico.",
            },
        },
    },
};

/** Footer completo tal como aparece en la aplicación */
export const Default = {};
