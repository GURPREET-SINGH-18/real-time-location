import React, { useRef,useContext } from 'react';
import "./register.css";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom";

export default function Register() {
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const username = useRef();
    const role = useRef();
    const hotelId = useRef();

    const navigate = useNavigate();

    var handleClick = async (e)=> {
        e.preventDefault();
        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match");
        }
        else{
            const user={
                username:username.current.value,
                email:email.current.value,
                password:password.current.value,
                role:role.current.value,
                hotelId:hotelId.current.value,            
            }
            console.log(user)
            try {
                await axios.post("/auth/register",user)
                navigate('/login')
            } catch (err) {
                console.log(err)
            }
            console.log(user)
            console.log(role.current.value)
        }
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">***</h3>
                    <span className="loginDesc">
                        ***********
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input type="text" className="loginInput" placeholder="Username" 
                        ref={username}
                        required
                        />
                        <input type="Email" className="loginInput" placeholder="Email"
                        ref={email}
                        required
                        />
                            <select name="role" id="roles" className="loginInput" ref={role} >
                                <option value="guest" disabled selected>Select your role:</option>
                                <option value="admin">Admin</option>
                                <option value="driver">Driver</option>
                                <option value="guest">Guest</option>
                            </select>
                            <select name="hotelId" id="hotel" className="loginInput" ref={hotelId} >
                                <option value="guest" disabled selected>Select your hotelId:</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </select>
                        <input type="password" className="loginInput" placeholder="Password"
                        ref={password}
                        required
                        minLength="6"
                        />
                        <input type="Password" className="loginInput" placeholder="Confirm Password"
                        ref={passwordAgain}
                        required
                        />
                        <button className="loginButton"
                        type="submit"
                        >Sign In</button>
                        <Link to={'/login'} sty>
                        <button className="loginRegisterButton">
                            Log In to your account
                        </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
