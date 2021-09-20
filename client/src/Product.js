import React from 'react'
import { useDispatch } from 'react-redux';
import "./Product.css"
import { Link } from "react-router-dom"
import ToastBasket from './ToastBasket';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function Product({ id, price, category, title, image, rating }) {
    const dispatch = useDispatch();


    const addproducttobasket = () => {
        toast(<ToastBasket id={id} image={image} title={title} />, {
            position: "top-left",
            autoClose: 3000
        })
        dispatch({ type: "ADD_TO_BASKET", payload: { id, price, category, title, image, rating, quantity: 1 } })
    }

    return (
        <div className="Product" >
            <Link to={`/product/${id}`} >
                <div className="product__info" >
                    <p>{title}</p>
                    <p> ${price} </p>
                    <Link to={`/category/${category}`} title={category} ><strong>{category}</strong></Link>
                    <div className="product__rating" >
                        {
                            Array(Math.round(rating)).fill().map((_, i) => {
                                return <p key={i} >⭐</p>
                            })
                        }
                    </div>
                    <img src={image} alt={title} />
                </div>
            </Link>
            <button onClick={addproducttobasket} >ADD TO BASKET</button>
        </div>
    )
}

export default Product
