const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } = graphql;
const { userModel } = require("../db/dbSchema")
const jwt = require('jsonwebtoken')

const product = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        price: { type: GraphQLString },
        quantity: { type: GraphQLString },
    })
});

const historyFormat = new GraphQLObjectType({
    name: "History",
    fields: () => ({
        id: { type: GraphQLString },
        date: { type: GraphQLString },
        totalPrice: { type: GraphQLString },
        products: {
            type: new GraphQLList(product),
            resolve(parent, args) {
                return parent.products;
            }
        }
    })
});

const userSchema = new GraphQLObjectType({
    name: "UserSchema",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        history: {
            type: new GraphQLList(historyFormat),
            resolve(parent, args) {
                return parent.history;
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: () => ({
        getHistory: {
            type: new GraphQLList(historyFormat),
            args: { date: { type: GraphQLString }, id: { type: GraphQLString } },
            async resolve(parent, args) {
                const user = await userModel.findById(args.id);
                let filteredByDate = user.history.filter(sale => sale.date === args.date);
                return filteredByDate
            }
        },
        getloggedinUser: {
            type: userSchema,
            async resolve(_, __, { req }) {
                // console.log(req.headers.cookie);
                if (req.headers.cookie) {
                    const token = req.headers.cookie.split("=")[1]
                    const userdata = jwt.verify(token, process.env.SECRET_KEY);
                    const data = await userModel.findOne({ _id: userdata._id, "tokens.token": token });
                    // console.log(data);
                    return data
                }
            }
        }
    })
})

const MutationQuery = new GraphQLObjectType({
    name: "MutationQuery",
    fields: () => ({
        signupUser: {
            type: userSchema,
            args: { name: { type: GraphQLString }, email: { type: GraphQLString }, password: { type: GraphQLString } },
            async resolve(parent, args, { res }) {
                const user = await userModel.findOne({ email: args.email });
                // console.log(user);
                if (!user) {
                    const newUser = new userModel({ name: args.name, email: args.email, password: args.password })
                    const token = await newUser.generateAuthToken();

                    res.cookie("user_auth", token, {
                        expires: new Date(Date.now() + 604800000),
                        httpOnly: true,
                    });

                    return newUser;
                }
                else {
                    throw new Error("User Already Registered");
                }
            }
        },
        loginUser: {
            type: userSchema,
            args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
            async resolve(parent, args, { res, req }) {
                const user = await userModel.findOne({ email: args.email });
                if (user) {
                    const token = await user.generateAuthToken();

                    console.log(token);
                    res.cookie("user_auth", token, {
                        expires: new Date(Date.now() + 604800000),
                        httpOnly: true,
                    });

                    return user;
                }
                else {
                    throw new Error("User not registered");
                }
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: MutationQuery
})

