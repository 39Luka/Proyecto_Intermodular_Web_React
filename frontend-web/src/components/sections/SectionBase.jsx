import slugify from "slugify";
function SectionBase({ title, children }){
   
    const slug = slugify(title, { lower: true, strict: true })

    return (
        <>
            <section aria-labelledby={`title-${slug}`}>
                <h2 id={`title-${slug}`}>{title}</h2>


                {children}
            </section>
        </>
    )
}
export default SectionBase;