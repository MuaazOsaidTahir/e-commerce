import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import EachProduct from './EachProduct'
import Loading from './Loading'
import "./ProductDetails.css"
import { useQuery } from "react-query"

const fetchProduct = async ({ queryKey }) => {
    const [key] = queryKey
    const res = await fetch(`https://fakestoreapi.com/products/${key}`);
    const data = await res.json();
    return data;
}

const fetchcategory = async ({ queryKey }) => {
    const [key] = queryKey
    const res = await fetch(`https://fakestoreapi.com/products/category/${key}`);
    const data = await res.json();

    return data;
}

function ProductDetails() {
    const { productid } = useParams()
    const dispatch = useDispatch()
    const [filteredProducts, setfilteredProducts] = useState([])
    const { data, isLoading } = useQuery([productid], fetchProduct)
    const category = useQuery([data?.category], fetchcategory)

    const addproducttobasket = (id, price, category, title, image, rating) => {
        console.log({ id, price, category, title, image, rating })
        dispatch({ type: "ADD_TO_BASKET", payload: { id, price, category, title, image, rating, quantity: 1 } })
    }

    useEffect(() => {
        if (category.data) {
            setfilteredProducts(category.data.filter(filterProduct => filterProduct.id !== Number(productid)))
        }
    }, [category.data])

    return (
        <div className="ProductDetails" >
            {
                !isLoading ?
                    <div className="searched__product" >
                        <div className="main__product" >
                            <div className="product_img_container" >
                                <h2>{data.title}</h2>
                                <img src={data.image} alt={data.title} />
                            </div>
                            <div className="products__subdetails" >
                                <p>Price: $<strong>{data.price}</strong></p>
                                <p>Category: <strong>{data.category}</strong></p>
                                <div className="product_rating" >
                                    {
                                        Array(Math.round(data.rating.rate)).fill().map((_, i) => {
                                            return <p key={i} >⭐</p>
                                        })
                                    }
                                </div>
                                <div style={{ marginTop: "10px" }} ><strong> Description</strong>:<p style={{ marginTop: "0px" }} >{data.description}</p> </div>
                                <button onClick={() => addproducttobasket(data.id, data.price, data.category, data.title, data.image, data.rating.rate)} > ADD TO BASKET </button>
                            </div>
                        </div>
                        {
                            filteredProducts.length ?
                                <div className="recommended__section" >
                                    <h1>More Products</h1>
                                    <div className="recommended__products" >
                                        {
                                            filteredProducts.map((eachProduct, i) => {
                                                return <EachProduct key={i} id={eachProduct.id} image={eachProduct.image} title={eachProduct.title} price={eachProduct.price} category={eachProduct.category} rating={eachProduct.rating.rate} />
                                            })
                                        }
                                    </div>
                                </div> : <Loading />
                        }
                    </div>
                    : <Loading />
            }
        </div>
    )
}

export default ProductDetails
