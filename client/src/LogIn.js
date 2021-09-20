import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import "./LogIn.css"
import { loginuserin, signupuser } from "./GraphQL/gqlschema"
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import Loading from './Loading'

function LogIn({ toggle }) {
    const [userDetails, setuserDetails] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [userSignup, { data, loading, error }] = useMutation(signupuser)
    const [loginUser, loggedinuser] = useMutation(loginuserin)
    const dispatch = useDispatch();
    const history = useHistory();

    const userdatadetails = (e) => {
        const { name, value } = e.target;

        setuserDetails((val) => {
            return {
                ...val,
                [name]: value
            }
        })

    }

    const signinupuser = () => {
        userSignup({
            variables: {
                name: userDetails.name,
                email: userDetails.email,
                password: userDetails.password
            }
        })
    }

    const loggingInUser = () => {
        loginUser({
            variables: {
                email: userDetails.email,
                password: userDetails.password,
            }
        })
    }

    useEffect(() => {
        if (data) {
            // console.log(data || loggedinuser.data.loginUser);
            dispatch({ type: "ADD_USER", payload: data.signupUser })
            history.push("/");
        }
        else if (error) {
            alert(error.message);
        }
        if (loggedinuser.data) {
            dispatch({ type: "ADD_USER", payload: loggedinuser.data.loginUser });
            history.push("/");
        }
        else if(loggedinuser.error) {
            alert(loggedinuser.error.message)
        }
    }, [data, loggedinuser.data])

    return (
        <div className="LogIn" >
            <Link to="/" >
                <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="Logo" />
            </Link>
            <div className="login__container" >
                {toggle ? <h1>Log-In</h1> : <h1>Sign-Up</h1>}
                <div className="login__inputs" >
                    {
                        !toggle &&
                        <>
                            <h3>Username</h3>
                            <input name="name" value={userDetails.name} onChange={userdatadetails} />
                        </>
                    }
                    <h3>Email</h3>
                    <input name="email" value={userDetails.email} onChange={userdatadetails} />
                    <h3>Password</h3>
                    <input name="password" value={userDetails.password} onChange={userdatadetails} />
                    {toggle ? <button onClick={loggingInUser} >LogIn</button> : <button onClick={signinupuser} > SignUp </button>}
                </div>
                {
                    loggedinuser.loading || loading ?
                        <Loading /> :
                        <>
                            <p> By signing {toggle ? "in" : "up"} you agree to the amazon fake clone conditions of use & sale. Please see our privacy Notice, our Cookies Notice and our Interest-Based Ads Notice. </p>
                            {
                                toggle ?
                                    <Link to="/register" >
                                        <button className="register__btn" > Create Your Account </button>
                                    </Link> :
                                    <Link to="/login" >
                                        <button className="register__btn" > LogIn to Your Account </button>
                                    </Link>
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default LogIn
