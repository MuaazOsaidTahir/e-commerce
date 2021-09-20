import React from 'react'
import { useSelector } from 'react-redux'
import "./CheckoutPage.css"
import CheckOutPageTop from './CheckOutPageTop';
import CheckOutProducts from './CheckOutProducts';

function CheckoutPage() {
    const products = useSelector(store => store.products)

    return (
        <>
            <CheckOutPageTop />
            <div className="CheckoutPage" >
                {
                    products.length ?
                        products.map(product => {
                            return <CheckOutProducts key={product.id} id={product.id} image={product.image} title={product.title} rating={product.rating} price={product.price} quantity={product.quantity} />
                        }) : <h2>No Products in Cart</h2>
                }
            </div>
        </>
    )
}

export default CheckoutPage
