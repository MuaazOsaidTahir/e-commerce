function socket(state = null, action) {
    switch (action.type) {
        case "ADD_SOCKET":
            state = action.payload;
            return state;

        default:
            return state;
    }
}

export default socket
