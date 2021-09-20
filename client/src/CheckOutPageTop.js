import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import "./CheckOutPageTop.css"
import ModalComponent from "./Modal"

function CheckOutPageTop() {
    const products = useSelector(store => store.products)
    const [totalprice, settotalprice] = useState(0)
    const [toggle, settoggle] = useState(false)

    useEffect(() => {
        settotalprice(0);
        products.map(product => {
            settotalprice((val) => {
                return val + (product.quantity * product.price)
            })
        })
    }, [products])
    
    const toggling = (para) => {
        settoggle(para);
    }

    return (
        <>
            <ModalComponent toggling={toggling} toggle={toggle} />
            <div className="CheckOutPageTop" >
                <img src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg" alt="logo" />
                <div className="payment__box" >
                    <p> SubTotal <strong>{products.length}</strong> items: <strong>${totalprice.toFixed(2)}</strong> </p>
                    <button onClick={() => settoggle(true)} >Proceed To CheckOut</button>
                </div>
            </div>
        </>
    )
}

export default CheckOutPageTop
