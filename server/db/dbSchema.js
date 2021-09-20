const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    history: [{
        date: String,
        totalPrice: String,
        products: [
            {
                title: String,
                image: String,
                price: String,
                quantity: String,
            }
        ]
    }],
    tokens: [
        {
            token: String,
        }
    ]
})

UserSchema.methods.addHistory = async function (obj) {
    this.history = this.history.concat({ ...obj })
    await this.save();
}

UserSchema.methods.generateAuthToken = async function () {
    var token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
}

const userModel = new mongoose.model("user", UserSchema);

module.exports = { userModel };