import CardSkeleton from "../components/cards/CardSkeleton";

/**
 * Placeholder animado para tarjetas de producto.
 *
 * Se muestra mientras se cargan los datos reales.
 * Replica las dimensiones de `CardVertical` para evitar CLS.
 */
export default {
    title: "Cards/CardSkeleton",
    component: CardSkeleton,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "Esqueleto de carga animado. No acepta props. Se usa como placeholder durante la carga de datos.",
            },
        },
    },
};

/** Skeleton único */
export const Default = {};

/** Grupo de skeletons (como en el catálogo) */
export const GridDeCarga = {
    render: () => (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "900px" }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    ),
};
