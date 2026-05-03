import slugify from "slugify";

function SectionBase({ title, eyebrow = "Seleccion", description = "", children }) {
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
