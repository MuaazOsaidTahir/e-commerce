import CryptoJS, { AES } from 'crypto-js';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import "./Success.css"

function Success() {
    const history = useHistory();
    const { sessionId } = useParams()
    const dispatch = useDispatch()
    const products = useSelector(store => store.products)
    const socket = useSelector(store => store.socket)
    const user = useSelector(store => store.user)

    useEffect(() => {
        if (!sessionId) {
            history.push("/");
        }
    }, [sessionId])

    useEffect(() => {
        let decoded = AES.decrypt(decodeURIComponent(sessionId), "muaazosaidtahir");
        let status = decoded.toString(CryptoJS.enc.Utf8);
        if (socket && status) {
            let socketObj = {
                products: products,
                user: user
            }
            socket.emit("item_purchased", socketObj)

            dispatch({ type: "EMPTY_CART", payload: [] })
        }
    }, [socket])

    const redirecttohome = () => {
        history.push("/")
    }

    return (
        <div className="Success" >
            <img src="https://res.cloudinary.com/muaaz/image/upload/v1631106912/undraw_Order_delivered_re_v4ab_1_ooecig.svg" alt="logo" />
            <strong> Your Order has Been placed successfully and will be delivered to you soon. </strong>
            <button onClick={redirecttohome} style={{ width: "auto" }} className="sidebar__loginbtn" > Continue Shopping </button>
        </div>
    )
}

export default Success
