import SectionBase from "../components/sections/SectionBase";

/**
 * Contenedor base para estructurar las secciones del sitio.
 */
export default {
    title: "Sections/SectionBase",
    component: SectionBase,
    tags: ["autodocs"],
    argTypes: {
        title: { control: "text", description: "Título de la sección" },
        eyebrow: { control: "text", description: "Eyebrow superior" },
        description: { control: "text", description: "Descripción explicativa" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Estructura shell reutilizable para cualquier módulo de la aplicación. Autogenera anclas ID semánticas y accesibles para lectores de pantalla.",
            },
        },
    },
};

/** Caso por defecto */
export const Default = {
    args: {
        title: "Nuestros Favoritos",
        eyebrow: "Tradición",
        description: "Elaborados diariamente con ingredientes orgánicos y de proximidad.",
        children: (
            <div style={{ padding: "2rem", border: "2px dashed #ccc", textAlign: "center", borderRadius: "8px" }}>
                [Contenido de la Sección]
            </div>
        ),
    },
};

/** Sin descripción explicativa */
export const SinDescripcion = {
    args: {
        ...Default.args,
        description: "",
    },
};
