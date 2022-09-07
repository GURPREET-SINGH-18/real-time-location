import React, { useRef,useContext } from 'react'
import "./login.css"
import {loginCall} from "../../apiCalls";
import {AuthContext} from '../../context/AuthContext'
import { CircularProgress } from '@mui/material';
import {Link} from "react-router-dom"

export default function Login() {
    const email = useRef();
    const password = useRef();

    const {user,isFetching,error,dispatch} = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({
            email:email.current.value,
            password:password.current.value
        },dispatch)
        console.log(email.current.value);
    }
    console.log(user);
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">*****</h3>
                    <span className="loginDesc">
                        ***********
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input type="Email" className="loginInput" placeholder="Email" ref={email} 
                        required
                        />
                        <input type="Password" className="loginInput" placeholder="Password" ref={password} 
                        required
                        minLength={"4"}
                        />
                        <button className="loginButton">{isFetching ? <CircularProgress style={{color:"black"}}/>:"Log In"}</button>
                        <span className="loginForgot">
                            Forgot Password?
                        </span>
                        <Link to="/register">
                        <button className="loginRegisterButton">
                            Create a New Account
                        </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
