import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import "./EachProduct.css"
import ToastBasket from './ToastBasket';

function EachProduct({ id, image, title, price, category, rating, toggle }) {
    const dispatch = useDispatch();

    const addproducttobasket = () => {
        toast(<ToastBasket id={id} image={image} title={title} />, {
            position: "top-left",
            autoClose: 3000
        })
        dispatch({ type: "ADD_TO_BASKET", payload: { id, price, category, title, image, rating, quantity: 1 } })
    }

    return (
        <div className="eachProduct" >
            {
                toggle ?
                    <>
                        <img src={image} alt={title} />
                        <h3>{title} </h3>
                        <p> $<strong>{price}</strong> </p>
                    </>
                    :
                    <Link to={`/product/${id}`} >
                        <img src={image} alt={title} />
                        <h3>{title} </h3>
                        <p> $<strong>{price}</strong> </p>
                    </Link>
            }
            {toggle ? "" : <button onClick={addproducttobasket} > ADD TO BASKET </button>}
        </div>
    )
}

export default EachProduct
