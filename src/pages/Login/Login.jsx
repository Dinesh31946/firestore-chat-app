import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { login, signup } from '../../config/firebase'

const Login = () => {

  const [currentState, setCurrentState] = useState("Login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
      event.preventDefault();
      if(currentState === "Sign up"){
          signup(userName, email, password);
      }else{
          login(email, password);
      }
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />
      <form onSubmit={submitHandler} className='login-form'>
          <h2>{currentState}</h2>
          {currentState === "Sign up" ? <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" name='username' placeholder='Username' className="form-input" required />: null}
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' className="form-input" id='email' required />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className="form-input" id='password' required />
          <button type='submit'>{currentState === "Sign up" ? "Sign Up" : "Login"}</button>
          <div className="login-term">
            <input type="checkbox"/>
            <p>Agree to the terms of use & privacy policy.</p>
          </div>
          <div className="login-forgot">
              {
                currentState === "Sign up"
                ? <p className="login-toggle">Already have an account <span onClick={() => setCurrentState("Login")}>Click Here</span> </p>
                : <p className="login-toggle">Create an account <span onClick={() => setCurrentState("Sign up")}>Click Here</span> </p>
              }
          </div>
      </form>
    </div>
  )
}

export default Login
