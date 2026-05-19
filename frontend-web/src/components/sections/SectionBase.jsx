import slugify from "slugify";

/**
 * Contenedor base para las secciones del sitio web.
 * Proporciona cabecera con eyebrow, título y descripción descriptiva.
 *
 * @component
 * @param {Object}   props
 * @param {string}   props.title            - Título de la sección.
 * @param {string}   [props.eyebrow='Selección'] - Texto contextual pequeño encima del título.
 * @param {string}   [props.description=''] - Texto explicativo corto debajo del título.
 * @param {React.ReactNode} props.children   - Contenido principal de la sección.
 * @returns {JSX.Element} Sección HTML semántica.
 *
 * @example
 * <SectionBase title="Nuestras Especialidades" eyebrow="Artesanía" description="Prueba lo mejor de nuestro horno diario.">
 *   <div>Contenido de la sección...</div>
 * </SectionBase>
 */
function SectionBase({ title, eyebrow = "Selección", description = "", children }) {
    const slug = slugify(title, { lower: true, strict: true });

    return (
        <section className="section-shell" aria-labelledby={`title-${slug}`}>
            <header className="section-shell__header">
                <div>
                    <p className="section-shell__eyebrow">{eyebrow}</p>
                    <h2 className="section-shell__title" id={`title-${slug}`}>{title}</h2>
                </div>
                {description ? <p className="section-shell__description">{description}</p> : null}
            </header>

            {children}
        </section>
    );
}

export default SectionBase;
