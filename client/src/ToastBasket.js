import React from 'react'

function ToastBasket({ id, title, image }) {
    return (
        <a target="_blank" rel="noreferrer" href={`/product/${id}`} >
            <div className="notification__product" >
                <p><strong>{title.trim()}</strong> added to your Basket</p>
                <img src={image} alt={title} />
            </div>
        </a>
    )
}

export default ToastBasket
