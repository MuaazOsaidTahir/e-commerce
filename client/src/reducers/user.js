function user(state = null, action) {
    switch (action.type) {
        case "ADD_USER":
            state = action.payload;
            return state;

        case "SIGN_OUT":
            state = action.payload;
            return state

        default:
            return state;
    }
}

export default user
