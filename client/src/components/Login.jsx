import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

const submitCredentials = (route, username, password) => {
  const toSend = JSON.stringify({username, password});
  console.log(`toSend: ${toSend}`)
  return fetch(route, { 
    //important for the port to be the same as the client sending when using proxy
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // withCredentials: true, //in order to be able to save cookies from the response (?)
    },
    body: toSend //could this be a problem at the receiving end?
  }).then(res => res.json()); //either true or false 
}

const Login = ({setUser}) => {
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
      setUser(username);
      console.log(`login.jsx: setting user to '${username}'`);
      alert('Login successful');
      history.push('/');
      window.location.reload(); //interesting that it doesn't work the other way around (i.e history push after reload)
    } else {
      alert('Login unsuccessful');
      // TODO: Alert temporarily appearing on the bottom informing the user
      // if the attempt was successful or unsuccessful. 
    }
    setUsername('');
    setPassword('');
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerUsername === '' || registerPassword === '') {
      // TODO: again have this as a temporary message box
      alert('All fields are required');
      return;
    }
    
    const auth = await submitCredentials('/registerUser', registerUsername, registerPassword);
    if (auth) {
      setUser(registerUsername)
      console.log(`login.jsx: setting user to '${registerUsername}'`);

      alert('Register successful');
      history.push('/');
      window.location.reload();
    } else {
      // The client should probably not be assuming that 'user exists'
      // Simply because the request was rejected?
      alert('User already exists. Register unsuccessful 1');
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
