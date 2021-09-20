import React from 'react'

function Toast({ para }) {
    return (
        <>
            <a target="_blank" rel="noreferrer" href={`/product/${para.product?.id}`} >
                <div className="notification__product" >
                    <h3> Hot Selling Product </h3>
                    <div className="notification__innerdiv" >
                        <p>{para?.name} just bought {para.product?.title} </p>
                        <img src={`${para.product?.image}`} alt="" />
                    </div>
                </div>
            </a >
        </>
    )
}

export default Toast
