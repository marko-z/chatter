import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

const submitCredentials = (route, username, password) => {
  const toSend = JSON.stringify({username, password});
  console.log(`toSend: ${toSend}`)
  return fetch('http://localhost:3001'+ route, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: toSend //could this be a problem at the receiving end?
  }).then(res => res.json()); //either true or false 
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const history = useHistory();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = await submitCredentials('/loginUser', username, password);
    if (auth) {
      alert('Login successful');
      history.push('/');
    } else {
      alert('Login unsuccessful');
      // How can I implement an alert appearing at the bottom
      // Saying that the login failed 
    }

    setUsername('');
    setPassword('');
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerUsername === '' || registerPassword === '') {
      alert('All fields are required');
      return;
    }
    
    const token = await submitCredentials('/registerUser', registerUsername, registerPassword);
    if (token) {
      alert('Register successful');
      history.push('/');
    } else {
      alert('User already exists. Register unsuccessful');
    }
    setRegisterUsername('');
    setRegisterPassword('');
  }

  return (
    <>
      <div className='vertical-bar'></div>
      <form id='login'>
        <div className='separator'>Sign up</div>
          <input type='text' className='login-input' placeholder='Username' value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
          <input type='password' className='login-input' placeholder='Confirm Password'  />
          <button className='login-button' onClick={handleRegister}>Sign up</button>
        <div className='separator'>Log in (no password for guest)</div>
          <input type='text' className='login-input' placeholder='Username' value={username}  onChange={(e) => setUsername(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className='login-button' onClick={handleLogin}>Sign in</button>
      </form>
      <div className='vertical-bar'></div>
    </>
  )
}

export default Login;