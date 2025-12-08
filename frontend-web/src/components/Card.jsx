import slugify from "slugify"; /* Librería para normalizar los títulos
                                * La opción lower lo pasa todo a minúsculas
                                * La opción strict elimina cualquier caracter que sea problematico
                                */

// Se pasa el onNavigate en el props para separar al componente de la lógica de navegación
function Card({ id, title, image, description, onNavigate }) {

    const slug = slugify(title, { lower: true, strict: true }) //Título normalizado

    const handleOnClick = () => onNavigate(id) //Lambda para el click
    
    const handleOnKeyUp = (e) => {
        if (e.key === 'Enter' || e.key === ' ') //Lambda para el enter (accesible mediante teclado)
            onNavigate(id)
    }

    return (
        <>
            <article
                className="card"
                id={slug}
                role="button"
                tabIndex={0}
                onClick={handleOnClick}
                onKeyUp={handleOnKeyUp}
                aria-labelledby={`title-${slug}`}
                aria-describedby={`desc-${slug}`}
            >

                <figure>
                    <img src={image} alt={`Imagen de ${title}`} />
                </figure>

                <header>
                    <h3 id={`title-${slug}`}>{title}</h3>
                </header>

                <p id={`desc-${slug}`}>{description}</p>


            </article>
        </>
    )
}

export default Card;