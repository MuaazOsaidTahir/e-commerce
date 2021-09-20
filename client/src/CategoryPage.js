import React from 'react'
import { useParams } from 'react-router-dom'
import EachProduct from './EachProduct'
import Loading from './Loading'
import "./CategoryPage.css"
import { useQuery } from 'react-query'

const gettingCategoryData = async ({ queryKey }) => {
    const [category] = queryKey;
    const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    const data = await res.json();

    return data
}

function CategoryPage() {
    const { category } = useParams()
    const { data, isLoading } = useQuery([category], gettingCategoryData)

    return (
        <div className="CategoryPage" >
            <h2>SEARCH FOR {category.toUpperCase()}</h2>
            <div className="category__products" >
                {
                    !isLoading ?
                        data.map((product, i) => {
                            return <EachProduct key={i} id={product.id} image={product.image} title={product.title} price={product.price} category={product.category} rating={product.rating.rate} />
                        })
                        :
                        <Loading />
                }
            </div>
        </div>
    )
}

export default CategoryPage
