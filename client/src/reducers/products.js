import AES from "crypto-js/aes";
import CryptoJS from "crypto-js"

let store = null;
if (localStorage.getItem("add-to-cart")) {
    let decoded = AES.decrypt(localStorage.getItem("add-to-cart"), "muaazosaidtahir");
    store = JSON.parse(decoded.toString(CryptoJS.enc.Utf8));
}

function products(state = store || [], action) {
    switch (action.type) {
        case "ADD_TO_BASKET":
            const a = state.filter(product => product.id === action.payload.id);
            if (a.length) {
                let obj = {
                    id: a[0].id,
                    price: a[0].price,
                    category: a[0].category,
                    rating: a[0].rating,
                    image: a[0].image,
                    title: a[0].title,
                    quantity: a[0].quantity + 1,
                }
                let filteredProducts = state.filter(product => product.id !== action.payload.id);
                state = [...filteredProducts, obj];

                localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(state), "muaazosaidtahir")).toString())
                return state;
            } else {
                state = [...state, action.payload]
                localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(state), "muaazosaidtahir")).toString())
            }
            return state;

        case "REMOVE_FROM_BASKET":
            let removedProducts = state.filter(product => product.id !== action.payload)
            localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(removedProducts), "muaazosaidtahir")).toString())
            return removedProducts;

        case "INCREASE":
            let product = state.filter(product => product.id === action.payload);
            let obj = {
                id: product[0].id,
                price: product[0].price,
                category: product[0].category,
                rating: product[0].rating,
                image: product[0].image,
                title: product[0].title,
                quantity: product[0].quantity + 1,
            }

            let filtered = state.filter(eachproduct => eachproduct.id !== action.payload);
            state = [obj, ...filtered];
            localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(state), "muaazosaidtahir")).toString())
            return state;

        case "DECREASE":
            let filterproduct = state.filter(product => product.id === action.payload);
            let object = {
                id: filterproduct[0].id,
                price: filterproduct[0].price,
                category: filterproduct[0].category,
                rating: filterproduct[0].rating,
                image: filterproduct[0].image,
                title: filterproduct[0].title,
                quantity: filterproduct[0].quantity - 1,
            }

            let filteredList = state.filter(eachproduct => eachproduct.id !== action.payload);
            state = [object, ...filteredList];
            localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(state), "muaazosaidtahir")).toString())
            return state;

        case "EMPTY_CART":
            state = action.payload
            localStorage.setItem("add-to-cart", (AES.encrypt(JSON.stringify(state), "muaazosaidtahir")).toString())
            return state;

        default:
            return state;
    }
}

export default products
