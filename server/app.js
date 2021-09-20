require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const { userModel } = require("./db/dbSchema")
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const moment = require('moment');
const schema = require("./graphql/graphqlSchema")
const stripe = require('stripe')(process.env.STRIPE_KEY)
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

require("./db/db")
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.get("/signout", (req, res) => {
    res.status(200).clearCookie("user_auth");
    return res.json({ data: null })
})

app.post("/create-checkout", async (req, res) => {
    const { products, decodedCode } = req.body;
    // console.log(decodedCode)
    // console.log(req.headers.cookie);

    const token = req.headers.cookie.split("=")[1]
    const userdata = jwt.verify(token, process.env.SECRET_KEY);
    const data = await userModel.findOne({ _id: userdata._id, "tokens.token": token });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: products.map(item => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            }
        }),
        billing_address_collection: "required",
        success_url: `${process.env.CLIENT_URL}/success/${decodedCode}`,
        cancel_url: `${process.env.CLIENT_URL}/`,
    })

    let allPrice = 0;

    products.map(item => {
        allPrice = allPrice + (item.quantity * item.price)
    })

    let object = {
        date: moment().format("MMM Do YY"),
        totalPrice: allPrice,
        products: products
    }

    await data.addHistory(object);

    return res.json({ url: session.url })
})

app.use("/graphql", graphqlHTTP((req, res) => ({
    schema: schema,
    graphiql: true,
    context: { req, res }
})))

server.listen(8000, () => {
    console.log("Server Running");
})

io.on("connect", (socket) => {
    // console.log(socket.id)

    socket.on("home", (data) => {
        console.log(data);
        socket.broadcast.emit("demo", data);
    })

    socket.on("item_purchased", (data) => {
        const { products, user } = data;

        let broadcastObj = {
            product: products[Math.floor(Math.random() * products.length)],
            name: user.name,
        }

        let allPrice = 0;

        products.map(item => {
            allPrice = allPrice + (item.quantity * item.price)
        })

        const msg = {
            from: "muaazosaid@gmail.com",
            template_id: "d-f2fa911cac8f4f1c8731071a136ec542",
            personalizations: [{
                to: { email: user.email },
                dynamic_template_data: {
                    subject: "Order-Confirmed",
                    user__name: user.name,
                    products: products,
                    totalamount: allPrice,
                }
            }]
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })

        socket.broadcast.emit("product_sold", broadcastObj)
    })
})