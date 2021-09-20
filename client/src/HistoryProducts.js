import React from 'react'
import EachProduct from './EachProduct'

function HistoryProducts({ products, ttamount }) {
    return (
        <div>
            {
                products.map(product => {
                    return <EachProduct key={product.id} id={product.id} image={product.image} title={product.title} price={product.price} toggle={true} />
                })
            }
            <p> Total Payment was: $<strong>{ttamount}</strong> </p>
        </div>
    )
}

export default HistoryProducts
