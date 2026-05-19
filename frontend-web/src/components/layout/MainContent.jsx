import { Outlet } from "react-router-dom";

/**
 * Contenedor principal de diseño para las vistas de la aplicación.
 *
 * Envuelve el elemento `<main>` y provee el punto de renderizado (`<Outlet />`)
 * para las subrutas dentro del layout principal con la cabecera y el pie de página.
 *
 * @component
 * @returns {JSX.Element} Elemento `<main>` contenedor con un `<Outlet />`.
 *
 * @example
 * // Utilizado en la definición de rutas principales
 * <Route path="/" element={<MainContent />}>
 *   <Route index element={<Home />} />
 * </Route>
 */
function MainContent() {
    return (
        <>
        <main id="main-content" className="app-container">
            <Outlet/>
        </main>
        </>

    )
}

export default MainContent;