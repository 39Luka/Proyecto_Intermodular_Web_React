import Card from "./Card";
import {useNavigate} from 'react-router-dom'

function ProductList({products, page, options = {}}){
   

    const navigate = useNavigate();

    const handleNavigate = (id) =>  navigate(`/${page}/${id}`); 


    let items = [...products];

    if(options.filter)
        items = items.filter(options.filter)

    if(options.sort)
        items.sort(options.sort)

    if(options.limit)
        items = items.slice(0,options.limit)
   
    return(
        <>
        {items.map(product =>
            <Card
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              onNavigate={handleNavigate}
            />
        )}
        </>
    )
}

export default ProductList;