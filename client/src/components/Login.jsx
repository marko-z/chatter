import React, { useEffect, useState } from 'react';
import './Login.css';

const submitCredentials = (route, username, password) => {
  return fetch('http://localhost:3001/'+route, {
    method: 'POST',
    header: {'Content-Type': 'application/json'},
    body: JSON.stringify(username,password)
  }).then(res => res.json());
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  //<input ... () => setSignUp(false) on focus or click?
  useEffect(() => {
    if (registerUsername || registerPassword) {
      setUsername('');
      setPassword('');   
    }
    if (username || password) {
      setRegisterUsername('');
      setRegisterPassword('');
    }
  },[username, password, registerUsername, registerPassword])

  handleLogin = (e) => {
    e.preventDefault();
    const token = await submitCredentials('/loginUser', username, password);
    console.log(token);

    if (token) {
      // Redirect to chat page, set the user identity somehow?
    } else {
      // How can I implement an alert appearing at the bottom
      // Saying that the login failed 
    }

  }

  handleRegister = (e) => {
    e.preventDefault();
    const token = await submitCredentials('/registerUser', registerUsername, registerPassword);
    console.log(token);

    // We need to check the returned object, because the username
    // Could be taken
    if (token) {

    } else {

    }
  }

  return (
    <>
      <div className='vertical-bar'></div>
      <form id='login'>
        <div className='separator'>Sign up</div>
          <input type='text' className='login-input' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type='password' className='login-input' placeholder='Confirm Password'  />
          <button className='login-button'>Sign up</button>
        <div className='separator'>Log in (no password for guest)</div>
          <input type='text' className='login-input' placeholder='Username' value={registerUsername}  onChange={(e) => setRegisterUsername(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
          <button className='login-button'>Sign in</button>
      </form>
      <div className='vertical-bar'></div>
    </>
  )
}

export default Login;