import BrandLogo from "../components/layout/BrandLogo";

/**
 * Logotipo vectorial SVG de La Croassantina.
 *
 * Icono decorativo del croissant de la marca.
 */
export default {
    title: "Layout/BrandLogo",
    component: BrandLogo,
    tags: ["autodocs"],
    argTypes: {
        className: { control: "text", description: "Clases CSS adicionales" },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "SVG vectorial del logotipo de la marca. Es decorativo (`aria-hidden`) por lo que no necesita texto alternativo.",
            },
        },
    },
};

/** Tamaño por defecto (72×72 px) */
export const Default = {
    args: {},
};

/** Con clase personalizada para tamaño grande */
export const Grande = {
    args: {
        className: "header__brand-mark",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "120px", height: "120px" }}>
                <Story />
            </div>
        ),
    ],
};
