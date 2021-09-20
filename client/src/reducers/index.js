import { combineReducers } from "redux";

import products from "./products"
import socket from "./socket";
import user from "./user"

export default combineReducers({
    products: products,
    user: user,
    socket: socket,
})