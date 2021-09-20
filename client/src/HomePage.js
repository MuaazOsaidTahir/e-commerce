import React, { useEffect } from 'react'
import "./HomePage.css"
import Loading from './Loading';
import Product from './Product';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "./Toast"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from "react-query"

toast.configure();

const fetchingData = async () => {
    const res = await fetch('https://fakestoreapi.com/products?limit=10');
    let data = await res.json();

    return data;
}

function HomePage() {
    const socket = useSelector(store => store.socket)
    const { data, isLoading, error } = useQuery("products", fetchingData)
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket) {
            socket.on("product_sold", (data) => {
                toast(<Toast para={data} />, {
                    autoClose: 2000
                })
            })
        }
    }, [socket])

    useEffect(() => {
        dispatch({ type: "AGAIN_CLOSE", payload: false })
    }, [])

    return (
        <div className="HomePage" >
            <img className="home__image" src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg" alt="Home Page" />
            {
                !isLoading ?
                    <div className="home__row" >
                        {
                            data.map((eachProduct, i) => {
                                return <Product key={i} id={eachProduct.id} title={eachProduct.title} price={eachProduct.price} category={eachProduct.category} image={eachProduct.image} rating={eachProduct.rating.rate} />
                            })
                        }
                    </div>
                    :
                    <Loading />
            }
        </div>
    )
}

export default HomePage
