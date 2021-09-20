import React from 'react'
import { useDispatch } from 'react-redux'
import "./CheckOutProducts.css"

function CheckOutProducts({ id, price, image, title, rating, quantity }) {
    // console.log(id, price, image, title, rating)
    const dispatch = useDispatch()

    const removeproductfrombasket = () => {
        dispatch({ type: "REMOVE_FROM_BASKET", payload: id });
    }

    const addquantity = () => {
        dispatch({ type: "INCREASE", payload: id });
    }

    const removequantity = () => {
        dispatch({ type: "DECREASE", payload: id });
    }

    return (
        <div className="CheckOutProducts" >
            <img src={image} alt={title} />
            <div className="product__details" >
                <h3>{title}</h3>
                <p>Price: $<strong>{price}</strong></p>
                <div>
                    {
                        Array(Math.round(rating)).fill().map((_, i) => {
                            return <p key={i} > ⭐ </p>
                        })
                    }
                </div>
                <button onClick={removeproductfrombasket} className="removefrom__basket" > REMOVE FROM BASKET </button>
                <div className="product__quantity" >
                    <button onClick={removequantity} > - </button><strong> {quantity} </strong> <button onClick={addquantity} > + </button>
                </div>
            </div>
        </div>
    )
}

export default CheckOutProducts
